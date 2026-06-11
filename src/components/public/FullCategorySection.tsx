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
  sectionBgImage?: string
}

export function FullCategorySection({
  id,
  categoria,
  productos,
  colorFondo,
  imagenBack,
  mandalaPosition = 'top-right',
  sectionBgImage,
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
        padding: 'clamp(50px, 8vw, 80px) 0',
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

      {/* DECORATIVE BACKGROUND IMAGE */}
      <img
        src={imagenBack}
        alt=""
        style={{
          position: 'absolute',
          top: mandalaPosition.includes('top') ? 0 : 'auto',
          bottom: mandalaPosition.includes('bottom') ? 0 : 'auto',
          right: mandalaPosition.includes('right') ? 0 : 'auto',
          left: mandalaPosition.includes('left') ? 0 : 'auto',
          width: 'clamp(250px, 35vw, 450px)',
          height: 'auto',
          objectFit: 'contain',
          objectPosition: mandalaPosition.includes('left') ? 'left' : 'right',
          opacity: 0.35,      /* más tenue */
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* SECTION HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 80,
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
          paddingBottom: 40,
        }}
      >
        {/* 1. SECTION TAG — Caveat (script) font */}
        <p
          style={{
            fontFamily: 'var(--font-caveat)',
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 8,
            letterSpacing: '0.02em',
          }}
        >
          {categoria?.nombre?.toLowerCase() ?? id}
        </p>

        {/* 2. MAIN TITLE — Montserrat Black */}
        <h2
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'clamp(36px, 7vw, 80px)',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            maxWidth: 700,
            marginBottom: 12,
          }}
        >
          {categoria?.descripcion || categoria?.nombre}
        </h2>

        {/* 3. SUBTITLE */}
        {categoria?.subtitulo && (
          <p
            style={{
              fontSize: 'clamp(14px, 1.8vw, 20px)',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 20,
            }}
          >
            {categoria.subtitulo}
          </p>
        )}

        {/* 4. SCROLL INDICATOR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.35)',
            fontSize: 13,
            letterSpacing: '0.05em',
          }}
        >
          <span>Scrolleá para ver más</span>
          <span style={{ fontSize: 16 }}>→</span>
        </div>
      </motion.div>

      {/* PRODUCTS ROW WRAPPER */}
      <div className="relative w-full group">
        {/* SCROLL BUTTONS (Desktop only) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 hover:bg-black/80 rounded-full items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 hover:bg-black/80 rounded-full items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>

        {/* PRODUCTS SCROLL CONTAINER */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            overflowY: 'visible',
            gap: 'clamp(16px, 2vw, 32px)',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
          paddingBottom: 60,
          paddingTop: 20,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
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
