'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
      }}
    >
      {/* Header - Made significantly smaller and more proportionate */}
      <header
        style={{
          paddingTop: 'calc(68px + 16px)',
          paddingBottom: 12,
          textAlign: 'center',
        }}
        className="px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 'clamp(20px, 3.5vw, 30px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: 'white',
          }}
        >
          Menú Completo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: 'clamp(11px, 2vw, 13px)',
            color: 'rgba(255,255,255,0.45)',
            marginTop: 4,
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

      {/* Product Grid - Maximum width optimized for BenQ / large monitors */}
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '16px var(--page-pad-x, 24px) 80px',
        }}
      >
        {/* Result count */}
        <p
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 12,
          }}
        >
          {filtrados.length}{' '}
          {filtrados.length === 1 ? 'producto' : 'productos'}
          {categoriaActiva !== 'todos' || busqueda.trim()
            ? ' encontrados'
            : ' disponibles'}
        </p>

        <AnimatePresence mode="wait">
          {paginados.length > 0 ? (
            <motion.div
              key={`page-${pagina}-${categoriaActiva}-${busqueda}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'grid',
                gap: 12,
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <p
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 14,
                }}
              >
                No encontramos productos con esos filtros.
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
              gap: 16,
              marginTop: 40,
            }}
          >
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 12,
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                cursor: pagina === 1 ? 'not-allowed' : 'pointer',
                background:
                  pagina === 1
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(255,255,255,0.08)',
                color:
                  pagina === 1
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.7)',
                transition: 'all 0.15s',
              }}
            >
              <ChevronLeft size={14} />
              Anterior
            </button>

            <span
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 500,
              }}
            >
              Página {pagina} de {totalPaginas}
            </span>

            <button
              onClick={() =>
                setPagina((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={pagina === totalPaginas}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 12,
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                cursor:
                  pagina === totalPaginas ? 'not-allowed' : 'pointer',
                background:
                  pagina === totalPaginas
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(255,255,255,0.08)',
                color:
                  pagina === totalPaginas
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.7)',
                transition: 'all 0.15s',
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
          background: '#000',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          © YPF El Puente — Río Colorado, Patagonia Argentina
        </p>
      </footer>
    </main>
  )
}
