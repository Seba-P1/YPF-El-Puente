'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { toast } from 'sonner'
import { formatearPrecioARS } from '@/lib/excel/parser'
import type { Producto } from '@/lib/supabase/types'

const MUNDIAL_PRODUCTS: Producto[] = [
  {
    id: 'mundial-rdp7',
    codigo_plu: 'MUNDIAL-RDP7',
    nombre: 'Hamburguesa RDP7',
    descripcion: 'Pan brioche, doble medallón de carne, salsa provolone, huevo y papas fritas Full chimi.',
    categoria_slug: 'mundial',
    precio: 8900,
    imagen_url: '/assets/ypf imagenes/mundial/RDP7.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
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
    imagen_url: '/assets/ypf imagenes/mundial/papas-chimi.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
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
    imagen_url: '/assets/ypf imagenes/mundial/alfajor-negro.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
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
    imagen_url: '/assets/ypf imagenes/mundial/alfajor-15.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
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
    imagen_url: '/assets/ypf imagenes/mundial/dona.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
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
    imagen_url: '/assets/ypf imagenes/mundial/cafe-capi.webp',
    imagen_path: null,
    disponible: true,
    destacado: true,
    badge: 'Edición Especial',
    es_sin_tacc: false,
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current
      const scrollAmount = window.innerWidth > 768 ? 600 : 300
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section id="mundial" className="relative bg-[#F4F9FC] overflow-hidden border-y border-[#005A9C]/10 min-h-[100svh] py-[clamp(56px,7svh,96px)] md:py-[clamp(72px,8svh,120px)] flex flex-col justify-center">
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
          className="hide-scrollbar scroll-smooth snap-x snap-mandatory flex flex-row items-stretch overflow-x-auto overflow-y-visible"
          style={{
            position: 'relative',
            zIndex: 1,
            gap: 'clamp(16px, 2vw, 32px)',
            paddingLeft: 'clamp(24px, 5vw, 80px)',
            paddingRight: 'clamp(24px, 5vw, 80px)',
            paddingTop: 'clamp(24px, 4svh, 56px)',
            paddingBottom: 'clamp(24px, 4svh, 56px)',
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
            className="flex-shrink-0 w-[85vw] max-w-[340px] md:w-[clamp(400px,24vw,520px)] md:max-w-none flex flex-col justify-center snap-center mr-6 md:mr-12"
          >
            {/* Tag */}
            <span className="font-[family-name:var(--font-caveat)] text-2xl md:text-3xl text-[#0096EB] font-bold tracking-wide mb-2">
              EDICIÓN ESPECIAL
            </span>
            {/* Title */}
            <h2 className="font-[family-name:var(--font-din-medium)] font-black text-4xl md:text-6xl text-[#005A9C] leading-none mb-3 tracking-tight">
              Productos mundialistas
            </h2>
            {/* Subtitle */}
            <p className="font-[family-name:var(--font-montserrat)] text-sm md:text-base text-[#005A9C]/80 mb-6 leading-relaxed">
              Jugá siempre de local con estos productos.
            </p>
            {/* Indicator */}
            <div className="flex items-center gap-2 text-[#E2B007] text-sm font-bold tracking-wider uppercase">
              <span className="font-[family-name:var(--font-caveat)] text-xl">Scrolleá para ver más</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </div>
          </motion.div>

          {/* 2. PRODUCT CARDS */}
          {MUNDIAL_PRODUCTS.map((producto) => (
            <div
              key={producto.id}
              className="relative flex-shrink-0 w-[270px] md:w-[clamp(320px,18vw,400px)] snap-center flex flex-col items-center justify-end group pt-[175px] md:pt-[clamp(190px,15vw,260px)] pb-4"
            >
              {/* Product Image (Outside the card, overlapping) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(92vw,468px)] h-[min(68vw,350px)] md:w-[clamp(468px,24.7vw,546px)] md:h-[clamp(330px,18vw,410px)] flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2 pointer-events-none">
                <Image
                  src={producto.imagen_url || '/assets/placeholder.png'}
                  alt={producto.nombre}
                  fill
                  sizes="(max-width: 768px) 92vw, 546px"
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Glass Product Info Card */}
              <div className="w-full flex flex-col items-center bg-white/20 backdrop-blur-md border border-[#005A9C]/10 rounded-3xl p-5 shadow-xl shadow-[#005A9C]/5 transition-all duration-300 group-hover:bg-white/40 group-hover:border-[#005A9C]/20 pt-[68px] md:pt-[clamp(72px,5vw,104px)] mt-[20px] min-h-[230px] md:min-h-[clamp(230px,14vw,280px)] relative z-0">
                <h3 className="font-[family-name:var(--font-montserrat)] text-[13px] lg:text-[14px] font-bold text-[#005A9C] text-center line-clamp-2 min-h-[36px] flex items-center justify-center px-1">
                  {producto.nombre}
                </h3>
                <p className="font-[family-name:var(--font-montserrat)] text-[11px] text-[#005A9C]/70 mt-1 line-clamp-3 min-h-[40px] px-2 leading-relaxed">
                  {producto.descripcion}
                </p>
                
                {producto.precio && (
                  <span className="font-[family-name:var(--font-montserrat)] text-[14px] font-black text-[#005A9C] mt-2 bg-[#005A9C]/5 px-2.5 py-0.5 rounded-full">
                    {formatearPrecioARS(producto.precio)}
                  </span>
                )}

                {/* Add to order button */}
                <button
                  onClick={() => handleAdd(producto)}
                  className="mt-4 w-full h-[36px] rounded-xl text-[11px] font-bold text-white bg-[#005A9C] hover:bg-[#004B82] border border-transparent transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-[#005A9C]/10"
                >
                  + Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
