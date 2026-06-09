import { formatearPrecioARS } from '@/lib/excel/parser'
import type { CartItem, WhatsAppConfig } from '@/types'

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0)
}

export function generateWhatsAppURL(items: CartItem[], config: WhatsAppConfig): string {
  if (!items || items.length === 0) {
    return ''
  }

  let mensaje = `${config.header}\n${config.separator}`

  items.forEach(({ producto, cantidad, subtotal }) => {
    const precioFmt = formatearPrecioARS(producto.precio)
    const subtotalFmt = formatearPrecioARS(subtotal)
    mensaje += `• ${cantidad}x ${producto.nombre}  (${precioFmt} c/u)  →  ${subtotalFmt}\n`
  })

  const totalFmt = formatearPrecioARS(calculateTotal(items))
  
  mensaje += `${config.separator}💰 *Total Estimado:* ${totalFmt}\n${config.footer}`

  const mensajeCodificado = encodeURIComponent(mensaje)
  
  return `https://wa.me/${config.numero}?text=${mensajeCodificado}`
}

export function openWhatsApp(url: string): void {
  if (typeof window !== 'undefined' && url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
