import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartState } from '@/types'
import type { Producto } from '@/lib/supabase/types'

function recalculateTotals(items: CartState['items']) {
  return {
    total: items.reduce((sum, item) => sum + item.subtotal, 0),
    totalItems: items.reduce((sum, item) => sum + item.cantidad, 0),
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      totalItems: 0,
      isOpen: false,

      addItem: (producto: Producto) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.producto.id === producto.id
          )

          let newItems: CartState['items']

          if (existingIndex >= 0) {
            newItems = state.items.map((item, index) =>
              index === existingIndex
                ? {
                    ...item,
                    cantidad: item.cantidad + 1,
                    subtotal: producto.precio * (item.cantidad + 1),
                  }
                : item
            )
          } else {
            newItems = [
              ...state.items,
              { producto, cantidad: 1, subtotal: producto.precio },
            ]
          }

          return { items: newItems, ...recalculateTotals(newItems) }
        }),

      removeItem: (productoId: string) =>
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.producto.id !== productoId
          )
          return { items: newItems, ...recalculateTotals(newItems) }
        }),

      updateQuantity: (productoId: string, cantidad: number) =>
        set((state) => {
          if (cantidad <= 0) {
            const newItems = state.items.filter(
              (item) => item.producto.id !== productoId
            )
            return { items: newItems, ...recalculateTotals(newItems) }
          }

          const newItems = state.items.map((item) =>
            item.producto.id === productoId
              ? {
                  ...item,
                  cantidad,
                  subtotal: item.producto.precio * cantidad,
                }
              : item
          )
          return { items: newItems, ...recalculateTotals(newItems) }
        }),

      clearCart: () =>
        set({ items: [], total: 0, totalItems: 0 }),

      toggleCart: () =>
        set((state) => ({ isOpen: !state.isOpen })),

      openCart: () =>
        set({ isOpen: true }),

      closeCart: () =>
        set({ isOpen: false }),
    }),
    {
      name: 'ypf-el-puente-cart',
      // Only persist cart data, not UI state (isOpen)
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        totalItems: state.totalItems,
      }),
    }
  )
)
