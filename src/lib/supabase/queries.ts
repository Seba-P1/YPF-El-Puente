import 'server-only'
import { createClient as createServerSupabaseClient } from './server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import type { Database } from './types'
import type {
  Producto,
  Categoria,
  Combustible,
  BoxService,
  ConfiguracionItem,
  UploadHistorial,
  InstagramPost,
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

export async function getProductosPorCategoriaAdmin(
  categoriaSlug: string
): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('categoria_slug', categoriaSlug)
    .order('orden', { ascending: true })
    .order('nombre', { ascending: true })

  if (error) throw new Error(`Error fetching productos admin: ${error.message}`)
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

// ── BOXES SERVICES ──

const FALLBACK_SERVICIOS: BoxService[] = [
  { id: 'fallback-1',  nombre: 'Cambio de aceite',            descripcion: 'Lubricantes Elaion con la mejor tecnología.',   icono_slug: 'Droplets',     disponible: true, orden: 1 },
  { id: 'fallback-2',  nombre: 'Inflado de neumáticos',        descripcion: 'Control de presión y calibración.',            icono_slug: 'Gauge',        disponible: true, orden: 2 },
  { id: 'fallback-3',  nombre: 'Agua y refrigerante',          descripcion: 'Revisión y reposición de fluidos.',            icono_slug: 'Thermometer',  disponible: true, orden: 3 },
  { id: 'fallback-4',  nombre: 'Limpieza de parabrisas',       descripcion: 'Para tu máxima visibilidad en la ruta.',       icono_slug: 'Eye',          disponible: true, orden: 4 },
  { id: 'fallback-5',  nombre: 'Control de presión',           descripcion: 'Seguridad garantizada para tu viaje.',         icono_slug: 'Activity',     disponible: true, orden: 5 },
  { id: 'fallback-6',  nombre: 'Revisión general',             descripcion: 'Chequeo de 20 puntos clave de tu vehículo.',   icono_slug: 'CheckCircle2', disponible: true, orden: 6 },
]

export async function getBoxesServices(): Promise<BoxService[]> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('boxes_services')
      .select('*')
      .eq('disponible', true)
      .order('orden', { ascending: true })

    if (error) {
      console.warn('[boxes_services] Tabla no encontrada, usando fallback:', error.message)
      return FALLBACK_SERVICIOS
    }
    return data ?? []
  } catch (err) {
    console.warn('[boxes_services] Error inesperado, usando fallback:', err)
    return FALLBACK_SERVICIOS
  }
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
  const admin = createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await admin
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Error fetching audit logs: ${error.message}`)
  return data ?? []
}

// ── INSTAGRAM POSTS ──

export async function getInstagramPostsPublicos(): Promise<InstagramPost[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error) throw new Error(`Error fetching instagram posts: ${error.message}`)
  return data ?? []
}
