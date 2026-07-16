'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/format'
import type { Producto } from '@/types'

interface ProductCardProps {
  producto: Producto
}

export function ProductCard({ producto }: ProductCardProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem(producto)
    toast.success('Agregado al carrito', {
      description: `${producto.nombre} fue agregado a tu pedido.`,
      duration: 3000,
    })
  }

  return (
    <div className="group relative flex flex-col items-center p-4 rounded-3xl bg-white/50 backdrop-blur-sm transition-colors hover:bg-white/80">
      {/* Badge */}
      {producto.badge && (
        <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase bg-[#D4A017] rounded-full shadow-sm">
          {producto.badge}
        </span>
      )}

      {/* Floating Image — CSS hover, no filter animation to avoid repaint */}
      <div
        className="relative w-48 h-48 md:w-56 md:h-56 mb-4 mt-8 transition-transform duration-300 ease-out hover:-translate-y-[10px] hover:scale-105"
        style={{
          filter: 'drop-shadow(0px 15px 30px rgba(0,0,0,0.18))',
        }}
      >
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 192px, 224px"
            priority={producto.destacado}
            loading={producto.destacado ? undefined : "lazy"}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center opacity-50">
            <span className="text-gray-400 text-sm">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-center text-center w-full mt-auto space-y-2">
        <h3 className="font-bold text-lg text-gray-900 leading-tight">
          {producto.nombre}
        </h3>
        
        {producto.descripcion && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="pt-2 pb-4">
          {!producto.precio || producto.precio === 0 ? (
            <span className="text-sm font-medium text-gray-500 italic">
              Consultar precio
            </span>
          ) : (
            <span className="text-xl font-black text-[#005A9C]">
              {formatearPrecioARS(producto.precio)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#005A9C] text-white rounded-2xl font-semibold shadow-md hover:bg-[#004a80] transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>+ Agregar</span>
        </motion.button>
      </div>
    </div>
  )
}
