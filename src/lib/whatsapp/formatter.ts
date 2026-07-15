import { formatearPrecioARS } from '@/lib/format'
import type { CartItem, WhatsAppConfig } from '@/types'

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0)
}

export function generateWhatsAppURL(
  items: CartItem[],
  config: WhatsAppConfig,
  nombreCliente: string
): string {
  if (items.length === 0) return ''

  const total = items.reduce((acc, item) => acc + item.subtotal, 0)

  const lineasProductos = items
    .map(
      (item) =>
        `• ${item.cantidad}× ${item.producto.nombre}  (${formatearPrecioARS(item.producto.precio)} c/u)  →  ${formatearPrecioARS(item.subtotal)}`
    )
    .join('\n')

  const mensaje = `¡Hola! Soy *${nombreCliente}* y quiero hacer el siguiente pedido:
${config.separator}
${lineasProductos}
${config.separator}
💰 *Total estimado:* ${formatearPrecioARS(total)}
${config.footer}`

  const mensajeCodificado = encodeURIComponent(mensaje)
  return `https://wa.me/${config.numero}?text=${mensajeCodificado}`
}

export function generateWhatsAppConsultaURL(
  items: CartItem[],
  config: WhatsAppConfig
): string {
  if (items.length === 0) {
    const mensaje = `¡Hola! Me gustaría hacer una consulta.`
    return `https://wa.me/${config.numero}?text=${encodeURIComponent(mensaje)}`
  }

  const total = items.reduce((acc, item) => acc + item.subtotal, 0)
  const lineasProductos = items
    .map(
      (item) =>
        `• ${item.cantidad}× ${item.producto.nombre}  (${formatearPrecioARS(item.producto.precio)} c/u)  →  ${formatearPrecioARS(item.subtotal)}`
    )
    .join('\n')

  const mensaje = `¡Hola! Quisiera hacer una consulta rápida. Actualmente tengo estos productos en mi carrito:
${config.separator}
${lineasProductos}
${config.separator}
💰 *Total estimado:* ${formatearPrecioARS(total)}`

  return `https://wa.me/${config.numero}?text=${encodeURIComponent(mensaje)}`
}

export function openWhatsApp(url: string): void {
  if (typeof window !== 'undefined' && url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
