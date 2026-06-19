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
