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
}

export function FullProductCard({ producto, index, layout = 'carousel' }: FullProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem(producto)
    toast.success(`${producto.nombre} agregado`, { duration: 2000 })
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

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '50px' }}
      variants={containerVariants}
      className={`relative flex flex-col items-center justify-end snap-center group pt-[175px] md:pt-[clamp(190px,15vw,260px)] pb-4 ${
        isCarousel ? 'flex-shrink-0 w-[270px] md:w-[clamp(320px,18vw,400px)]' : 'w-full'
      }`}
    >
      {/* 1. PRODUCT IMAGE (Outside the card, overlapping) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center w-[min(92vw,468px)] h-[min(68vw,350px)] md:w-[clamp(468px,24.7vw,546px)] md:h-[clamp(330px,18vw,410px)] z-10 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2 pointer-events-none">
        {!imgError && producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 92vw, 546px"
            priority={index < 4}
            className="object-contain drop-shadow-2xl"
            onError={() => setImgError(true)}
          />
        ) : (
          <ProductImagePlaceholder categoriaSlug={producto.categoria_slug} nombre={producto.nombre} fill />
        )}

        {/* BADGE (Overlapping the image on top at z-20) */}
        {producto.badge && (
          <div className="absolute top-[clamp(50px,5.5vw,85px)] right-4 md:right-8 bg-[#FFD100] text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider z-20 shadow-md pointer-events-auto">
            {producto.badge}
          </div>
        )}
      </div>

      {/* 2. GLASS PRODUCT INFO CARD */}
      <div className="w-full flex flex-col items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-xl shadow-black/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 pt-[68px] md:pt-[clamp(72px,5vw,104px)] mt-0 min-h-[230px] md:min-h-[clamp(230px,14vw,280px)] relative z-0">
        <div className="text-center w-full flex flex-col items-center flex-grow">
          <h3 className="text-[13px] lg:text-[14px] font-bold text-white/90 text-center line-clamp-2 min-h-[36px] flex items-center justify-center px-1">
            {producto.nombre}
          </h3>

          {producto.precio && producto.precio > 0 ? (
            <div className="text-[15px] font-black text-[#FFD100] mt-1.5 bg-[#FFD100]/10 px-2.5 py-0.5 rounded-full">
              {formatearPrecioARS(producto.precio)}
            </div>
          ) : (
            <div className="text-[13px] font-semibold text-white/20 mt-1.5">
              ···
            </div>
          )}
        </div>

        {/* 3. ADD TO CART BUTTON */}
        <button
          onClick={handleAdd}
          className="mt-4 w-full h-[36px] rounded-xl text-[11px] font-bold text-white bg-white/10 hover:bg-[#0070C0] border border-white/10 hover:border-transparent transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          + Agregar
        </button>
      </div>
    </motion.div>
  )
}
