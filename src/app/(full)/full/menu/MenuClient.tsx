'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, LayoutList, LayoutGrid, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { CatalogoFiltros } from '@/components/public/CatalogoFiltros'
import { CatalogoProductCard } from '@/components/public/CatalogoProductCard'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/format'
import type { Producto } from '@/lib/supabase/types'

interface MenuClientProps {
  initialProductos: Producto[]
}

const INITIAL_BATCH_SIZE = 35

export default function MenuClient({ initialProductos }: MenuClientProps) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todos')
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE)
  const [isCompact, setIsCompact] = useState(false)
  const [showNav, setShowNav] = useState(true)

  // Vista predeterminada: 'lista' (sin tarjetas/imágenes)
  const [modoVista, setModoVista] = useState<'lista' | 'cuadricula'>('lista')

  const lastScrollYRef = React.useRef(0)

  const addItem = useCartStore((state) => state.addItem)

  // Reset visible count when search or category filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE)
  }, [busqueda, categoriaActiva])

  // Chained filtering
  const filtrados = useMemo(() => {
    let result = initialProductos

    if (categoriaActiva !== 'todos' && !busqueda.trim()) {
      if (categoriaActiva === 'sin_tacc') {
        result = result.filter((p) => {
          if (p.es_sin_tacc) return true
          const nameLower = p.nombre.toLowerCase()
          return (
            nameLower.includes('tacc') ||
            nameLower.includes('gluten') ||
            nameLower.includes('s/t') ||
            nameLower.includes('sintac') ||
            nameLower.includes('s.g.')
          )
        })
      } else {
        result = result.filter((p) => p.categoria_slug === categoriaActiva)
      }
    }

    if (busqueda.trim()) {
      const qClean = busqueda
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
      
      const qAlphanumeric = qClean.replace(/[^a-z0-9]/g, '')

      result = result.filter((p) => {
        const nameClean = p.nombre
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
        
        const nameAlphanumeric = nameClean.replace(/[^a-z0-9]/g, '')

        return nameClean.includes(qClean) || nameAlphanumeric.includes(qAlphanumeric)
      })
    }

    return result
  }, [initialProductos, categoriaActiva, busqueda])

  // Products currently loaded in infinite scroll
  const paginados = useMemo(() => {
    return filtrados.slice(0, visibleCount)
  }, [filtrados, visibleCount])

  const hasMore = visibleCount < filtrados.length

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(filtrados.length, prev + INITIAL_BATCH_SIZE))
  }, [filtrados.length])

  // Scroll listener for sticky navbar & infinite scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current

      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setShowNav(false)
        } else {
          setShowNav(true)
        }
      }

      setIsCompact(currentScrollY > 40)
      lastScrollYRef.current = currentScrollY

      // Infinite scroll check: trigger when user scrolls near the bottom (within 450px)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 450
      ) {
        handleLoadMore()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleLoadMore])

  const handleAdd = (producto: Producto) => {
    addItem(producto)
    toast.success(`${producto.nombre} agregado`, { duration: 2000 })
  }

  return (
    <main
      style={{
        background: '#06080F',
        color: 'white',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Subtle ambient glow */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '40vh',
          background: 'radial-gradient(ellipse at center, rgba(0,90,156,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          paddingTop: 'calc(68px + 20px)',
          paddingBottom: 16,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
        className="px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Sparkles size={18} color="#FFD100" style={{ opacity: 0.6 }} />
          <h1
            style={{
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Menú Completo
          </h1>
          <Sparkles size={18} color="#FFD100" style={{ opacity: 0.6 }} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            fontSize: 'clamp(11px, 2vw, 13px)',
            color: 'rgba(255,255,255,0.4)',
            marginTop: 6,
            letterSpacing: '0.02em',
          }}
        >
          Todos nuestros productos, en un solo lugar
        </motion.p>
      </header>

      {/* Filters - Sticky */}
      <CatalogoFiltros
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        categoriaActiva={categoriaActiva}
        onCategoria={setCategoriaActiva}
        isCompact={isCompact}
        visible={showNav}
      />

      {/* Product List / Grid Content */}
      <div
        className="w-full max-w-[1280px] mx-auto px-4 md:px-8"
        style={{
          paddingTop: '20px',
          paddingBottom: '80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Result count & View Switcher */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <p
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {filtrados.length}{' '}
            {filtrados.length === 1 ? 'producto' : 'productos'}
            {categoriaActiva !== 'todos' || busqueda.trim()
              ? ' encontrados'
              : ' disponibles'}
          </p>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setModoVista('lista')}
              title="Vista de Lista"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                modoVista === 'lista'
                  ? 'bg-[#0070C0] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutList size={15} />
              <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              onClick={() => setModoVista('cuadricula')}
              title="Vista de Cuadrícula"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                modoVista === 'cuadricula'
                  ? 'bg-[#0070C0] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Tarjetas</span>
            </button>
          </div>
        </div>

        <h2 className="sr-only">Productos</h2>

        <AnimatePresence mode="wait">
          {paginados.length > 0 ? (
            modoVista === 'lista' ? (
              /* ── LIST VIEW MODE (Frameless, sleek full-width rows with refined typography) ── */
              <motion.div
                key={`list-${categoriaActiva}-${busqueda}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full divide-y divide-white/10 border-t border-b border-white/10"
              >
                {paginados.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between py-3 sm:py-3.5 px-2 hover:bg-white/[0.04] transition-colors group"
                  >
                    {/* Left: Name, Description & Badges */}
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                          {producto.nombre}
                        </span>
                        {producto.descripcion && (
                          <span className="text-[11px] text-slate-400 font-normal line-clamp-1 hidden sm:block mt-0.5">
                            {producto.descripcion}
                          </span>
                        )}
                      </div>

                      {producto.es_sin_tacc && (
                        <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold uppercase">
                          SIN TACC
                        </span>
                      )}
                    </div>

                    {/* Right: Price & Add Button */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-[#FFD100]">
                        {formatearPrecioARS(producto.precio)}
                      </span>
                      <button
                        onClick={() => handleAdd(producto)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 rounded-lg bg-[#0070C0] hover:bg-[#0080FF] text-white text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
                      >
                        <Plus size={13} />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              /* ── GRID VIEW MODE (Cards with Images) ── */
              <motion.div
                key={`grid-${categoriaActiva}-${busqueda}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              >
                {paginados.map((producto) => (
                  <CatalogoProductCard
                    key={producto.id}
                    producto={producto}
                  />
                ))}
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <p
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                No encontramos productos con esos filtros.
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.15)',
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                Probá ajustando la búsqueda o los filtros
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Infinite Scroll Indicator / Manual trigger fallback */}
        {hasMore && (
          <div className="flex flex-col items-center justify-center pt-8 pb-4">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-all cursor-pointer"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD100]" />
              <span>Cargando más productos... ({paginados.length} de {filtrados.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.05em',
          }}
        >
          © YPF El Puente — Río Colorado, Patagonia Argentina
        </p>
      </footer>
    </main>
  )
}
