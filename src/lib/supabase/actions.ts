'use server'

import { createClient } from './server'
import { getConfiguracion } from './queries'
import type { WhatsAppConfig } from '@/types'

export async function updateProductoDisponible(
  id: string,
  disponible: boolean
): Promise<void> {
  const supabase = (await createClient()) as any
  const { error } = await supabase
    .from('productos')
    .update({ disponible })
    .eq('id', id)

  if (error) {
    throw new Error(`Error updating disponible: ${error.message}`)
  }
}

export async function updateProductoDestacado(
  id: string,
  destacado: boolean
): Promise<void> {
  const supabase = (await createClient()) as any
  const { error } = await supabase
    .from('productos')
    .update({ destacado })
    .eq('id', id)

  if (error) {
    throw new Error(`Error updating destacado: ${error.message}`)
  }
}

export async function updateProductoBadge(
  id: string,
  badge: string | null
): Promise<void> {
  const supabase = (await createClient()) as any
  const { error } = await supabase
    .from('productos')
    .update({ badge })
    .eq('id', id)

  if (error) {
    throw new Error(`Error updating badge: ${error.message}`)
  }
}

export async function updateProductoPrecio(
  id: string,
  precio: number
): Promise<void> {
  const supabase = (await createClient()) as any
  const { error } = await supabase
    .from('productos')
    .update({ precio, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    throw new Error(`Error updating precio: ${error.message}`)
  }
}

export async function updateProductoImagen(
  id: string,
  imagenUrl: string,
  imagenPath: string
): Promise<void> {
  const supabase = (await createClient()) as any
  const { error } = await supabase
    .from('productos')
    .update({ imagen_url: imagenUrl, imagen_path: imagenPath })
    .eq('id', id)

  if (error) {
    throw new Error(`Error updating imagen: ${error.message}`)
  }
}

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
