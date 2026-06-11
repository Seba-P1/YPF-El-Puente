'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Instagram } from 'lucide-react'

import { FullSearchBar } from '@/components/public/FullSearchBar'
import { FullCategorySection } from '@/components/public/FullCategorySection'
import { FullProductCard } from '@/components/public/FullProductCard'
import { FullSustentabilidad } from '@/components/public/FullSustentabilidad'
import { useSearchStore } from '@/stores/search'

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

  const handleScrollToStart = () => {
    const el = document.getElementById('hamburguesas')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const [scrollScrolled, setScrollScrolled] = useState(false)
  const query = useSearchStore((state) => state.query)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const allProducts = useMemo(() => [...initialHamburguesas, ...initialCafeteria, ...initialMarcaFull], [initialHamburguesas, initialCafeteria, initialMarcaFull])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const q = debouncedQuery.trim()
    if (q.length > 0) {
      setIsSearching(true)
      const targetQuery = q.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      const filtrados = allProducts.filter(p => {
        const nombreNorm = p.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        const descNorm = p.descripcion ? p.descripcion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''
        return nombreNorm.includes(targetQuery) || descNorm.includes(targetQuery)
      })
      setSearchResults(filtrados)
      setTimeout(() => {
        const el = document.getElementById('search-results')
        if (el) {
          const yOffset = -80 // height of header + padding
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 150)
    } else {
      setIsSearching(false)
      setSearchResults(null)
    }
  }, [debouncedQuery, allProducts])

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
        <div className="absolute inset-0 z-0 bg-black">
          <picture>
            <source media="(max-width: 768px)" srcSet="/assets/ypf%20imagenes/RDP7-mobile.webp" />
            <img 
              src="/assets/ypf%20imagenes/RDP7.webp" 
              alt="RDP7 YPF FULL"
              className="w-full h-full object-cover object-center opacity-100"
            />
          </picture>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 hidden md:flex flex-col items-center drop-shadow-2xl"
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

      {/* 2. CATEGORY PILLS (formerly SearchBar) */}
      <FullSearchBar />

      {/* 3A. RESULTADOS DE BÚSQUEDA Y SECCIONES */}
      <AnimatePresence mode="wait">
        {isSearching && searchResults ? (
          <motion.section 
            id="search-results"
            key="search-results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-screen py-[60px]"
            style={{ background: 'var(--bg-base)' }}
          >
            <div className="mx-auto" style={{ maxWidth: 'var(--page-max, 1280px)', padding: '0 var(--page-pad-x, 24px)' }}>
              <h2 className="text-[22px] font-bold text-white">
                Resultados para &apos;{debouncedQuery}&apos;
              </h2>
              <p className="text-[14px] text-white/50 mt-1 mb-8">
                {searchResults.length} {searchResults.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-8">
                  {searchResults.map((producto, index) => (
                    <FullProductCard key={producto.id} producto={producto} index={index} layout="grid" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 mt-8">
                  <p className="text-white/60">No encontramos &apos;{debouncedQuery}&apos; en nuestro menú.</p>
                </div>
              )}
            </div>
          </motion.section>
        ) : (
          /* 3B. SECCIONES NORMALES */
          <motion.div
            key="normal-sections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FullCategorySection
              id="hamburguesas"
              categoria={catHamb}
              productos={initialHamburguesas}
              colorFondo="#1A0E00"
              imagenBack="/assets/ypf imagenes/back-4.webp"
              mandalaPosition="bottom-right"
            />
            <FullCategorySection
              id="cafeteria"
              categoria={catCaf}
              productos={initialCafeteria}
              colorFondo="#0D0800"
              imagenBack="/assets/ypf imagenes/back-2.webp"
              mandalaPosition="top-left"
              sectionBgImage="/assets/ypf imagenes/bg.svg"
            />
            <FullCategorySection
              id="productos-full"
              categoria={catFull}
              productos={initialMarcaFull}
              colorFondo="#060810"
              imagenBack="/assets/ypf imagenes/back-5.webp"
              mandalaPosition="top-right"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. SECCIÓN INSTAGRAM — @YPF.ELPUENTE */}
      <section className="bg-black py-[80px] border-t border-white/5">
        <div className="mx-auto" style={{ maxWidth: 'var(--page-max, 1280px)', padding: '0 var(--page-pad-x, 24px)' }}>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              <a
                href="https://instagram.com/ypf.elpuente"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group"
              >
                <div
                  style={{
                    width: 'clamp(200px, 30vw, 280px)',
                    height: 'clamp(200px, 30vw, 280px)',
                    transition: 'transform 0.3s, filter 0.3s',
                  }}
                  className="group-hover:scale-105"
                >
                  <Image
                    src="/assets/instagram/QR-YPFinstagram.png"
                    alt="QR Instagram @YPF.ELPUENTE"
                    width={280}
                    height={280}
                    className="w-full h-full object-contain"
                  />
                </div>
              </a>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-center md:text-left"
            >
              <p
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 8,
                }}
              >
                Seguinos
              </p>
              <h2
                className="font-black text-white leading-tight"
                style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-0.02em' }}
              >
                Seguinos en Instagram
              </h2>
              <p className="text-white/50 mt-3 mb-6" style={{ fontSize: 'clamp(14px, 1.6vw, 18px)' }}>
                Enterate de todas las promociones, novedades y el día a día de YPF El Puente.
              </p>
              <a
                href="https://instagram.com/ypf.elpuente"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 transition-colors group/link"
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Instagram size={22} color="white" />
                </div>
                <span className="text-white/70 group-hover/link:text-white font-bold text-lg tracking-wide transition-colors">
                  @YPF.ELPUENTE
                </span>
              </a>

              <p className="text-white/20 text-xs mt-6">
                Escaneá el código QR con tu celular para seguirnos
              </p>
            </motion.div>
          </div>

          {/* Instagram grid (fotos) */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1 w-full mt-12">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <InstagramImage key={num} num={num} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SUSTENTABILIDAD + MAPA */}
      <FullSustentabilidad />

      {/* 6. FOOTER SIMPLE */}
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
        href="https://instagram.com/ypf.elpuente"
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
