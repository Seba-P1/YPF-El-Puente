'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/excel/parser'
import { ProductImagePlaceholder } from '@/components/public/ProductImagePlaceholder'
import type { Producto } from '@/lib/supabase/types'

interface FullProductCardProps {
  producto: Producto
  index: number
  layout?: 'carousel' | 'grid'
  variant?: 'default' | 'mundial'
  showDescription?: boolean
  onAdd?: (producto: Producto) => void
}

export function FullProductCard({
  producto,
  index,
  layout = 'carousel',
  variant = 'default',
  showDescription = false,
  onAdd,
}: FullProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    if (onAdd) {
      onAdd(producto)
    } else {
      addItem(producto)
      toast.success(`${producto.nombre} agregado`, { duration: 2000 })
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const isCarousel = layout === 'carousel'
  const isMundial = variant === 'mundial'

  // Variant glass card styles
  const glassCardBg = isMundial
    ? 'bg-white/20 border-[#005A9C]/10 shadow-[#005A9C]/5 group-hover:bg-white/40 group-hover:border-[#005A9C]/20'
    : 'bg-white/5 border-white/10 shadow-black/10 group-hover:bg-white/10 group-hover:border-white/20'

  const nameClass = isMundial
    ? 'font-[family-name:var(--font-montserrat)] text-[#005A9C]'
    : 'font-[family-name:var(--font-montserrat)] text-white/90'

  const priceClass = isMundial
    ? 'font-[family-name:var(--font-montserrat)] text-[14px] font-black text-[#005A9C] bg-[#005A9C]/5'
    : 'text-[15px] font-black text-[#FFD100] bg-[#FFD100]/10'

  const buttonClass = isMundial
    ? 'bg-[#005A9C] hover:bg-[#004B82] border-transparent shadow-sm shadow-[#005A9C]/10'
    : 'bg-white/10 hover:bg-[#0070C0] border-white/10 hover:border-transparent'

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '50px' }}
      variants={containerVariants}
      className={`flex flex-col items-center snap-center group pb-4 ${
        isCarousel ? 'flex-shrink-0 w-[324px] md:w-[clamp(384px,21.6vw,480px)]' : 'w-full'
      }`}
    >
      {/* Image container — fixed height, aligned to bottom, overlaps card via negative margin */}
      <div className="relative w-full h-[200px] md:h-[240px] flex items-end justify-center mb-[-40px]">
        <div className="relative w-[min(92vw,280px)] h-[min(68vw,210px)] md:w-[clamp(280px,15vw,320px)] md:h-[clamp(198px,11vw,240px)] transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2">
          {!imgError && producto.imagen_url ? (
            <Image
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              sizes="(max-width: 768px) 92vw, 320px"
              priority={index < 4}
              className="object-contain drop-shadow-2xl"
              onError={() => setImgError(true)}
            />
          ) : (
            <ProductImagePlaceholder categoriaSlug={producto.categoria_slug} nombre={producto.nombre} fill />
          )}

          {/* Badge — positioned relative to image container. Hidden for mundial variant. */}
          {!isMundial && producto.badge && (
            <div className="absolute top-2 right-2 bg-[#FFD100] text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider z-20 shadow-md pointer-events-auto">
              {producto.badge}
            </div>
          )}
        </div>
      </div>

      {/* Glass product info card */}
      <div className={`w-full flex flex-col items-center justify-between backdrop-blur-md border rounded-3xl p-5 shadow-xl transition-all duration-300 mt-[40px] min-h-[230px] md:min-h-[clamp(230px,14vw,280px)] ${glassCardBg}`}>
        <div className="text-center w-full flex flex-col items-center flex-grow">
          <h3 className={`text-[13px] lg:text-[14px] font-bold text-center px-1 ${nameClass}`}>
            {producto.nombre}
          </h3>

          {showDescription && producto.descripcion && (
            <p className={`font-[family-name:var(--font-montserrat)] text-[11px] ${isMundial ? 'text-[#005A9C]/70' : 'text-white/50'} mt-1 line-clamp-3 min-h-[40px] px-2 leading-relaxed`}>
              {producto.descripcion}
            </p>
          )}

          {producto.precio && producto.precio > 0 ? (
            <div className={`mt-1.5 px-2.5 py-0.5 rounded-full ${priceClass}`}>
              {formatearPrecioARS(producto.precio)}
            </div>
          ) : (
            <div className="text-[13px] font-semibold text-white/20 mt-1.5">
              ···
            </div>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          className={`mt-4 w-full h-[36px] rounded-xl text-[11px] font-bold text-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${buttonClass}`}
        >
          + Agregar
        </button>
      </div>
    </motion.div>
  )
}
