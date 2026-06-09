// Re-export base types from Supabase
export type {
  Producto,
  Categoria,
  Combustible,
  ConfiguracionItem,
  UploadHistorial,
} from '@/lib/supabase/types'

import type { Producto } from '@/lib/supabase/types'

export interface CartItem {
  producto: Producto
  cantidad: number
  subtotal: number
}

export interface CartState {
  items: CartItem[]
  total: number
  totalItems: number
  isOpen: boolean
  addItem: (producto: Producto) => void
  removeItem: (productoId: string) => void
  updateQuantity: (productoId: string, cantidad: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export interface ExcelRow {
  codigo_plu: string
  precio: number
}

export interface UploadResult {
  success: boolean
  actualizados: number
  nuevos: number
  errores: number
  detalles: string[]
}

export interface WhatsAppConfig {
  numero: string
  header: string
  separator: string
  footer: string
}
