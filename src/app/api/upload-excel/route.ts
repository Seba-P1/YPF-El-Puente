import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    // PASO 1 — Verificar autenticación
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

    // PASO 2 — Parsear body
    const body = await request.json()
    const { rows, filename } = body

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'El array de filas está vacío o no es válido.' },
        { status: 400 }
      )
    }

    // Validate each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row.codigo_plu || typeof row.codigo_plu !== 'string') {
        return NextResponse.json(
          { error: `Fila ${i + 1}: codigo_plu es obligatorio y debe ser texto.` },
          { status: 400 }
        )
      }
      if (typeof row.precio !== 'number' || row.precio < 0) {
        return NextResponse.json(
          { error: `Fila ${i + 1}: precio debe ser un número positivo.` },
          { status: 400 }
        )
      }
    }

    // PASO 3 — Service Role client (bypasses RLS)
    const adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    ) as any

    // PASO 4 — Determine existing vs new
    const allPlus = rows.map((r: any) => r.codigo_plu as string)
    const { data: existingProducts } = await adminClient
      .from('productos')
      .select('codigo_plu')
      .in('codigo_plu', allPlus)

    const existingSet = new Set((existingProducts as any[])?.map((p: any) => p.codigo_plu) ?? [])

    let actualizados = 0
    let nuevos = 0
    let errores = 0

    // PASO 5 — Upsert in batches
    const BATCH_SIZE = 50
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE)

      const upsertData = batch.map((row: any) => {
        const isExisting = existingSet.has(row.codigo_plu)
        return {
          codigo_plu: row.codigo_plu,
          precio: row.precio,
          // Only set defaults for new products
          ...(isExisting
            ? {}
            : {
                nombre: `Producto ${row.codigo_plu}`,
                categoria_slug: 'sin-categoria',
                disponible: true,
                destacado: false,
                orden: 0,
              }),
        }
      })

      const { error: upsertError } = await adminClient
        .from('productos')
        .upsert(upsertData, {
          onConflict: 'codigo_plu',
          ignoreDuplicates: false,
        })

      if (upsertError) {
        console.error(`Batch upsert error (rows ${i + 1}-${i + batch.length}):`, upsertError)
        errores += batch.length
      } else {
        batch.forEach((row: any) => {
          if (existingSet.has(row.codigo_plu)) {
            actualizados++
          } else {
            nuevos++
          }
        })
      }
    }

    // PASO 6 — Save to history
    await adminClient.from('uploads_historial').insert({
      nombre_archivo: filename || 'archivo.xlsx',
      total_filas: rows.length,
      productos_actualizados: actualizados,
      productos_nuevos: nuevos,
      productos_error: errores,
      subido_por: user.id,
    })

    // PASO 7 — Return result
    return NextResponse.json({
      success: errores === 0,
      result: {
        actualizados,
        nuevos,
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
