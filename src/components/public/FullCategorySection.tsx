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
  customTagName?: string
  tagColor?: string
  tagFont?: 'full' | 'caveat' | 'din' | 'montserrat'
  customTitle?: string
  titleColor?: string
  titleFont?: 'din' | 'montserrat' | 'full'
  customSubtitle?: string
  subtitleColor?: string
  subtitlePosition?: 'above-cta' | 'below-cta'
  customCtaText?: string
  ctaColor?: string
  ctaFont?: 'full' | 'caveat' | 'din'
  ctaArrowImage?: string
  ctaArrowColor?: 'green' | 'yellow' | 'white'
  priceColor?: string
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
  customTagName,
  tagColor = 'rgba(255, 255, 255, 0.55)',
  tagFont = 'caveat',
  customTitle,
  titleColor = '#ffffff',
  titleFont = 'din',
  customSubtitle,
  subtitleColor,
  subtitlePosition = 'above-cta',
  customCtaText,
  ctaColor = '#FFD100',
  ctaFont = 'caveat',
  ctaArrowImage,
  ctaArrowColor = 'green',
  priceColor,
}: FullCategorySectionProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const irAlPrimerProducto = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (scrollContainerRef.current) {
      const textCard = scrollContainerRef.current.firstElementChild as HTMLElement
      const offset = textCard ? textCard.offsetWidth : 300
      const currentScroll = scrollContainerRef.current.scrollLeft
      const targetLeft = currentScroll > 50 ? 0 : offset

      scrollContainerRef.current.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      })
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  const getTagFontFamily = () => {
    if (tagFont === 'full') return 'var(--font-full), sans-serif'
    if (tagFont === 'din') return 'var(--font-ddin), sans-serif'
    if (tagFont === 'montserrat') return 'var(--font-montserrat), sans-serif'
    return 'var(--font-caveat), cursive'
  }

  const getTitleFontFamily = () => {
    if (titleFont === 'full') return 'var(--font-full), sans-serif'
    if (titleFont === 'montserrat') return 'var(--font-montserrat), sans-serif'
    return 'var(--font-ddin), sans-serif'
  }

  const getCtaFontFamily = () => {
    if (ctaFont === 'full') return 'var(--font-full), sans-serif'
    if (ctaFont === 'din') return 'var(--font-ddin), sans-serif'
    return 'var(--font-caveat), cursive'
  }

  const getArrowFilter = () => {
    if (ctaArrowColor === 'yellow') return 'brightness(0) saturate(100%) invert(79%) sepia(52%) saturate(520%) hue-rotate(5deg) brightness(97%) contrast(91%)'
    if (ctaArrowColor === 'white') return 'brightness(0) invert(1)'
    return 'none'
  }

  const displayTagName = customTagName ?? (categoria?.nombre?.toUpperCase() ?? id.toUpperCase())
  const displayTitle = customTitle ?? (categoria?.descripcion || categoria?.nombre)
  const displaySubtitle = customSubtitle !== undefined ? customSubtitle : categoria?.subtitulo
  const displayCtaText = customCtaText ?? 'Mirá nuestros productos'
  const activeArrowImage = ctaArrowImage || '/assets/ypf imagenes/full_hamburguesas/comidas-full-flecha.png'

  const renderSubtitle = () => {
    if (!displaySubtitle) return null
    return (
      <p
        style={{
          fontFamily: 'var(--font-ddin), sans-serif',
          color: subtitleColor || 'rgba(255, 255, 255, 0.65)',
        }}
        className={`text-base md:text-lg leading-relaxed font-normal ${subtitlePosition === 'below-cta' ? 'mt-4 mb-2' : 'mb-4'}`}
      >
        {displaySubtitle}
      </p>
    )
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
        overflow: 'hidden',
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
            gap: 'clamp(12px, 2vw, 32px)',
            paddingLeft: 'clamp(16px, 4vw, 80px)',
            paddingRight: 40,
            paddingBottom: 40,
            paddingTop: 'clamp(30px, 4vw, 60px)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
          }}
        >
          {/* 1. TEXT BLOCK CARD */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-shrink-0 w-[55vw] max-w-[260px] md:max-w-[420px] flex flex-col justify-center snap-center md:mr-8"
          >
            {/* Tag */}
            <p
              style={{
                fontFamily: getTagFontFamily(),
                color: tagColor,
                fontSize: tagFont === 'full' ? 'clamp(22px, 2.6vw, 34px)' : 'clamp(20px, 2.5vw, 30px)',
                fontWeight: tagFont === 'full' ? 400 : 700,
              }}
              className="mb-2 tracking-widest"
            >
              {displayTagName}
            </p>

            {/* Title */}
            <h2
              style={{
                fontFamily: getTitleFontFamily(),
                color: titleColor,
              }}
              className="font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08] mb-3 tracking-normal"
            >
              {displayTitle}
            </h2>

            {/* Subtitle (Above CTA) */}
            {subtitlePosition === 'above-cta' && renderSubtitle()}

            {/* Extra subtitle (e.g. hamburguesas combo info) */}
            {extraSubtitle && (
              <p className="font-[family-name:var(--font-ddin)] text-sm md:text-base text-white/80 mb-4 leading-relaxed font-normal">
                {extraSubtitle}
              </p>
            )}

            {/* Indicator / CTA — Inline text with arrow flow */}
            {(() => {
              const ctaLines = displayCtaText.split('\n')
              return (
                <button
                  onClick={irAlPrimerProducto}
                  className="block text-left mt-2 bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity max-w-full group"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 0',
                  }}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="flex flex-col text-left">
                      {ctaLines.map((line, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontFamily: getCtaFontFamily(),
                            color: ctaColor,
                            fontSize: ctaFont === 'full' ? 'clamp(17px, 2.1vw, 26px)' : 'clamp(16px, 2vw, 24px)',
                            letterSpacing: '0.06em',
                            fontWeight: ctaFont === 'full' ? 400 : 700,
                            lineHeight: 1.15,
                          }}
                          className="uppercase"
                        >
                          {line}
                        </span>
                      ))}
                    </span>
                    {activeArrowImage ? (
                      <span
                        className="relative w-5 h-5 md:w-7 md:h-7 inline-block shrink-0"
                        style={{
                          backgroundColor: ctaColor,
                          WebkitMaskImage: `url('${activeArrowImage}')`,
                          maskImage: `url('${activeArrowImage}')`,
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                        }}
                      />
                    ) : (
                      <motion.span
                        animate={{ x: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        style={{ color: ctaColor }}
                        className="text-xl md:text-2xl font-black inline-block shrink-0 ml-1"
                      >
                        →
                      </motion.span>
                    )}
                  </span>
                </button>
              )
            })()}

            {/* Subtitle (Below CTA) */}
            {subtitlePosition === 'below-cta' && renderSubtitle()}
          </motion.div>

          {/* 2. PRODUCT CARDS */}
          {productos.map((producto, i) => (
            <FullProductCard
              key={producto.id}
              producto={producto}
              index={i}
              priceColor={priceColor}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
