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

    // ── STEP 4: Determine existing products ──
    const allPlus = rowsDedup.map((r) => r.codigo_plu as string)
    const { data: existingProducts } = await adminClient
      .from('productos')
      .select('codigo_plu, categoria_slug')
      .in('codigo_plu', allPlus)

    const existingMap = new Map<string, string>(
      (existingProducts as any[])?.map((p: any) => [p.codigo_plu, p.categoria_slug]) ?? []
    )
    const existingSet = new Set(existingMap.keys())

    // ── STEP 5: Filter rows by mode BEFORE upsert ──
    let filasAProcesar: any[]
    let omitidos = 0

    if (modo === 'actualizar') {
      // Only touch products that ALREADY exist. Everything else is counted
      // as omitted and NOT inserted.
      filasAProcesar = rowsDedup.filter((r) => existingSet.has(r.codigo_plu))
      omitidos = rowsDedup.length - filasAProcesar.length
    } else {
      // catalogo_completo: process all rows (existing + new)
      filasAProcesar = rowsDedup
    }

    let actualizados = 0
    let nuevos = 0
    let sinTaccCount = 0
    let errores = 0

    // ── STEP 6: Upsert in batches ──
    const BATCH_SIZE = 50
    for (let i = 0; i < filasAProcesar.length; i += BATCH_SIZE) {
      const batch = filasAProcesar.slice(i, i + BATCH_SIZE)

      const upsertData = batch.map((row: any) => {
        const isExisting = existingSet.has(row.codigo_plu)
        if (isExisting) {
          // Existing products: only update name, price, sin_tacc.
          // NEVER overwrite disponible, destacado, badge, orden, imagen_url.
          // MUST supply categoria_slug to satisfy the NOT NULL constraint in Supabase.
          return {
            codigo_plu: row.codigo_plu,
            nombre: row.nombre,
            precio: row.precio,
            categoria_slug: existingMap.get(row.codigo_plu) || row.categoria_slug,
            es_sin_tacc: row.es_sin_tacc ?? false,
            updated_at: new Date().toISOString(),
          }
        }
        // New products: created ACTIVE so they appear immediately.
        // Admin can deactivate individual items or bulk-toggle later.
        return {
          codigo_plu: row.codigo_plu,
          nombre: row.nombre,
          precio: row.precio,
          categoria_slug: row.categoria_slug,
          es_sin_tacc: row.es_sin_tacc ?? false,
          disponible: true,
          destacado: false,
          orden: 0,
        }
      })

      const { error: upsertError } = await adminClient
        .from('productos')
        .upsert(upsertData, { onConflict: 'codigo_plu', ignoreDuplicates: false })

      if (upsertError) {
        console.error(
          `Batch upsert error (rows ${i + 1}-${i + batch.length}):`,
          upsertError
        )
        errores += batch.length
      } else {
        batch.forEach((row: any) => {
          if (row.es_sin_tacc) sinTaccCount++
          if (existingSet.has(row.codigo_plu)) {
            actualizados++
          } else {
            nuevos++
          }
        })
      }
    }

    // ── STEP 7: Save to history (with modo) ──
    await adminClient.from('uploads_historial').insert({
      nombre_archivo: filename || 'archivo.xlsx',
      total_filas: rows.length,
      productos_actualizados: actualizados,
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
