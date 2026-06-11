'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, Instagram } from 'lucide-react'

import { FullSearchBar } from '@/components/public/FullSearchBar'
import { FullCategorySection } from '@/components/public/FullCategorySection'
import { FullProductCard } from '@/components/public/FullProductCard'

import type { Producto, Categoria } from '@/lib/supabase/types'

interface FullClientProps {
  initialHamburguesas: Producto[]
  initialCafeteria: Producto[]
  initialMarcaFull: Producto[]
  initialCategorias: Categoria[]
}

export default function FullClient({
  initialHamburguesas,
  initialCafeteria,
  initialMarcaFull,
  initialCategorias
}: FullClientProps) {
  const [searchResults, setSearchResults] = useState<Producto[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleScrollToStart = () => {
    const el = document.getElementById('hamburguesas')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const [scrollScrolled, setScrollScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      setScrollScrolled(window.scrollY > 120)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const catHamb = initialCategorias.find(c => c.slug === 'hamburguesas') || { id: '1', nombre: 'hamburguesas', slug: 'hamburguesas', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 1, created_at: '' } as Categoria
  const catCaf = initialCategorias.find(c => c.slug === 'cafeteria') || { id: '2', nombre: 'cafetería', slug: 'cafeteria', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 2, created_at: '' } as Categoria
  const catFull = initialCategorias.find(c => c.slug === 'marca_full') || { id: '3', nombre: 'productos exclusivos full', slug: 'marca_full', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 3, created_at: '' } as Categoria

  const allProducts = [...initialHamburguesas, ...initialCafeteria, ...initialMarcaFull]

  return (
    <main className="bg-black text-white relative">
      {/* 1. HERO SECTION */}
      <section 
        id="home-hero"
        className="relative flex flex-col items-center justify-center w-full overflow-hidden"
        style={{
          height: '100svh',
          background: '#000000',
          paddingTop: 'var(--navbar-h, 68px)'
        }}
      >
        {/* FONDO RDP7 */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/assets/ypf imagenes/RDP7-mobile.webp" />
            <img 
              src="/assets/ypf imagenes/RDP7.webp" 
              alt="RDP7 YPF FULL"
              className="w-full h-full object-cover object-center opacity-80"
            />
          </picture>
          {/* Overlay sutil para oscurecer la imagen y que resalte el logo */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 flex flex-col items-center drop-shadow-2xl"
        >
          <div className="relative w-[280px] h-[120px] md:w-[450px] md:h-[180px]">
            <Image
              src="/assets/ypf imagenes/RDP7.svg"
              alt="RDP7 YPF FULL"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {!scrollScrolled && (
          <motion.button
            onClick={handleScrollToStart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown size={32} />
          </motion.button>
        )}
      </section>

      {/* 2. SEARCH BAR STICKY */}
      <FullSearchBar 
        productos={allProducts} 
        onFilter={(resultados, query) => {
          setIsSearching(query.length > 0)
          setSearchResults(query.length > 0 ? resultados : null)
          setSearchQuery(query)
        }} 
      />

      {/* 3A. RESULTADOS DE BÚSQUEDA */}
      {isSearching && searchResults ? (
        <section 
          className="min-h-screen py-[60px]"
          style={{ background: 'var(--bg-base)' }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--page-max, 1280px)', padding: '0 var(--page-pad-x, 24px)' }}>
            <h2 className="text-[22px] font-bold text-white">
              Resultados para &apos;{searchQuery}&apos;
            </h2>
            <p className="text-[14px] text-white/50 mt-1 mb-8">
              {searchResults.length} {searchResults.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-8">
                {searchResults.map((producto, index) => (
                  <FullProductCard key={producto.id} producto={producto} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 mt-8">
                <p className="text-white/60">No encontramos &apos;{searchQuery}&apos; en nuestro menú.</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* 3B. SECCIONES NORMALES */
        <>
          <FullCategorySection
            id="hamburguesas"
            categoria={catHamb}
            productos={initialHamburguesas}
            imagenFondo="/assets/ypf imagenes/back-4.webp"
            colorOverlay="rgba(0,0,0,0.45)"
          />
          <FullCategorySection
            id="cafeteria"
            categoria={catCaf}
            productos={initialCafeteria}
            imagenFondo="/assets/ypf imagenes/back-2.webp"
            colorOverlay="rgba(20,10,5,0.55)"
          />
          <FullCategorySection
            id="productos-full"
            categoria={catFull}
            productos={initialMarcaFull}
            imagenFondo="/assets/ypf imagenes/back-5.webp"
            colorOverlay="rgba(0,5,20,0.55)"
          />
        </>
      )}

      {/* 4. SECCIÓN INSTAGRAM */}
      <section className="bg-black py-[80px] border-t border-white/5">
        <div className="mx-auto" style={{ maxWidth: 'var(--page-max, 1280px)', padding: '0 var(--page-pad-x, 24px)' }}>
          <div className="mb-10 text-center">
            <span className="text-[11px] tracking-[0.2em] text-white/35 uppercase block mb-2">
              Seguinos
            </span>
            <h2 
              className="font-extrabold text-white leading-tight"
              style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}
            >
              Seguinos en Instagram
            </h2>
            <p className="text-white/50 mt-2 mb-6">Enterate de todas las promociones</p>
            <a 
              href="https://instagram.com/ypffull" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <Instagram size={20} />
              <span className="font-semibold tracking-wide">@ypffull</span>
            </a>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-1 w-full">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <InstagramImage key={num} num={num} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER SIMPLE */}
      <footer className="bg-black border-t border-white/5 py-[32px]">
        <div className="mx-auto flex flex-col items-center justify-center gap-6" style={{ maxWidth: 'var(--page-max, 1280px)', padding: '0 var(--page-pad-x, 24px)' }}>
          <Image
            src="/assets/logo/logo-white-wide.png"
            alt="YPF FULL"
            width={160}
            height={48}
            className="opacity-50"
          />
          <p className="text-[12px] text-white/25">
            © YPF El Puente — Río Colorado, Patagonia Argentina
          </p>
        </div>
      </footer>
    </main>
  )
}

const IG_COLORS = ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#533483', '#3b82f6']

function InstagramImage({ num }: { num: number }) {
  const [error, setError] = useState(false)

  const handleError = useCallback(() => setError(true), [])

  if (error) {
    return (
      <a
        href="https://instagram.com/ypffull"
        target="_blank"
        rel="noreferrer"
        className="relative aspect-square overflow-hidden group block"
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: IG_COLORS[num - 1] ?? '#333' }}
        >
          <div className="text-center">
            <div className="text-white/60 text-3xl font-bold">FULL</div>
            <div className="text-white/30 text-xs mt-1">@{num}</div>
          </div>
        </div>
      </a>
    )
  }

  return (
    <a
      href="https://instagram.com/ypffull"
      target="_blank"
      rel="noreferrer"
      className="relative aspect-square overflow-hidden group block"
    >
      <Image
        src={`/assets/instagram/ig-${num}.webp`}
        alt={`Instagram FULL ${num}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={handleError}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
    </a>
  )
}
