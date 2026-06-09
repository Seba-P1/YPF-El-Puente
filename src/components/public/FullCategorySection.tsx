'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FullProductCard } from './FullProductCard'
import type { Categoria, Producto } from '@/lib/supabase/types'

interface FullCategorySectionProps {
  id: string
  categoria: Categoria
  productos: Producto[]
  imagenFondo: string
  colorOverlay?: string
}

export function FullCategorySection({
  id,
  categoria,
  productos,
  imagenFondo,
  colorOverlay = 'rgba(0,0,0,0.5)'
}: FullCategorySectionProps) {
  const [bgError, setBgError] = useState(false)

  // Fallbacks by category
  const getFallbackGradient = () => {
    switch (categoria.slug) {
      case 'hamburguesas':
        return 'linear-gradient(135deg, #1a0a00, #3a1500)'
      case 'cafeteria':
        return 'linear-gradient(135deg, #0a0500, #2a1a00)'
      case 'marca_full':
        return 'linear-gradient(135deg, #00051a, #001030)'
      default:
        return 'var(--bg-base)'
    }
  }

  return (
    <motion.section
      id={id}
      className="relative min-h-screen flex flex-col justify-center"
      style={{ overflow: 'hidden' }} // Contenedor principal con overflow hidden (solo para la sección entera)
    >
      {/* FONDO */}
      <div className="absolute inset-0 z-0" style={{ background: getFallbackGradient() }}>
        {!bgError && (
          <Image
            src={imagenFondo}
            alt=""
            fill
            className="object-cover object-center"
            onError={() => setBgError(true)}
          />
        )}
      </div>

      {/* OVERLAY DE COLOR */}
      <div 
        className="absolute inset-0 z-[1]" 
        style={{ background: colorOverlay }}
      />

      {/* DEGRADADO DE ENTRADA (Arriba) */}
      <div 
        className="absolute top-0 left-0 right-0 h-[200px] z-[2]"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}
      />

      {/* DEGRADADO DE SALIDA (Abajo) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[200px] z-[2]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
      />

      {/* CONTENIDO SOBRE EL FONDO */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center pt-[60px] lg:pt-[100px]">
        
        {/* HEADER DE SECCIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mx-auto w-full"
          style={{
            maxWidth: 'var(--page-max, 1280px)',
            padding: '0 var(--page-pad-x, 24px)'
          }}
        >
          <div className="text-[14px] font-semibold text-white/50 lowercase tracking-[0.1em]">
            {categoria.nombre}
          </div>
          <h1 
            className="font-black text-white leading-none mt-2"
            style={{
              fontSize: 'clamp(32px, 6vw, 72px)',
              letterSpacing: '-0.03em',
              maxWidth: '700px'
            }}
          >
            {categoria.descripcion || categoria.nombre}
          </h1>
          {categoria.subtitulo && (
            <p 
              className="text-white/65 mt-3"
              style={{ fontSize: 'clamp(15px, 2vw, 20px)' }}
            >
              {categoria.subtitulo}
            </p>
          )}

          {/* INDICADOR DE SCROLL HORIZONTAL (Mobile Only) */}
          <div className="lg:hidden mt-5 text-[12px] text-white/40 tracking-[0.08em] animate-pulse">
            Scrolleá para ver más  →
          </div>
        </motion.div>

        {/* ÁREA DE PRODUCTOS (Importante: visible overflow!) */}
        <div 
          className="w-full pt-[40px] pb-[80px]"
          style={{ overflow: 'visible' }}
        >
          {/* Contenedor condicional: Scroll horizontal (Mobile) / Grid (Desktop) */}
          <div 
            className="flex lg:grid gap-[28px] lg:gap-y-[40px] lg:gap-x-[32px] overflow-x-auto lg:overflow-x-visible hide-scrollbar"
            style={{
              paddingLeft: 'var(--page-pad-x, 24px)',
              paddingRight: 'var(--page-pad-x, 24px)',
              paddingBottom: '32px', // Espacio extra para drop-shadow
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              maxWidth: 'var(--page-max, 1280px)',
              margin: '0 auto',
            }}
          >
            {productos.map((producto, index) => (
              <div 
                key={producto.id}
                className="shrink-0 lg:shrink"
                style={{ scrollSnapAlign: 'start' }}
              >
                <FullProductCard 
                  producto={producto} 
                  index={index} 
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  )
}
