'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FullProductCard } from './FullProductCard'
import type { Categoria, Producto } from '@/lib/supabase/types'

/*
  STRUCTURE REPLICATING full.ypf.com:

  <section>  ← solid background color, min-height: 100vh, position: relative
    │
    ├── <img back-X.webp> ← ABSOLUTE position top-right, decorative, NOT background
    │   Width: ~55% of container, 100% height, object-fit: cover
    │   z-index: 0, pointer-events: none
    │
    ├── [HEADER] ← relative, z-index: 1
    │   ├── section tag in Caveat font
    │   ├── H2 title in Montserrat Black
    │   ├── subtitle
    │   └── "Scrolleá para ver más →"
    │
    └── [HORIZONTAL SCROLL] ← overflow-x: auto, display: flex, ONE ROW
        ├── Product 1 (large image, name below)
        ├── Product 2
        └── ...
*/

interface FullCategorySectionProps {
  id: string
  categoria: Categoria
  productos: Producto[]
  colorFondo: string
  imagenBack: string
  mandalaPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  mandalaScale?: number
  sectionBgImage?: string
  fullScreenBgImage?: string
  extraSubtitle?: string
}

export function FullCategorySection({
  id,
  categoria,
  productos,
  colorFondo,
  imagenBack,
  mandalaPosition = 'top-right',
  mandalaScale = 1,
  sectionBgImage,
  fullScreenBgImage,
  extraSubtitle,
}: FullCategorySectionProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <motion.section
      id={id}
      style={{
        backgroundColor: colorFondo,
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(20px, 3vw, 45px) 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* REPEATING BACKGROUND PATTERN */}
      {sectionBgImage && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url('${sectionBgImage}')`,
            backgroundSize: '600px',
            backgroundRepeat: 'repeat',
            opacity: 0.05
          }}
        />
      )}

      {/* FULL SCREEN BACKGROUND IMAGE (100% quality cover) */}
      {fullScreenBgImage && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url('${fullScreenBgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1
          }}
        />
      )}

      {/* DECORATIVE BACKGROUND IMAGE — animated entrance */}
      <motion.img
        src={imagenBack}
        alt=""
        initial={{ opacity: 0, x: mandalaPosition.includes('right') ? 80 : -80 }}
        whileInView={{ opacity: 0.35, x: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'absolute',
          top: mandalaPosition.includes('top') ? 0 : 'auto',
          bottom: mandalaPosition.includes('bottom') ? 0 : 'auto',
          right: mandalaPosition.includes('right') ? 0 : 'auto',
          left: mandalaPosition.includes('left') ? 0 : 'auto',
          width: `calc(clamp(300px, 42vw, 540px) * ${mandalaScale})`,
          height: 'auto',
          objectFit: 'contain',
          objectPosition: mandalaPosition.includes('left') ? 'left' : 'right',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* PRODUCTS ROW WRAPPER */}
      <div className="relative w-full group">
        {/* SCROLL BUTTONS (Desktop only) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 hover:bg-black/80 rounded-full items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 shadow-xl cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 hover:bg-black/80 rounded-full items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 shadow-xl cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>

        {/* PRODUCTS SCROLL CONTAINER */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar snap-x snap-mandatory flex flex-row overflow-x-auto overflow-y-visible"
          style={{
            position: 'relative',
            zIndex: 1,
            gap: 'clamp(16px, 2vw, 32px)',
            paddingLeft: 'clamp(24px, 5vw, 80px)',
            paddingRight: 'clamp(24px, 5vw, 80px)',
            paddingBottom: 40,
            paddingTop: 'clamp(30px, 4vw, 60px)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* 1. TEXT BLOCK CARD */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-shrink-0 w-[85vw] max-w-[442px] md:max-w-[520px] flex flex-col justify-center snap-center mr-6 md:mr-12"
          >
            {/* Tag */}
            <p className="font-[family-name:var(--font-caveat)] text-2xl md:text-3xl text-white/55 font-bold mb-2 tracking-wide">
              {categoria?.nombre?.toUpperCase() ?? id.toUpperCase()}
            </p>
            {/* Title */}
<h2 className="font-[family-name:var(--font-din-medium)] font-black text-4xl md:text-6xl text-white leading-none mb-3 tracking-tight">
  {categoria?.descripcion || categoria?.nombre}
</h2>
            {/* Subtitle */}
            {categoria?.subtitulo && (
              <p className="font-[family-name:var(--font-montserrat)] text-sm md:text-base text-white/60 mb-4 leading-relaxed">
                {categoria.subtitulo}
              </p>
            )}
            {/* Extra subtitle (e.g. hamburguesas info) */}
            {extraSubtitle && (
              <p className="font-[family-name:var(--font-montserrat)] text-xs md:text-sm text-white/40 mb-6 leading-relaxed italic">
                {extraSubtitle}
              </p>
            )}
            {/* Indicator */}
            <div className="flex items-center gap-2.5 text-[#FFD100] text-base md:text-lg font-extrabold tracking-wider uppercase mt-2">
              <span className="font-[family-name:var(--font-caveat)] text-2xl md:text-3xl text-[#FFD100]">Mirá nuestros productos</span>
              <motion.span
                animate={{ x: [0, 8, 0], scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="text-2xl md:text-3xl font-black text-[#FFD100] inline-block"
              >
                →
              </motion.span>
            </div>
          </motion.div>

          {/* 2. PRODUCT CARDS */}
          {productos.map((producto, i) => (
            <FullProductCard
              key={producto.id}
              producto={producto}
              index={i}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
