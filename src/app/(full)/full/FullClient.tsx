'use client'

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import { FullSearchBar } from '@/components/public/FullSearchBar'
import { FullCategorySection } from '@/components/public/FullCategorySection'
import { FullProductCard } from '@/components/public/FullProductCard'
import { FullSustentabilidad } from '@/components/public/FullSustentabilidad'
import { FullMundialSection } from '@/components/public/FullMundialSection'
import FullInstagramSection from '@/components/public/FullInstagramSection'
import { useSearchStore } from '@/stores/search'
import { useFullPageStore } from '@/stores/fullpage'

import type { Producto, Categoria, InstagramPost } from '@/lib/supabase/types'

interface FullClientProps {
  initialDestacados: Producto[]
  initialCategorias: Categoria[]
  initialFullHamburguesas: Producto[]
  initialFullCafeteria: Producto[]
  initialFullMarca: Producto[]
  initialFullSinTacc: Producto[]
  initialFullMundial: Producto[]
  initialInstagramPosts: InstagramPost[]
}

export default function FullClient({
  initialDestacados,
  initialCategorias,
  initialFullHamburguesas,
  initialFullCafeteria,
  initialFullMarca,
  initialFullSinTacc,
  initialFullMundial,
  initialInstagramPosts,
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

  const fullHamburguesas = initialFullHamburguesas ?? []
  const fullCafeteria = initialFullCafeteria ?? []
  const productosFullProducts = initialFullMarca ?? []
  const fullSinTacc = initialFullSinTacc ?? []
  const fullMundial = initialFullMundial ?? []

  const catHamb = initialCategorias.find(c => c.slug === 'full_hamburguesas') || { id: '1', nombre: 'Hamburguesas', slug: 'full_hamburguesas', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 1, created_at: '' } as Categoria
  const catCaf = initialCategorias.find(c => c.slug === 'full_cafeteria') || { id: '2', nombre: 'Cafetería', slug: 'full_cafeteria', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 2, created_at: '' } as Categoria
  const catFull = initialCategorias.find(c => c.slug === 'marca_full') || { id: '3', nombre: 'Marca Full', slug: 'marca_full', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 3, created_at: '' } as Categoria
  const catSinTacc = initialCategorias.find(c => c.slug === 'full_sin_tacc') || { id: '4', nombre: 'Sin TACC', slug: 'full_sin_tacc', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 4, created_at: '' } as Categoria
  const catMundial = initialCategorias.find(c => c.slug === 'full_mundial') || { id: '5', nombre: 'Mundial', slug: 'full_mundial', descripcion: null, subtitulo: null, imagen_fondo_url: null, activa: true, orden: 5, created_at: '' } as Categoria

  // Define section IDs for programmatic navigation mapping
  useEffect(() => {
    setSectionIds([
      'home-hero',
      'mundial',
      'hamburguesas',
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
      const deltaX = e.deltaX
      const absDeltaY = Math.abs(deltaY)
      const absDeltaX = Math.abs(deltaX)
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

      // HORIZONTAL GESTURE DETECTION: if deltaX > deltaY, it's a horizontal
      // trackpad swipe — let the browser scroll the carousel natively
      if (absDeltaX > absDeltaY * 1.5 && absDeltaX > 2) {
        // Do NOT preventDefault — let the horizontal scroll happen naturally
        return
      }

      // Also ignore small diagonal gestures (trackpad inertia)
      if (absDeltaX > absDeltaY * 0.8 && absDeltaY < 15) {
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
      goToSectionById('mundial')
    } else {
      const el = document.getElementById('mundial')
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

          {/* Slide 2: Hamburguesas */}
          <div className="fullpage-section">
            <FullCategorySection
              id="hamburguesas"
              categoria={catHamb}
              productos={fullHamburguesas}
              colorFondo="#1A0E00"
              imagenBack="/assets/ypf imagenes/back-4.webp"
              mandalaPosition="bottom-right"
              mandalaScale={0.6}
              extraSubtitle="Todas las Hamburguesas vienen con papas y gaseosa linea Coca Cola."
            />
          </div>

          {/* Slide 3: Cafetería */}
          <div className="fullpage-section">
            <FullCategorySection
              id="cafeteria"
              categoria={catCaf}
              productos={fullCafeteria}
              colorFondo="#0D0800"
              imagenBack="/assets/ypf imagenes/back-2.webp"
              mandalaPosition="top-left"
              mandalaScale={0.6}
              sectionBgImage="/assets/ypf imagenes/bg.svg"
            />
          </div>

          {/* Slide 4: Productos Full */}
          <div className="fullpage-section">
            <FullCategorySection
              id="productos-full"
              categoria={catFull}
              productos={productosFullProducts}
              colorFondo="#060810"
              imagenBack="/assets/ypf imagenes/back-5.webp"
              mandalaPosition="top-right"
              mandalaScale={0.6}
            />
          </div>

          {/* Slide 5: Sin TACC */}
          <div className="fullpage-section">
            <FullCategorySection
              id="sin-tacc"
              categoria={catSinTacc}
              productos={fullSinTacc}
              colorFondo="#041E15"
              imagenBack="/assets/ypf imagenes/back-3.webp"
              mandalaPosition="bottom-left"
              mandalaScale={0.6}
            />
          </div>

          {/* Slide 6: Instagram */}
          <div className="fullpage-section">
            <FullInstagramSection posts={initialInstagramPosts} />
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
              id="hamburguesas"
              categoria={catHamb}
              productos={fullHamburguesas}
              colorFondo="#1A0E00"
              imagenBack="/assets/ypf imagenes/back-4.webp"
              mandalaPosition="bottom-right"
              mandalaScale={0.6}
              extraSubtitle="Todas las Hamburguesas vienen con papas y gaseosa linea Coca Cola."
            />
            <FullCategorySection
              id="cafeteria"
              categoria={catCaf}
              productos={fullCafeteria}
              colorFondo="#0D0800"
              imagenBack="/assets/ypf imagenes/back-2.webp"
              mandalaPosition="top-left"
              mandalaScale={0.6}
              sectionBgImage="/assets/ypf imagenes/bg.svg"
            />
            <FullCategorySection
              id="productos-full"
              categoria={catFull}
              productos={productosFullProducts}
              colorFondo="#060810"
              imagenBack="/assets/ypf imagenes/back-5.webp"
              mandalaPosition="top-right"
              mandalaScale={0.6}
            />
            <FullCategorySection
              id="sin-tacc"
              categoria={catSinTacc}
              productos={fullSinTacc}
              colorFondo="#041E15"
              imagenBack="/assets/ypf imagenes/back-3.webp"
              mandalaPosition="bottom-left"
              mandalaScale={0.6}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. SECCIÓN INSTAGRAM */}
      <FullInstagramSection posts={initialInstagramPosts} />

      {/* 5. SUSTENTABILIDAD + MAPA */}
      <FullSustentabilidad />

      {/* 6. FOOTER */}
      {renderFooter()}
    </main>
  )
}
