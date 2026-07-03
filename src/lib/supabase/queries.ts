import 'server-only'
import { createClient as createServerSupabaseClient } from './server'
import type {
  Producto,
  Categoria,
  Combustible,
  ConfiguracionItem,
  UploadHistorial,
} from './types'

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

export async function getProductosDestacados(): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('disponible', true)
    .eq('destacado', true)
    .order('orden', { ascending: true })

  if (error) throw new Error(`Error fetching productos destacados: ${error.message}`)
  return data ?? []
}

export async function getCatalogoCompleto(): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('disponible', true)
    .order('categoria_slug', { ascending: true })
    .order('nombre', { ascending: true })

  if (error) throw new Error(`Error fetching catalogo completo: ${error.message}`)
  return data ?? []
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
