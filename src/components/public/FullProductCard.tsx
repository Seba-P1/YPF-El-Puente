'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/format'
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
      className={`flex flex-col items-center snap-center group pb-4 overflow-visible ${
        isCarousel ? 'flex-shrink-0 w-[280px] md:w-[clamp(320px,18vw,400px)]' : 'w-full'
      }`}
    >
      {/* Image container — tall enough to avoid clipping */}
      <div className="relative w-full h-[400px] md:h-[460px] flex items-end justify-center overflow-visible">
        <div className="absolute bottom-[-20px] md:bottom-[-30px] w-[408px] h-[374px] md:w-[476px] md:h-[442px] transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2 pointer-events-none">
          {!imgError && producto.imagen_url ? (
            <Image
              src={producto.imagen_url.startsWith('http') ? producto.imagen_url : `${producto.imagen_url}?v=2`}
              alt={producto.nombre}
              fill
              sizes="(max-width: 768px) 408px, 476px"
              quality={100}
              priority={index < 4}
              loading={index < 4 ? undefined : "lazy"}
              className="object-contain"
              unoptimized={true}
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

      {/* Invisible card — no background, border or shadow */}
      <div className="w-full flex flex-col items-center justify-between px-4 pt-1 pb-2 transition-all duration-300 min-h-[80px] md:min-h-[100px]">
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
            <div className={`mt-1 px-2.5 py-0.5 rounded-full ${priceClass}`}>
              {formatearPrecioARS(producto.precio)}
            </div>
          ) : (
            <div className="text-[13px] font-semibold text-white/20 mt-1.5">
              ···
            </div>
          )}
        </div>

        {/* Smaller add to cart button */}
        <button
          onClick={handleAdd}
          className={`mt-2 px-5 h-[26px] rounded-lg text-[10px] font-bold text-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${buttonClass}`}
        >
          + Agregar
        </button>
      </div>
    </motion.div>
  )
}
