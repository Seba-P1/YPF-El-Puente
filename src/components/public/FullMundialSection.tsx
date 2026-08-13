'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { toast } from 'sonner'
import type { Producto } from '@/lib/supabase/types'
import { FullProductCard } from './FullProductCard'

const MUNDIAL_PRODUCTS: Producto[] = [
  {
    id: 'mundial-rdp7',
    codigo_plu: 'MUNDIAL-RDP7',
    nombre: 'Hamburguesa RDP7',
    descripcion: 'Pan brioche, doble medallón de carne, salsa provolone, huevo y papas fritas Full chimi.',
    categoria_slug: 'mundial',
    precio: 8900,
    imagen_url: '/assets/ypf imagenes/full_mundial/RDP7.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
    codigo_ypf: null,
    orden: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mundial-papas-chimi',
    codigo_plu: 'MUNDIAL-PAPAS',
    nombre: 'Papas Chimi',
    descripcion: 'Papas fritas crujientes con un delicioso aderezo de chimichurri especial.',
    categoria_slug: 'mundial',
    precio: 3900,
    imagen_url: '/assets/ypf imagenes/full_mundial/papas-chimi.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
    codigo_ypf: null,
    orden: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mundial-alfajor-negro',
    codigo_plu: 'MUNDIAL-ALF-NEGRO',
    nombre: 'Alfajor Full Negro',
    descripcion: 'Edición Mundialista. Alfajor con doble cobertura de chocolate negro y abundante dulce de leche.',
    categoria_slug: 'mundial',
    precio: 1800,
    imagen_url: '/assets/ypf imagenes/full_mundial/mundial-alfajor-negro.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
    codigo_ypf: null,
    orden: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mundial-alfajor-blanco',
    codigo_plu: 'MUNDIAL-ALF-BLANCO',
    nombre: 'Alfajor Full Blanco',
    descripcion: 'Edición Mundialista. Alfajor con doble cobertura de chocolate blanco y abundante dulce de leche.',
    categoria_slug: 'mundial',
    precio: 1800,
    imagen_url: '/assets/ypf imagenes/full_mundial/mundial-alfajor-blanco.webp?v=2',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
    codigo_ypf: null,
    orden: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mundial-dona',
    codigo_plu: 'MUNDIAL-DONA',
    nombre: 'Dona Mundialista',
    descripcion: 'Dona clásica con cobertura y decoración celeste y blanca especial.',
    categoria_slug: 'mundial',
    precio: 1500,
    imagen_url: '/assets/ypf imagenes/full_mundial/dona.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
    codigo_ypf: null,
    orden: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mundial-cafe-capi',
    codigo_plu: 'MUNDIAL-CAFE',
    nombre: 'Café Capi',
    descripcion: 'El café cappuccino oficial de los campeones, ideal para empezar tu día.',
    categoria_slug: 'mundial',
    precio: 2500,
    imagen_url: '/assets/ypf imagenes/full_mundial/cafe-capi.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
    codigo_ypf: null,
    orden: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export function FullMundialSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = (producto: Producto) => {
    addItem(producto)
    toast.success(`${producto.nombre} agregado al pedido`, { duration: 2000 })
  }

  const irAlPrimerProducto = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (scrollRef.current) {
      const textCard = scrollRef.current.firstElementChild as HTMLElement
      const offset = textCard ? textCard.offsetWidth : 300
      const currentScroll = scrollRef.current.scrollLeft
      const targetLeft = currentScroll > 50 ? 0 : offset

      scrollRef.current.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      })
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current
      const scrollAmount = window.innerWidth > 768 ? 600 : 300
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section id="mundial" className="relative bg-[#F4F9FC] overflow-hidden border-y border-[#005A9C]/10 min-h-[100svh] py-[clamp(24px,4svh,48px)] md:py-[clamp(32px,5svh,64px)] flex flex-col justify-center">
      {/* Background doodles on desktop — animated entrance from right */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0 bg-no-repeat bg-right bg-cover"
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div 
          className="w-full h-full opacity-30 lg:opacity-80"
          style={{
            backgroundImage: "url('/assets/ypf%20imagenes/full_mundial/bg-mundial.svg')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
          }}
        />
      </motion.div>

      <div className="relative w-full flex-1 min-h-0 group z-10 flex items-center">
        {/* SCROLL BUTTONS (Desktop only) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/60 hover:bg-white/90 text-[#005A9C] rounded-full items-center justify-center backdrop-blur-md border border-[#005A9C]/10 hover:border-[#005A9C]/20 transition-all opacity-0 group-hover:opacity-100 shadow-xl cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/60 hover:bg-white/90 text-[#005A9C] rounded-full items-center justify-center backdrop-blur-md border border-[#005A9C]/10 hover:border-[#005A9C]/20 transition-all opacity-0 group-hover:opacity-100 shadow-xl cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>

        {/* PRODUCTS SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="hide-scrollbar scroll-smooth snap-x snap-proximity flex flex-row items-stretch overflow-x-auto overflow-y-visible"
          style={{
            position: 'relative',
            zIndex: 1,
            gap: 'clamp(12px, 2vw, 32px)',
            paddingLeft: 'clamp(16px, 4vw, 80px)',
            paddingRight: 40,
            paddingTop: 'clamp(12px, 2svh, 24px)',
            paddingBottom: 'clamp(12px, 2svh, 24px)',
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
            className="flex-shrink-0 w-[55vw] max-w-[260px] md:w-[clamp(420px,26vw,560px)] md:max-w-none flex flex-col justify-center snap-center md:mr-8"
          >
            {/* Tag */}
            <p
              style={{
                fontFamily: 'var(--font-full), sans-serif',
                color: '#0096EB',
                fontSize: 'clamp(22px, 2.6vw, 34px)',
                fontWeight: 400,
              }}
              className="mb-2 tracking-widest uppercase"
            >
              EDICIÓN ESPECIAL
            </p>
            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-ddin), sans-serif',
                color: '#005A9C',
              }}
              className="font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08] mb-3 tracking-normal"
            >
              Productos mundialistas
            </h2>
            {/* Subtitle */}
            <p
              style={{
                fontFamily: 'var(--font-ddin), sans-serif',
                color: 'rgba(0, 90, 156, 0.8)',
              }}
              className="text-base md:text-lg mb-4 leading-relaxed font-normal"
            >
              Jugá siempre de local con estos productos.
            </p>
            {/* Indicator / CTA */}
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
                <span
                  style={{
                    fontFamily: 'var(--font-full), sans-serif',
                    color: '#005A9C',
                    fontSize: 'clamp(17px, 2.1vw, 26px)',
                    letterSpacing: '0.06em',
                    fontWeight: 400,
                  }}
                  className="uppercase"
                >
                  MIRÁ NUESTROS PRODUCTOS
                </span>
                <span
                  className="relative w-5 h-5 md:w-7 md:h-7 inline-block shrink-0"
                  style={{
                    backgroundColor: '#005A9C',
                    WebkitMaskImage: "url('/assets/ypf imagenes/full_hamburguesas/comidas-full-flecha.png')",
                    maskImage: "url('/assets/ypf imagenes/full_hamburguesas/comidas-full-flecha.png')",
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
              </span>
            </button>
          </motion.div>

          {/* 2. PRODUCT CARDS */}
          {MUNDIAL_PRODUCTS.map((producto, i) => (
            <FullProductCard
              key={producto.id}
              producto={producto}
              index={i}
              variant="mundial"
              showDescription={true}
              onAdd={handleAdd}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
