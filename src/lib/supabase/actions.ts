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
