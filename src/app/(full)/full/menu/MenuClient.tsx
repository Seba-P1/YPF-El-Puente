'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { CatalogoFiltros } from '@/components/public/CatalogoFiltros'
import { CatalogoProductCard } from '@/components/public/CatalogoProductCard'

import type { Producto } from '@/lib/supabase/types'

interface MenuClientProps {
  initialProductos: Producto[]
}

const ITEMS_POR_PAGINA = 48

export default function MenuClient({ initialProductos }: MenuClientProps) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todos')
  const [pagina, setPagina] = useState(1)
  const [isCompact, setIsCompact] = useState(false)
  const [showNav, setShowNav] = useState(true)

  const lastScrollYRef = React.useRef(0)

  // Scroll listener to detect direction and set compact mode
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current

      // Only trigger hide/show if scrolled past a small threshold
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling down - hide
          setShowNav(false)
        } else {
          // Scrolling up - show
          setShowNav(true)
        }
      }

      setIsCompact(currentScrollY > 40)
      lastScrollYRef.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reset page when any filter changes
  useEffect(() => {
    setPagina(1)
  }, [busqueda, categoriaActiva])

  // Chained filtering
  const filtrados = useMemo(() => {
    let result = initialProductos

    // Bypass category filter when search query is active (search globally)
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

  // Pagination
  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA)
  const paginados = filtrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  )

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

      {/* Filters - Sticky with compact mode toggle */}
      <CatalogoFiltros
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        categoriaActiva={categoriaActiva}
        onCategoria={setCategoriaActiva}
        isCompact={isCompact}
        visible={showNav}
      />

      {/* Product Grid */}
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '20px var(--page-pad-x, 24px) 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Result count with subtle style */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {filtrados.length}{' '}
            {filtrados.length === 1 ? 'producto' : 'productos'}
            {categoriaActiva !== 'todos' || busqueda.trim()
              ? ' encontrados'
              : ' disponibles'}
          </p>
          {/* Page indicator when paginated */}
          {totalPaginas > 1 && (
            <p
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.25)',
                fontWeight: 500,
              }}
            >
              Página {pagina}/{totalPaginas}
            </p>
          )}
        </div>

        <h2 className="sr-only">Productos</h2>

        <AnimatePresence mode="wait">
          {paginados.length > 0 ? (
            <motion.div
              key={`page-${pagina}-${categoriaActiva}-${busqueda}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'grid',
                gap: 14,
              }}
              className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-9"
            >
              {paginados.map((producto) => (
                <CatalogoProductCard
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </motion.div>
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

        {/* Pagination */}
        {totalPaginas > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginTop: 48,
            }}
          >
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12,
                fontWeight: 600,
                cursor: pagina === 1 ? 'not-allowed' : 'pointer',
                background:
                  pagina === 1
                    ? 'rgba(255,255,255,0.02)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
                color:
                  pagina === 1
                    ? 'rgba(255,255,255,0.15)'
                    : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
            >
              <ChevronLeft size={14} />
              Anterior
            </button>

            {/* Page dots */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {Array.from({ length: Math.min(totalPaginas, 7) }, (_, i) => {
                let pageNum: number
                if (totalPaginas <= 7) {
                  pageNum = i + 1
                } else if (pagina <= 4) {
                  pageNum = i + 1
                } else if (pagina >= totalPaginas - 3) {
                  pageNum = totalPaginas - 6 + i
                } else {
                  pageNum = pagina - 3 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagina(pageNum)}
                    style={{
                      width: pageNum === pagina ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      background:
                        pageNum === pagina
                          ? 'linear-gradient(135deg, #FFD100 0%, #FFA500 100%)'
                          : 'rgba(255,255,255,0.12)',
                    }}
                  />
                )
              })}
            </div>

            <button
              onClick={() =>
                setPagina((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={pagina === totalPaginas}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12,
                fontWeight: 600,
                cursor:
                  pagina === totalPaginas ? 'not-allowed' : 'pointer',
                background:
                  pagina === totalPaginas
                    ? 'rgba(255,255,255,0.02)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
                color:
                  pagina === totalPaginas
                    ? 'rgba(255,255,255,0.15)'
                    : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
            >
              Siguiente
              <ChevronRight size={14} />
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
