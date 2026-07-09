// Re-export base types from Supabase
export type {
  Producto,
  Categoria,
  Combustible,
  ConfiguracionItem,
  UploadHistorial,
  InstagramPost,
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
  nombre: string
  precio: number
  categoria_slug: string
  es_sin_tacc: boolean
}

export interface UploadResult {
  actualizados: number
  sincronizadosCurados: number
  nuevos: number
  omitidos: number
  sinTacc: number
  errores: number
}

export interface WhatsAppConfig {
  numero: string
  header: string
  separator: string
  footer: string
}
