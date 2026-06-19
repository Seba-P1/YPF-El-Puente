import 'server-only'
import { createClient as createServerSupabaseClient } from './server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import type { Database } from './types'
import type {
  Producto,
  Categoria,
  Combustible,
  ConfiguracionItem,
  UploadHistorial,
} from './types'
import type { ExcelRow, UploadResult } from '@/types'

// Service role client for admin operations that bypass RLS
function getServiceClient() {
  return createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) as any
}

// ── PRODUCTOS ──

export async function getProductosByCategoria(
  categoriaSlug: string
): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('categoria_slug', categoriaSlug)
    .eq('disponible', true)
    .order('orden', { ascending: true })

  if (error) throw new Error(`Error fetching productos: ${error.message}`)
  return data ?? []
}

export async function getProductoById(id: string): Promise<Producto | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Error fetching producto: ${error.message}`)
  return data ?? null
}

export async function getAllProductos(): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('categoria_slug')
    .order('orden', { ascending: true })

  if (error) throw new Error(`Error fetching all productos: ${error.message}`)
  return data ?? []
}



export async function upsertProductos(
  rows: ExcelRow[]
): Promise<UploadResult> {
  const serviceClient = getServiceClient()
  const result: UploadResult = {
    success: true,
    actualizados: 0,
    nuevos: 0,
    errores: 0,
    detalles: [],
  }

  // Get existing PLU codes to distinguish new vs updated
  const plus = rows.map((r) => r.codigo_plu)
  const { data: existing } = await serviceClient
    .from('productos')
    .select('codigo_plu')
    .in('codigo_plu', plus)

  const existingPlus = new Set((existing as any[])?.map((e: any) => e.codigo_plu) ?? [])

  // Process in batches of 50
  const batchSize = 50
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)

    const { error } = await serviceClient.from('productos').upsert(
      batch.map((row) => ({
        codigo_plu: row.codigo_plu,
        precio: row.precio,
        nombre: existingPlus.has(row.codigo_plu)
          ? undefined!
          : `Producto ${row.codigo_plu}`,
        categoria_slug: existingPlus.has(row.codigo_plu)
          ? undefined!
          : 'sin-categoria',
        disponible: true,
        destacado: false,
        orden: 0,
      })),
      { onConflict: 'codigo_plu', ignoreDuplicates: false }
    )

    if (error) {
      result.errores += batch.length
      result.detalles.push(`Batch error (rows ${i + 1}-${i + batch.length}): ${error.message}`)
    } else {
      batch.forEach((row) => {
        if (existingPlus.has(row.codigo_plu)) {
          result.actualizados++
        } else {
          result.nuevos++
        }
      })
    }
  }

  result.success = result.errores === 0
  return result
}



// ── CATEGORÍAS ──

export async function getCategorias(): Promise<Categoria[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('activa', true)
    .order('orden', { ascending: true })

  if (error) throw new Error(`Error fetching categorias: ${error.message}`)
  return data ?? []
}

// ── COMBUSTIBLES ──

export async function getCombustibles(): Promise<Combustible[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('combustibles')
    .select('*')
    .eq('disponible', true)
    .order('orden', { ascending: true })

  if (error) throw new Error(`Error fetching combustibles: ${error.message}`)
  return data ?? []
}



// ── CONFIGURACIÓN ──

export async function getConfiguracion(): Promise<Record<string, string>> {
  const supabase = (await createServerSupabaseClient()) as any
  const { data, error } = await supabase
    .from('configuracion_tienda')
    .select('*')

  if (error)
    throw new Error(`Error fetching configuracion: ${error.message}`)

  const config: Record<string, string> = {}
  data?.forEach((item: any) => {
    config[item.clave] = item.valor ?? ''
  })
  return config
}



// ── HISTORIAL ──

export async function getUploadsHistorial(
  limit: number = 10
): Promise<UploadHistorial[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('uploads_historial')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error)
    throw new Error(`Error fetching uploads historial: ${error.message}`)
  return data ?? []
}

export async function getAllCategorias(): Promise<Categoria[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('orden', { ascending: true })

  if (error) throw new Error(`Error fetching all categorias: ${error.message}`)
  return data ?? []
}

export async function getAuditLogs(limit: number = 50): Promise<any[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Error fetching audit logs: ${error.message}`)
  return data ?? []
}


