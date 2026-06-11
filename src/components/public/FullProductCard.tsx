'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/excel/parser'
import type { Producto } from '@/lib/supabase/types'

interface FullProductCardProps {
  producto: Producto
  index: number
}

export function FullProductCard({ producto, index }: FullProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const imageHoverVars: Variants | undefined = isDesktop
    ? {
      rest: {
        y: 0,
        scale: 1,
        filter: 'drop-shadow(0px 20px 45px rgba(0,0,0,0.55))'
      },
      hover: {
        y: -12,
        scale: 1.04,
        filter: 'drop-shadow(0px 28px 55px rgba(0,0,0,0.7))',
        transition: {
          type: 'spring' as const,
          stiffness: 320,
          damping: 22
        }
      }
    }
    : undefined

  const buttonHoverVars: Variants = isDesktop
    ? {
      rest: { opacity: 0 },
      hover: { opacity: 1, transition: { duration: 0.2 } }
    }
    : {
      rest: { opacity: 1 },
      hover: { opacity: 1 }
    }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '50px' }}
      variants={containerVariants}
      whileHover={isDesktop ? 'hover' : undefined}
      animate="rest"
      className="flex flex-col items-center relative"
      style={{
        background: 'transparent',
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      {/* 1. CONTENEDOR DE LA IMAGEN */}
      <motion.div
        variants={imageHoverVars}
        className="relative flex items-center justify-center w-[220px] h-[220px] lg:w-[260px] lg:h-[260px]"
        style={{ background: 'transparent' }}
      >
        {!imgError ? (
          <Image
            src={producto.imagen_url || `/assets/placeholder.png`}
            alt={producto.nombre}
            fill
            sizes="(max-width: 1024px) 220px, 260px"
            priority={index < 4}
            className="object-contain"
            style={{
              filter: 'drop-shadow(0px 20px 45px rgba(0,0,0,0.55))'
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full rounded-2xl border border-white/10 bg-white/5">
            <span className="text-white text-sm font-semibold text-center px-4">
              {producto.nombre}
            </span>
          </div>
        )}

        {/* BADGE */}
        {producto.badge && (
          <div className="absolute top-2 right-2 bg-[#FFD100] text-black text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider z-10">
            {producto.badge}
          </div>
        )}
      </motion.div>

      {/* 2. INFORMACIÓN DEBAJO DE LA IMAGEN */}
      <div className="pt-[14px] text-center w-full lg:w-[260px] flex flex-col items-center">
        <h3
          className="text-[13px] lg:text-[14px] font-bold text-white/90 text-center w-full"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {producto.nombre}
        </h3>

        {producto.precio && producto.precio > 0 ? (
          <div className="text-[15px] font-extrabold text-[#FFD100] mt-1">
            {formatearPrecioARS(producto.precio)}
          </div>
        ) : (
          <div className="text-[13px] font-semibold text-white/20 mt-1">
            ···
          </div>
        )}
      </div>

      {/* 3. BOTÓN AGREGAR */}
      <motion.button
        variants={buttonHoverVars}
        whileTap={{ scale: 0.95 }}
        onClick={handleAdd}
        className={`mt-[10px] h-[34px] px-[18px] rounded-full text-[12px] font-bold text-white transition-colors duration-200 ${!isDesktop ? 'flex' : ''
          }`}
        style={{
          background: 'rgba(0,90,156,0.85)',
          border: '1px solid rgba(0,112,192,0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#0070C0'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,90,156,0.85)'
        }}
      >
        + Agregar
      </motion.button>
    </motion.div>
  )
}