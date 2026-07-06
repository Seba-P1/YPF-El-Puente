'use client'

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Instagram } from 'lucide-react'

import { FullSearchBar } from '@/components/public/FullSearchBar'
import { FullCategorySection } from '@/components/public/FullCategorySection'
import { FullProductCard } from '@/components/public/FullProductCard'
import { FullSustentabilidad } from '@/components/public/FullSustentabilidad'
import { FullMundialSection } from '@/components/public/FullMundialSection'
import { useSearchStore } from '@/stores/search'
import { useFullPageStore } from '@/stores/fullpage'

import type { Producto, Categoria } from '@/lib/supabase/types'

interface FullClientProps {
  initialDestacados: Producto[]
  initialCategorias: Categoria[]
}

export default function FullClient({
  initialDestacados,
  initialCategorias
}: FullClientProps) {
  const [searchResults, setSearchResults] = useState<Producto[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [scrollScrolled, setScrollScrolled] = useState(false)
  
  const query = useSearchStore((state) => state.query)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const { currentSection, setCurrentSection, isEnabled, setEnabled, setSectionIds, goToSectionById } = useFullPageStore()

  // Refs for tracking wheel momentum (filtering trackpad inertia)
  const scrollEventsRef = useRef<number[]>([])
  const lastScrollTimeRef = useRef<number>(0)
  const isTransitioningRef = useRef<boolean>(false)

  const allProducts = useMemo(() => initialDestacados, [initialDestacados])

  // Group products by category (with fallback to first 12 active products if no featured exist)
  const productosPorCategoria = useMemo(() => {
    const map: Record<string, Producto[]> = {}
    
    // First group all active products by category
    const groupedAll: Record<string, Producto[]> = {}
    for (const p of initialDestacados) {
      if (!groupedAll[p.categoria_slug]) groupedAll[p.categoria_slug] = []
      groupedAll[p.categoria_slug].push(p)
    }

    // Populate map: featured first, fallback to first 12 active
    initialCategorias.forEach((cat) => {
      const allCatProds = groupedAll[cat.slug] ?? []
      const featured = allCatProds.filter((p) => p.destacado)
      if (featured.length > 0) {
        map[cat.slug] = featured
      } else {
        map[cat.slug] = allCatProds.slice(0, 12)
      }
    })

    return map
  }, [initialDestacados, initialCategorias])

  const comidasCalientes = productosPorCategoria['comidas_calientes'] ?? []
  const cafeteriaProducts = productosPorCategoria['cafeteria'] ?? []
  const marcaFullProducts = productosPorCategoria['marca_full'] ?? []

  // Gather active Sin TACC products
  const sinTaccProducts = useMemo(() => {
    return initialDestacados.filter((p) => {
      if (p.es_sin_tacc) return true
      const nameLower = p.nombre.toLowerCase()
      return (
        nameLower.includes('tacc') ||
        nameLower.includes('gluten') ||
        nameLower.includes('s/t') ||
        nameLower.includes('sintac') ||
        nameLower.includes('s.g.')
      )
    }).slice(0, 12)
  }, [initialDestacados])

  const catHamb = initialCategorias.find(c => c.slug === 'comidas_calientes') || { id: '1', nombre: 'Comidas Calientes', slug: 'comidas_calientes', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 1, created_at: '' } as Categoria
  const catCaf = initialCategorias.find(c => c.slug === 'cafeteria') || { id: '2', nombre: 'Cafetería', slug: 'cafeteria', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 2, created_at: '' } as Categoria
  const catFull = initialCategorias.find(c => c.slug === 'marca_full') || { id: '3', nombre: 'Marca Full', slug: 'marca_full', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 3, created_at: '' } as Categoria
  
  const catSinTacc = {
    id: 'sin-tacc-cat',
    nombre: 'Sin TACC',
    slug: 'sin_tacc',
    descripcion: 'Libres de Gluten',
    subtitulo: 'Deliciosas opciones aptas para celíacos y libres de TACC.',
    imagen_fondo_url: null,
    activa: true,
    orden: 4,
    created_at: ''
  } as Categoria

  // Define section IDs for programmatic navigation mapping
  useEffect(() => {
    setSectionIds([
      'home-hero',
      'mundial',
      'comidas-calientes',
      'cafeteria',
      'productos-full',
      'sin-tacc',
      'instagram',
      'sustentabilidad-section'
    ])
  }, [setSectionIds])

  // Handle screen resize to toggle fullpage scroll locking
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768
      setEnabled(isDesktop && !isSearching)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isSearching, setEnabled])

  // Toggle CSS class to lock outer window overflow on desktop
  useEffect(() => {
    if (isEnabled) {
      document.documentElement.classList.add('fullpage-locked')
    } else {
      document.documentElement.classList.remove('fullpage-locked')
    }
    return () => {
      document.documentElement.classList.remove('fullpage-locked')
    }
  }, [isEnabled])

  // Toggle search active status
  useEffect(() => {
    document.documentElement.classList.toggle('search-active', isSearching)
    return () => document.documentElement.classList.remove('search-active')
  }, [isSearching])

  // Search logic
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
          const yOffset = -80
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 150)
    } else {
      setIsSearching(false)
      setSearchResults(null)
    }
  }, [debouncedQuery, allProducts])

  // Mobile scroll monitor
  useEffect(() => {
    if (isEnabled) return
    const onScroll = () => {
      setScrollScrolled(window.scrollY > 120)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isEnabled])

  const triggerTransition = useCallback((nextSection: number) => {
    isTransitioningRef.current = true
    setCurrentSection(nextSection)
    setScrollScrolled(nextSection > 0)
    
    // Smooth transition cooling matching the 700ms sliding animation
    setTimeout(() => {
      isTransitioningRef.current = false
    }, 700)
  }, [setCurrentSection])

  // Custom keydown handler for sliding transitions on desktop
  useEffect(() => {
    if (!isEnabled || isSearching) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioningRef.current) return

      const direction = 
        e.key === 'ArrowDown' || e.key === 'PageDown' ? 'down' :
        e.key === 'ArrowUp' || e.key === 'PageUp' ? 'up' : null

      if (!direction) return

      if (currentSection === 7) {
        const scrollableContainer = document.getElementById('sustentabilidad-section')
        if (scrollableContainer) {
          const scrollTop = scrollableContainer.scrollTop
          const scrollHeight = scrollableContainer.scrollHeight
          const clientHeight = scrollableContainer.clientHeight

          if (direction === 'up' && scrollTop <= 0) {
            e.preventDefault()
            triggerTransition(6)
          } else if (direction === 'down' && scrollTop + clientHeight >= scrollHeight) {
            // End of footer, ignore
          } else {
            // Let the container scroll internally
          }
        }
      } else {
        e.preventDefault()
        if (direction === 'down') {
          if (currentSection < 7) triggerTransition(currentSection + 1)
        } else {
          if (currentSection > 0) triggerTransition(currentSection - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEnabled, currentSection, isSearching, triggerTransition])

  // Custom wheel handler with momentum checker to filter trackpad swipes
  useEffect(() => {
    if (!isEnabled || isSearching) return

    const onWheel = (e: WheelEvent) => {
      const deltaY = e.deltaY
      const absDeltaY = Math.abs(deltaY)
      const now = Date.now()

      // Reset scroll tracking if scrolling stops for 200ms
      if (now - lastScrollTimeRef.current > 200) {
        scrollEventsRef.current = []
      }
      lastScrollTimeRef.current = now
      scrollEventsRef.current.push(absDeltaY)
      if (scrollEventsRef.current.length > 150) {
        scrollEventsRef.current.shift()
      }

      // Ignore inputs if currently moving
      if (isTransitioningRef.current) {
        e.preventDefault()
        return
      }

      const getAverage = (len: number) => {
        const list = scrollEventsRef.current
        const sub = list.slice(Math.max(list.length - len, 0))
        if (sub.length === 0) return 0
        return sub.reduce((acc, val) => acc + val, 0) / sub.length
      }

      const avgFast = getAverage(10)
      const avgSlow = getAverage(70)
      const direction = deltaY > 0 ? 'down' : 'up'

      if (currentSection === 7) {
        const scrollableContainer = document.getElementById('sustentabilidad-section')
        if (scrollableContainer) {
          const scrollTop = scrollableContainer.scrollTop
          const scrollHeight = scrollableContainer.scrollHeight
          const clientHeight = scrollableContainer.clientHeight

          if (direction === 'up' && scrollTop <= 0) {
            e.preventDefault()
            if (avgFast >= avgSlow && absDeltaY > 5) {
              triggerTransition(6)
            }
          } else if (direction === 'down' && scrollTop + clientHeight >= scrollHeight) {
            // At the bottom of map/footer, block event
            e.preventDefault()
          } else {
            // Let the container scroll natively (do NOT call preventDefault)
          }
        }
      } else {
        e.preventDefault()
        if (avgFast >= avgSlow && absDeltaY > 5) {
          if (direction === 'down') {
            if (currentSection < 7) triggerTransition(currentSection + 1)
          } else {
            if (currentSection > 0) triggerTransition(currentSection - 1)
          }
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [isEnabled, currentSection, isSearching, triggerTransition])

  const handleScrollToStart = () => {
    if (isEnabled) {
      goToSectionById('comidas-calientes')
    } else {
      const el = document.getElementById('comidas-calientes')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Hero section component
  const renderHeroSection = () => (
    <section 
      id="home-hero"
      className="relative flex flex-col items-center justify-center w-full overflow-hidden"
      style={{
        height: '100svh',
        background: '#000000',
        paddingTop: 'var(--navbar-h, 68px)'
      }}
    >
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
  )

  // Instagram section component
  const renderInstagramSection = () => (
    <section id="instagram" className="bg-black py-[80px] border-t border-white/5 md:min-h-[100svh] md:py-0 md:flex md:flex-col md:justify-center">
      <div className="mx-auto" style={{ maxWidth: 'var(--page-max, 1280px)', padding: '0 var(--page-pad-x, 24px)' }}>
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
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

        <div className="grid grid-cols-3 md:grid-cols-6 gap-1 w-full mt-6 md:mt-[3svh]">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <InstagramImage key={num} num={num} />
          ))}
        </div>
      </div>
    </section>
  )

  // Footer component
  const renderFooter = () => (
    <footer className="bg-black border-t border-white/5 py-[32px]">
      <div className="mx-auto flex flex-col items-center justify-center gap-6" style={{ maxWidth: 'var(--page-max, 1280px)', padding: '0 var(--page-pad-x, 24px)' }}>
        <Image
          src="/assets/ypf imagenes/logo-modoclaro.png"
          alt="YPF El Puente"
          width={160}
          height={48}
          className="opacity-50 dark:hidden"
        />
        <Image
          src="/assets/ypf imagenes/logo-modooscuro.png"
          alt="YPF El Puente"
          width={160}
          height={48}
          className="opacity-50 hidden dark:block"
        />
        <p className="text-[12px] text-white/25">
          © YPF El Puente — Río Colorado, Patagonia Argentina
        </p>
      </div>
    </footer>
  )

  // RENDER FULLPAGE DIAPOSITIVAS (DESKTOP)
  if (isEnabled) {
    return (
      <main className="bg-black text-white relative">
        <FullSearchBar />
        <div 
          className="fullpage-wrapper"
          style={{ 
            transform: `translate3d(0, -${currentSection * 100}svh, 0)`,
            transition: 'transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {/* Slide 0: Hero */}
          <div className="fullpage-section">
            {renderHeroSection()}
          </div>
          
          {/* Slide 1: Mundial */}
          <div className="fullpage-section">
            <FullMundialSection />
          </div>

          {/* Slide 2: Comidas Calientes */}
          <div className="fullpage-section">
            <FullCategorySection
              id="comidas-calientes"
              categoria={catHamb}
              productos={comidasCalientes}
              colorFondo="#1A0E00"
              imagenBack="/assets/ypf imagenes/back-4.webp"
              mandalaPosition="bottom-right"
            />
          </div>

          {/* Slide 3: Cafetería */}
          <div className="fullpage-section">
            <FullCategorySection
              id="cafeteria"
              categoria={catCaf}
              productos={cafeteriaProducts}
              colorFondo="#0D0800"
              imagenBack="/assets/ypf imagenes/back-2.webp"
              mandalaPosition="top-left"
              sectionBgImage="/assets/ypf imagenes/bg.svg"
            />
          </div>

          {/* Slide 4: Exclusivos FULL */}
          <div className="fullpage-section">
            <FullCategorySection
              id="productos-full"
              categoria={catFull}
              productos={marcaFullProducts}
              colorFondo="#060810"
              imagenBack="/assets/ypf imagenes/back-5.webp"
              mandalaPosition="top-right"
            />
          </div>

          {/* Slide 5: Sin TACC */}
          <div className="fullpage-section">
            <FullCategorySection
              id="sin-tacc"
              categoria={catSinTacc}
              productos={sinTaccProducts}
              colorFondo="#041E15"
              imagenBack="/assets/ypf imagenes/back-3.webp"
              mandalaPosition="bottom-left"
            />
          </div>

          {/* Slide 6: Instagram */}
          <div className="fullpage-section">
            {renderInstagramSection()}
          </div>

          {/* Slide 7: Sustentabilidad, Mapa y Footer (Scrollable) */}
          <div id="sustentabilidad-section" className="fullpage-section fullpage-scrollable">
            <FullSustentabilidad />
            {renderFooter()}
          </div>
        </div>
      </main>
    )
  }

  // RENDER NORMAL (MOBILE / BUSCANDO)
  return (
    <main className="bg-black text-white relative">
      {/* 1. HERO SECTION */}
      {renderHeroSection()}

      {/* 2. CATEGORY PILLS */}
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
            <FullMundialSection />
            <FullCategorySection
              id="comidas-calientes"
              categoria={catHamb}
              productos={comidasCalientes}
              colorFondo="#1A0E00"
              imagenBack="/assets/ypf imagenes/back-4.webp"
              mandalaPosition="bottom-right"
            />
            <FullCategorySection
              id="cafeteria"
              categoria={catCaf}
              productos={cafeteriaProducts}
              colorFondo="#0D0800"
              imagenBack="/assets/ypf imagenes/back-2.webp"
              mandalaPosition="top-left"
              sectionBgImage="/assets/ypf imagenes/bg.svg"
            />
            <FullCategorySection
              id="productos-full"
              categoria={catFull}
              productos={marcaFullProducts}
              colorFondo="#060810"
              imagenBack="/assets/ypf imagenes/back-5.webp"
              mandalaPosition="top-right"
            />
            <FullCategorySection
              id="sin-tacc"
              categoria={catSinTacc}
              productos={sinTaccProducts}
              colorFondo="#041E15"
              imagenBack="/assets/ypf imagenes/back-3.webp"
              mandalaPosition="bottom-left"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. SECCIÓN INSTAGRAM */}
      {renderInstagramSection()}

      {/* 5. SUSTENTABILIDAD + MAPA */}
      <FullSustentabilidad />

      {/* 6. FOOTER */}
      {renderFooter()}
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
