'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/excel/parser'
import { generateWhatsAppURL, openWhatsApp } from '@/lib/whatsapp/formatter'
import { getWhatsAppConfig } from '@/lib/supabase/actions'
import type { WhatsAppConfig } from '@/types'
import { toast } from 'sonner'

export function CartSidebar() {
  const { items, total, totalItems, isOpen, closeCart, updateQuantity, removeItem } = useCartStore()
  const [waConfig, setWaConfig] = useState<WhatsAppConfig | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch by only rendering full cart on client
  useEffect(() => {
    setIsClient(true)
    // Fetch whatsapp config when component mounts
    getWhatsAppConfig().then(setWaConfig)
  }, [])

  const handleCheckout = () => {
    if (!waConfig) {
      toast.error('Error al cargar configuración', {
        description: 'Por favor intenta nuevamente en unos segundos.',
      })
      return
    }
    const url = generateWhatsAppURL(items, waConfig)
    openWhatsApp(url)
  }

  // Prevent scrolling on body when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isClient) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#005A9C]" />
                <h2 className="font-bold text-lg">Tu Pedido — YPF El Puente</h2>
                <span className="bg-[#005A9C] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-gray-500">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="font-medium text-gray-900">Tu carrito está vacío</p>
                  <p className="text-sm">Agregá productos del menú para comenzar</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 text-[#005A9C] font-semibold hover:underline"
                  >
                    Ver el menú
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.producto.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl relative group">
                    <div className="relative w-16 h-16 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0">
                      {item.producto.imagen_url ? (
                        <Image
                          src={item.producto.imagen_url}
                          alt={item.producto.nombre}
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="pr-6">
                        <h4 className="font-bold text-sm leading-tight text-gray-900 line-clamp-2">
                          {item.producto.nombre}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatearPrecioARS(item.producto.precio)} c/u
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#005A9C] hover:bg-gray-50 rounded-full transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#005A9C] hover:bg-gray-50 rounded-full transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-[#005A9C]">
                          {formatearPrecioARS(item.subtotal)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.producto.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-1 rounded-full opacity-0 group-hover:opacity-100 sm:opacity-100"
                      aria-label="Eliminar producto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Total estimado</span>
                  <span className="text-2xl font-black text-gray-900">
                    {formatearPrecioARS(total)}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={!waConfig}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Enviar pedido a la estación
                </button>
                <p className="text-center text-xs text-gray-500 mt-3 font-medium">
                  Se abrirá WhatsApp con tu pedido listo para enviar.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
