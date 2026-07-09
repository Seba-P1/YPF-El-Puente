'use server'

import { createClient } from './server'
import { getConfiguracion } from './queries'
import type { WhatsAppConfig } from '@/types'
import { z } from 'zod'
import { withAdminAction } from '@/lib/actions/with-admin-action'
import { revalidatePath } from 'next/cache'

const updateDisponibleSchema = z.object({
  id: z.string().uuid(),
  disponible: z.boolean(),
})

export const updateProductoDisponible = withAdminAction(
  updateDisponibleSchema,
  async ({ id, disponible }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('productos')
      .update({ disponible })
      .eq('id', id)

    if (error) throw new Error(`Error updating disponible: ${error.message}`)
    revalidatePath('/admin/productos')
    return { id, disponible }
  },
  { rateLimitKey: 'update-disponible', maxPerMinute: 60 }
)

const bulkDisponibleSchema = z.object({
  disponible: z.boolean(),
})

export const bulkUpdateDisponible = withAdminAction(
  bulkDisponibleSchema,
  async ({ disponible }) => {
    const supabase = (await createClient()) as any
    const { error, count } = await supabase
      .from('productos')
      .update({ disponible })
      .not('id', 'is', null) // match all rows

    if (error) throw new Error(`Error bulk-updating: ${error.message}`)
    revalidatePath('/admin/productos')
    return { disponible, count }
  },
  { rateLimitKey: 'bulk-disponible', maxPerMinute: 5 }
)

const updateDestacadoSchema = z.object({
  id: z.string().uuid(),
  destacado: z.boolean(),
})

export const updateProductoDestacado = withAdminAction(
  updateDestacadoSchema,
  async ({ id, destacado }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('productos')
      .update({ destacado })
      .eq('id', id)

    if (error) throw new Error(`Error updating destacado: ${error.message}`)
    revalidatePath('/admin/productos')
    return { id, destacado }
  },
  { rateLimitKey: 'update-destacado', maxPerMinute: 60 }
)

const updateBadgeSchema = z.object({
  id: z.string().uuid(),
  badge: z.string().nullable(),
})

export const updateProductoBadge = withAdminAction(
  updateBadgeSchema,
  async ({ id, badge }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('productos')
      .update({ badge })
      .eq('id', id)

    if (error) throw new Error(`Error updating badge: ${error.message}`)
    revalidatePath('/admin/productos')
    return { id, badge }
  },
  { rateLimitKey: 'update-badge', maxPerMinute: 60 }
)

const updatePrecioSchema = z.object({
  id: z.string().uuid(),
  precio: z.number().nonnegative(),
})

export const updateProductoPrecio = withAdminAction(
  updatePrecioSchema,
  async ({ id, precio }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('productos')
      .update({ precio, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(`Error updating precio: ${error.message}`)
    revalidatePath('/admin/productos')
    return { id, precio }
  },
  { rateLimitKey: 'update-precio', maxPerMinute: 60 }
)

const updateImagenSchema = z.object({
  id: z.string().uuid(),
  imagenUrl: z.string().url(),
  imagenPath: z.string(),
})

export const updateProductoImagen = withAdminAction(
  updateImagenSchema,
  async ({ id, imagenUrl, imagenPath }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('productos')
      .update({ imagen_url: imagenUrl, imagen_path: imagenPath })
      .eq('id', id)

    if (error) throw new Error(`Error updating imagen: ${error.message}`)
    revalidatePath('/admin/productos')
    return { id, imagenUrl, imagenPath }
  },
  { rateLimitKey: 'update-imagen', maxPerMinute: 60 }
)

const updateCombustiblePrecioSchema = z.object({
  id: z.string().uuid(),
  precio: z.number().nonnegative(),
})

export const updateCombustiblePrecio = withAdminAction(
  updateCombustiblePrecioSchema,
  async ({ id, precio }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('combustibles')
      .update({ precio })
      .eq('id', id)

    if (error) throw new Error(`Error updating precio combustible: ${error.message}`)
    revalidatePath('/admin/combustibles')
    return { id, precio }
  },
  { rateLimitKey: 'update-combustible-precio', maxPerMinute: 60 }
)

const updateCombustibleDisponibleSchema = z.object({
  id: z.string().uuid(),
  disponible: z.boolean(),
})

export const updateCombustibleDisponible = withAdminAction(
  updateCombustibleDisponibleSchema,
  async ({ id, disponible }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('combustibles')
      .update({ disponible })
      .eq('id', id)

    if (error) throw new Error(`Error updating disponible combustible: ${error.message}`)
    revalidatePath('/admin/combustibles')
    return { id, disponible }
  },
  { rateLimitKey: 'update-combustible-disponible', maxPerMinute: 60 }
)

// getWhatsAppConfig no es una Server Action de mutación admin (se usa en public), 
// así que no la envolvemos con withAdminAction para que siga retornando lo mismo.
export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  try {
    const config = await getConfiguracion()
    
    // Fallback to env var if DB doesn't have it
    const numero = config['whatsapp_numero'] || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    
    return {
      numero: numero.replace(/\D/g, ''), // Strip non-numeric characters
      header: config['msg_header'] || '¡Hola! Me gustaría hacer el siguiente pedido:\n',
      separator: config['msg_separator'] || '----------------------------------------\n',
      footer: config['msg_footer'] || '\n¡Muchas gracias!',
    }
  } catch (error) {
    // Default fallback values if DB query fails
    return {
      numero: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '',
      header: '¡Hola! Me gustaría hacer el siguiente pedido:\n',
      separator: '----------------------------------------\n',
      footer: '\n¡Muchas gracias!',
    }
  }
}

// ── PRODUCTO CRUD ──

const BADGE_VALUES = ['NUEVA', 'RECOMENDADO', 'PROMO'] as const

const productoFieldsSchema = z.object({
  codigo_plu: z.string().trim().min(1, 'El código PLU es obligatorio').max(64),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(200),
  descripcion: z.string().trim().max(1000).nullable().optional(),
  categoria_slug: z.string().trim().min(1, 'La categoría es obligatoria').max(64),
  precio: z.number().nonnegative('El precio no puede ser negativo'),
  disponible: z.boolean(),
  destacado: z.boolean(),
  badge: z.enum(BADGE_VALUES).nullable().optional(),
  orden: z.number().int().nonnegative(),
})

const createProductoSchema = productoFieldsSchema.extend({
  imagen_url: z.string().url().nullable().optional(),
  imagen_path: z.string().nullable().optional(),
})

export const createProducto = withAdminAction(
  createProductoSchema,
  async (input) => {
    const supabase = (await createClient()) as any
    const { data, error } = await supabase
      .from('productos')
      .insert({
        codigo_plu: input.codigo_plu,
        nombre: input.nombre,
        descripcion: input.descripcion ?? null,
        categoria_slug: input.categoria_slug,
        precio: input.precio,
        imagen_url: input.imagen_url ?? null,
        imagen_path: input.imagen_path ?? null,
        disponible: input.disponible,
        destacado: input.destacado,
        badge: input.badge ?? null,
        orden: input.orden,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505')
        throw new Error('Ya existe un producto con ese código PLU')
      throw new Error(`Error al crear el producto: ${error.message}`)
    }

    revalidatePath('/admin/productos')
    revalidatePath('/full')
    return data
  },
  { rateLimitKey: 'create-producto', maxPerMinute: 30 }
)

const updateProductoSchema = productoFieldsSchema.extend({
  id: z.string().uuid(),
})

export const updateProducto = withAdminAction(
  updateProductoSchema,
  async ({ id, ...input }) => {
    const supabase = (await createClient()) as any
    const { data, error } = await supabase
      .from('productos')
      .update({
        codigo_plu: input.codigo_plu,
        nombre: input.nombre,
        descripcion: input.descripcion ?? null,
        categoria_slug: input.categoria_slug,
        precio: input.precio,
        disponible: input.disponible,
        destacado: input.destacado,
        badge: input.badge ?? null,
        orden: input.orden,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505')
        throw new Error('Ya existe un producto con ese código PLU')
      throw new Error(`Error al actualizar el producto: ${error.message}`)
    }

    revalidatePath('/admin/productos')
    revalidatePath('/full')
    return data
  },
  { rateLimitKey: 'update-producto', maxPerMinute: 60 }
)

const deleteProductoSchema = z.object({ id: z.string().uuid() })

export const deleteProducto = withAdminAction(
  deleteProductoSchema,
  async ({ id }) => {
    const supabase = (await createClient()) as any

    // Capture the storage path before deleting the row (best-effort cleanup).
    const { data: prod } = await supabase
      .from('productos')
      .select('imagen_path')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw new Error(`Error al eliminar el producto: ${error.message}`)

    if (prod?.imagen_path) {
      try {
        await supabase.storage.from('productos-imagenes').remove([prod.imagen_path])
      } catch {
        // Image cleanup is best-effort; the row is already gone.
      }
    }

    revalidatePath('/admin/productos')
    revalidatePath('/full')
    return { id }
  },
  { rateLimitKey: 'delete-producto', maxPerMinute: 30 }
)

const duplicateProductoSchema = z.object({ id: z.string().uuid() })

export const duplicateProducto = withAdminAction(
  duplicateProductoSchema,
  async ({ id }) => {
    const supabase = (await createClient()) as any

    const { data: original, error: fetchError } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !original)
      throw new Error('No se encontró el producto a duplicar')

    const suffix = Date.now().toString(36).slice(-4).toUpperCase()

    const { data, error } = await supabase
      .from('productos')
      .insert({
        codigo_plu: `${original.codigo_plu}-COPIA-${suffix}`,
        nombre: `${original.nombre} (copia)`,
        descripcion: original.descripcion,
        categoria_slug: original.categoria_slug,
        precio: original.precio,
        // Reuse the public URL but not the storage path: the original keeps
        // ownership of the file, so deleting the copy won't remove its image.
        imagen_url: original.imagen_url,
        imagen_path: null,
        disponible: false,
        destacado: false,
        badge: original.badge,
        orden: original.orden,
      })
      .select()
      .single()

    if (error) throw new Error(`Error al duplicar el producto: ${error.message}`)

    revalidatePath('/admin/productos')
    return data
  },
  { rateLimitKey: 'duplicate-producto', maxPerMinute: 30 }
)

const updateCategoriaActivaSchema = z.object({
  id: z.string().uuid(),
  activa: z.boolean(),
})

export const updateCategoriaActiva = withAdminAction(
  updateCategoriaActivaSchema,
  async ({ id, activa }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('categorias')
      .update({ activa })
      .eq('id', id)

    if (error) throw new Error(`Error updating Categoria activa: ${error.message}`)
    revalidatePath('/admin/categorias')
    return { id, activa }
  },
  { rateLimitKey: 'update-categoria-activa', maxPerMinute: 60 }
)

const updateCategoriaSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(200),
  descripcion: z.string().trim().nullable(),
  subtitulo: z.string().trim().nullable(),
  imagen_fondo_url: z.string().trim().nullable(),
  orden: z.number().int(),
  activa: z.boolean(),
})

export const updateCategoria = withAdminAction(
  updateCategoriaSchema,
  async ({ id, nombre, descripcion, subtitulo, imagen_fondo_url, orden, activa }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('categorias')
      .update({
        nombre,
        descripcion,
        subtitulo,
        imagen_fondo_url,
        orden,
        activa,
      })
      .eq('id', id)

    if (error) throw new Error(`Error al actualizar categoría: ${error.message}`)
    revalidatePath('/admin/categorias')
    revalidatePath('/full')
    return { id, nombre }
  },
  { rateLimitKey: 'update-categoria', maxPerMinute: 30 }
)

// ── FULL PRINCIPAL ACTIONS ──

const upsertProductoCuradoSchema = z.object({
  codigo_plu: z.string().trim().min(1, 'El código es obligatorio').max(64),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(200),
  precio: z.number().nonnegative(),
  categoria_slug: z.string().trim().min(1, 'La categoría es obligatoria'),
  codigo_ypf: z.string().trim().max(64).nullable().optional(),
})

export const upsertProductoCurado = withAdminAction(
  upsertProductoCuradoSchema,
  async ({ codigo_plu, nombre, precio, categoria_slug, codigo_ypf }) => {
    const supabase = (await createClient()) as any

    // Calcular próximo orden dentro de la categoría
    const { data: existentes } = await supabase
      .from('productos')
      .select('orden')
      .eq('categoria_slug', categoria_slug)
      .order('orden', { ascending: false })
      .limit(1)

    const siguienteOrden = existentes && existentes.length > 0
      ? (existentes[0].orden ?? 0) + 1
      : 0

    const upsertData: any = {
      codigo_plu,
      nombre,
      precio,
      categoria_slug,
      disponible: true,
      orden: siguienteOrden,
      updated_at: new Date().toISOString(),
    }
    if (codigo_ypf !== undefined) {
      upsertData.codigo_ypf = codigo_ypf || null
    }

    const { error } = await supabase
      .from('productos')
      .upsert(upsertData, { onConflict: 'codigo_plu' })

    if (error) {
      if (error.code === '23505') {
        throw new Error('Ese código de YPF ya está vinculado a otro producto.')
      }
      throw new Error(`Error al guardar producto curado: ${error.message}`)
    }
    revalidatePath('/admin/full-principal')
    revalidatePath('/full')
    return { codigo_plu }
  },
  { rateLimitKey: 'upsert-producto-curado', maxPerMinute: 30 }
)

const updateProductoCodigoYpfSchema = z.object({
  id: z.string().uuid(),
  codigoYpf: z.string().trim().max(64).nullable(),
})

export const updateProductoCodigoYpf = withAdminAction(
  updateProductoCodigoYpfSchema,
  async ({ id, codigoYpf }) => {
    const supabase = (await createClient()) as any
    const valorLimpio = codigoYpf?.trim() || null
    const { error } = await supabase
      .from('productos')
      .update({ codigo_ypf: valorLimpio })
      .eq('id', id)

    if (error) {
      if (error.code === '23505') {
        throw new Error('Ese código de YPF ya está vinculado a otro producto.')
      }
      throw new Error(`Error al actualizar código YPF: ${error.message}`)
    }
    revalidatePath('/admin/full-principal')
    return { id, codigoYpf: valorLimpio }
  },
  { rateLimitKey: 'update-codigo-ypf', maxPerMinute: 60 }
)

const deleteProductoCuradoSchema = z.object({ id: z.string().uuid() })

export const deleteProductoCurado = withAdminAction(
  deleteProductoCuradoSchema,
  async ({ id }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw new Error(`Error al eliminar producto curado: ${error.message}`)
    revalidatePath('/admin/full-principal')
    revalidatePath('/full')
    return { id }
  },
  { rateLimitKey: 'delete-producto-curado', maxPerMinute: 30 }
)

const updateCategoriaActivaPorSlugSchema = z.object({
  slug: z.string().min(1),
  activa: z.boolean(),
})

export const updateCategoriaActivaPorSlug = withAdminAction(
  updateCategoriaActivaPorSlugSchema,
  async ({ slug, activa }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('categorias')
      .update({ activa })
      .eq('slug', slug)

    if (error) throw new Error(`Error al cambiar estado de sección: ${error.message}`)
    revalidatePath('/admin/full-principal')
    revalidatePath('/full')
    return { slug, activa }
  },
  { rateLimitKey: 'update-categoria-slug', maxPerMinute: 60 }
)

const getProductosCuradosSchema = z.object({
  categoriaSlug: z.string().min(1),
})

export const getProductosCurados = withAdminAction(
  getProductosCuradosSchema,
  async ({ categoriaSlug }) => {
    const supabase = (await createClient()) as any
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria_slug', categoriaSlug)
      .order('orden', { ascending: true })
      .order('nombre', { ascending: true })

    if (error) throw new Error(`Error fetching productos curados: ${error.message}`)
    return data ?? []
  },
  { rateLimitKey: 'get-productos-curados', maxPerMinute: 60 }
)

// ── INSTAGRAM POSTS ACTIONS ──

const createInstagramPostSchema = z.object({
  url: z.string().min(1, 'El link es obligatorio').refine(
    (url) => url.includes('instagram.com'),
    'El link debe ser una URL de Instagram'
  ),
  thumbnailUrl: z.string().url('URL de miniatura inválida'),
  thumbnailPath: z.string().min(1),
})

export const createInstagramPost = withAdminAction(
  createInstagramPostSchema,
  async ({ url, thumbnailUrl, thumbnailPath }) => {
    const supabase = (await createClient()) as any

    const { data: existentes } = await supabase
      .from('instagram_posts')
      .select('orden')
      .order('orden', { ascending: false })
      .limit(1)

    const siguienteOrden = existentes && existentes.length > 0
      ? (existentes[0].orden ?? 0) + 1
      : 1

    const { error } = await supabase.from('instagram_posts').insert({
      url,
      thumbnail_url: thumbnailUrl,
      thumbnail_path: thumbnailPath,
      orden: siguienteOrden,
      activo: true,
    })

    if (error) {
      if (error.code === '23505') throw new Error('Ya existe una publicación con ese link')
      throw new Error(`Error al crear la publicación: ${error.message}`)
    }

    revalidatePath('/admin/instagram')
    revalidatePath('/full')
    return { url }
  },
  { rateLimitKey: 'create-instagram-post', maxPerMinute: 30 }
)

const updateInstagramPostThumbnailSchema = z.object({
  id: z.string().uuid(),
  thumbnailUrl: z.string().url(),
  thumbnailPath: z.string().min(1),
})

export const updateInstagramPostThumbnail = withAdminAction(
  updateInstagramPostThumbnailSchema,
  async ({ id, thumbnailUrl, thumbnailPath }) => {
    const supabase = (await createClient()) as any

    const { data: actual } = await supabase
      .from('instagram_posts')
      .select('thumbnail_path')
      .eq('id', id)
      .single()

    if (actual?.thumbnail_path) {
      try {
        await supabase.storage.from('instagram-thumbnails').remove([actual.thumbnail_path])
      } catch {
        // Cleanup best-effort
      }
    }

    const { error } = await supabase
      .from('instagram_posts')
      .update({ thumbnail_url: thumbnailUrl, thumbnail_path: thumbnailPath, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(`Error al actualizar miniatura: ${error.message}`)
    revalidatePath('/admin/instagram')
    revalidatePath('/full')
    return { id }
  },
  { rateLimitKey: 'update-instagram-thumbnail', maxPerMinute: 30 }
)

const updateInstagramPostUrlSchema = z.object({
  id: z.string().uuid(),
  url: z.string().min(1).refine(
    (url) => url.includes('instagram.com'),
    'El link debe ser una URL de Instagram'
  ),
})

export const updateInstagramPostUrl = withAdminAction(
  updateInstagramPostUrlSchema,
  async ({ id, url }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('instagram_posts')
      .update({ url, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      if (error.code === '23505') throw new Error('Ya existe una publicación con ese link')
      throw new Error(`Error al actualizar link: ${error.message}`)
    }
    revalidatePath('/admin/instagram')
    revalidatePath('/full')
    return { id }
  },
  { rateLimitKey: 'update-instagram-url', maxPerMinute: 30 }
)

const toggleInstagramPostActivoSchema = z.object({
  id: z.string().uuid(),
  activo: z.boolean(),
})

export const toggleInstagramPostActivo = withAdminAction(
  toggleInstagramPostActivoSchema,
  async ({ id, activo }) => {
    const supabase = (await createClient()) as any
    const { error } = await supabase
      .from('instagram_posts')
      .update({ activo, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(`Error al cambiar estado: ${error.message}`)
    revalidatePath('/admin/instagram')
    revalidatePath('/full')
    return { id, activo }
  },
  { rateLimitKey: 'toggle-instagram-activo', maxPerMinute: 60 }
)

const moverInstagramPostSchema = z.object({
  id: z.string().uuid(),
  idVecino: z.string().uuid(),
})

export const moverInstagramPost = withAdminAction(
  moverInstagramPostSchema,
  async ({ id, idVecino }) => {
    const supabase = (await createClient()) as any

    const { data: posts, error: fetchError } = await supabase
      .from('instagram_posts')
      .select('id, orden')
      .in('id', [id, idVecino])
      .order('orden', { ascending: true })

    if (fetchError || !posts || posts.length !== 2) {
      throw new Error('No se encontraron las publicaciones a reordenar')
    }

    const actual = posts.find((p: any) => p.id === id)
    const vecino = posts.find((p: any) => p.id === idVecino)

    if (!actual || !vecino) throw new Error('Publicaciones no encontradas')

    await supabase.from('instagram_posts').update({ orden: vecino.orden }).eq('id', actual.id)
    await supabase.from('instagram_posts').update({ orden: actual.orden }).eq('id', vecino.id)

    revalidatePath('/admin/instagram')
    revalidatePath('/full')
    return { id, idVecino }
  },
  { rateLimitKey: 'mover-instagram-post', maxPerMinute: 30 }
)

const deleteInstagramPostSchema = z.object({
  id: z.string().uuid(),
  thumbnailPath: z.string().nullable(),
})

export const deleteInstagramPost = withAdminAction(
  deleteInstagramPostSchema,
  async ({ id, thumbnailPath }) => {
    const supabase = (await createClient()) as any

    const { error } = await supabase.from('instagram_posts').delete().eq('id', id)
    if (error) throw new Error(`Error al eliminar la publicación: ${error.message}`)

    if (thumbnailPath) {
      try {
        await supabase.storage.from('instagram-thumbnails').remove([thumbnailPath])
      } catch {
        // Cleanup best-effort
      }
    }

    revalidatePath('/admin/instagram')
    revalidatePath('/full')
    return { id }
  },
  { rateLimitKey: 'delete-instagram-post', maxPerMinute: 30 }
)

// ── Ensure bucket is public ──
export async function ensureInstagramBucketPublic() {
  const supabase = (await createClient()) as any
  try {
    await supabase.storage.updateBucket('instagram-thumbnails', { public: true })
  } catch (e: any) {
    console.warn('[instagram] Bucket update:', e?.message)
  }
}

// ── Sync storage files with DB posts ──
export async function syncInstagramThumbnails() {
  const supabase = (await createClient()) as any

  const { data: posts, error: postsError } = await supabase
    .from('instagram_posts')
    .select('id, thumbnail_url, thumbnail_path, orden')
    .order('orden', { ascending: true })

  const { data: files, error: filesError } = await supabase.storage
    .from('instagram-thumbnails')
    .list('', { limit: 100, sortBy: { column: 'created_at', order: 'asc' } })

  if (!posts || posts.length === 0) return { synced: 0 }
  if (!files || files.length === 0) return { synced: 0 }

  const { data: { publicUrl } } = supabase.storage
    .from('instagram-thumbnails')
    .getPublicUrl('test')

  const baseUrl = publicUrl.replace(/test$/, '')

  let synced = 0
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    if (post.thumbnail_url) continue

    const file = files[i]
    if (!file) continue

    const fileUrl = `${baseUrl}${file.name}`
    const { error } = await supabase
      .from('instagram_posts')
      .update({ thumbnail_url: fileUrl, thumbnail_path: file.name, updated_at: new Date().toISOString() })
      .eq('id', post.id)

    if (!error) synced++
  }

  revalidatePath('/admin/instagram')
  revalidatePath('/full')
  return { synced }
}
