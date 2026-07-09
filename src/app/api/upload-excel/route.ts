import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    // ── STEP 1: Verify authentication ──
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // No-op in API routes
          },
        },
      }
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // ── STEP 1b: Verify admin role ──
    if (user.app_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Sin permisos de administrador' },
        { status: 403 }
      )
    }

    // ── STEP 2: Parse body with modo ──
    const body = await request.json()
    const { rows, filename, modo } = body

    if (modo !== 'actualizar' && modo !== 'catalogo_completo') {
      return NextResponse.json(
        { error: 'Modo inválido. Debe ser "actualizar" o "catalogo_completo".' },
        { status: 400 }
      )
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'El array de filas está vacío o no es válido.' },
        { status: 400 }
      )
    }

    const MAX_ROWS = 2000
    if (rows.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `Demasiadas filas (máximo ${MAX_ROWS}).` },
        { status: 413 }
      )
    }

    // Validate each row with the new shape
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row.codigo_plu || typeof row.codigo_plu !== 'string') {
        return NextResponse.json(
          { error: `Fila ${i + 1}: codigo_plu es obligatorio.` },
          { status: 400 }
        )
      }
      if (!row.nombre || typeof row.nombre !== 'string') {
        return NextResponse.json(
          { error: `Fila ${i + 1}: nombre es obligatorio.` },
          { status: 400 }
        )
      }
      if (typeof row.precio !== 'number' || row.precio <= 0) {
        return NextResponse.json(
          { error: `Fila ${i + 1}: precio debe ser un número positivo.` },
          { status: 400 }
        )
      }
      if (!row.categoria_slug || typeof row.categoria_slug !== 'string') {
        return NextResponse.json(
          { error: `Fila ${i + 1}: categoria_slug es obligatorio.` },
          { status: 400 }
        )
      }
    }

    // Defensive dedup by codigo_plu (prevents Postgres "ON CONFLICT DO UPDATE
    // command cannot affect row a second time" when two rows in the same batch
    // share a codigo_plu).
    const rowsDedup = Array.from(
      new Map(rows.map((r: any) => [r.codigo_plu, r])).values()
    ) as any[]

    // ── STEP 3: Service Role client (bypasses RLS) ──
    const adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    ) as any

    // ── STEP 4: Determine existing products (dual matching) ──
    const allCodigos = rowsDedup.map((r) => r.codigo_plu as string)

    // Vía 1: coincidencia por codigo_plu — comportamiento del catálogo grande
    const { data: existingByPlu } = await adminClient
      .from('productos')
      .select('codigo_plu, categoria_slug')
      .in('codigo_plu', allCodigos)

    // Vía 2: coincidencia por codigo_ypf — productos curados de Full Principal
    const { data: existingByYpf } = await adminClient
      .from('productos')
      .select('id, codigo_ypf')
      .in('codigo_ypf', allCodigos)
      .not('codigo_ypf', 'is', null)

    const existingMap = new Map<string, string>(
      (existingByPlu as any[])?.map((p: any) => [p.codigo_plu, p.categoria_slug]) ?? []
    )
    const existingSet = new Set(existingMap.keys())

    const mapaPorYpf = new Map<string, string>(
      (existingByYpf as any[])?.map((p: any) => [p.codigo_ypf, p.id]) ?? []
    )

    // ── STEP 5: Classify rows into THREE groups ──
    const filasCatalogo: any[] = []   // coincide por codigo_plu → update completo
    const filasCurado: any[] = []     // coincide por codigo_ypf → update SOLO precio
    const filasNuevas: any[] = []     // no coincide con nada

    for (const row of rowsDedup) {
      if (existingSet.has(row.codigo_plu)) {
        filasCatalogo.push({ ...row })
      } else if (mapaPorYpf.has(row.codigo_plu)) {
        filasCurado.push({ ...row, _id: mapaPorYpf.get(row.codigo_plu) })
      } else {
        filasNuevas.push(row)
      }
    }

    let omitidos = 0

    if (modo === 'actualizar') {
      // En modo actualizar, las filas nuevas NO se procesan
      omitidos = filasNuevas.length
      filasNuevas.length = 0
    }

    let actualizados = 0
    let sincronizadosCurados = 0
    let nuevos = 0
    let sinTaccCount = 0
    let errores = 0

    const BATCH_SIZE = 50

    // ── STEP 6a: Catálogo grande — mismo comportamiento que ya existía ──
    for (let i = 0; i < filasCatalogo.length; i += BATCH_SIZE) {
      const batch = filasCatalogo.slice(i, i + BATCH_SIZE)

      const upsertData = batch.map((row: any) => ({
        codigo_plu: row.codigo_plu,
        nombre: row.nombre,
        precio: row.precio,
        categoria_slug: existingMap.get(row.codigo_plu) || row.categoria_slug,
        es_sin_tacc: row.es_sin_tacc ?? false,
        updated_at: new Date().toISOString(),
      }))

      const { error: upsertError } = await adminClient
        .from('productos')
        .upsert(upsertData, { onConflict: 'codigo_plu', ignoreDuplicates: false })

      if (upsertError) {
        console.error(`Batch catálogo (${i}-${i + batch.length}):`, upsertError)
        errores += batch.length
      } else {
        batch.forEach((row: any) => {
          actualizados++
          if (row.es_sin_tacc) sinTaccCount++
        })
      }
    }

    // ── STEP 6b: Productos curados vinculados por codigo_ypf — SOLO precio ──
    for (const row of filasCurado) {
      const { error } = await adminClient
        .from('productos')
        .update({ precio: row.precio, updated_at: new Date().toISOString() })
        .eq('id', row._id)

      if (error) {
        console.error(`Error sincronizando producto curado id=${row._id}:`, error)
        errores++
      } else {
        sincronizadosCurados++
      }
    }

    // ── STEP 6c: Productos nuevos (solo en modo catalogo_completo) ──
    for (let i = 0; i < filasNuevas.length; i += BATCH_SIZE) {
      const batch = filasNuevas.slice(i, i + BATCH_SIZE)

      const upsertData = batch.map((row: any) => ({
        codigo_plu: row.codigo_plu,
        nombre: row.nombre,
        precio: row.precio,
        categoria_slug: row.categoria_slug,
        es_sin_tacc: row.es_sin_tacc ?? false,
        disponible: true,
        destacado: false,
        orden: 0,
      }))

      const { error: upsertError } = await adminClient
        .from('productos')
        .upsert(upsertData, { onConflict: 'codigo_plu', ignoreDuplicates: false })

      if (upsertError) {
        console.error(`Batch nuevos (${i}-${i + batch.length}):`, upsertError)
        errores += batch.length
      } else {
        batch.forEach((row: any) => {
          nuevos++
          if (row.es_sin_tacc) sinTaccCount++
        })
      }
    }

    // ── STEP 7: Save to history (with modo) ──
    await adminClient.from('uploads_historial').insert({
      nombre_archivo: filename || 'archivo.xlsx',
      total_filas: rows.length,
      productos_actualizados: actualizados + sincronizadosCurados,
      productos_nuevos: nuevos,
      productos_error: errores,
      modo,
      subido_por: user.id,
    })

    // ── STEP 8: Return enriched result ──
    return NextResponse.json({
      success: errores === 0,
      result: {
        actualizados,
        sincronizadosCurados,
        nuevos,
        omitidos,
        sinTacc: sinTaccCount,
        errores,
      },
    })
  } catch (error: any) {
    console.error('Upload Excel API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor. Intentá nuevamente.' },
      { status: 500 }
    )
  }
}
