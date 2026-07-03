'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FullNavbar } from '@/components/public/FullNavbar'
import { CatalogoFiltros } from '@/components/public/CatalogoFiltros'
import { CatalogoProductCard } from '@/components/public/CatalogoProductCard'
import { CartSidebar } from '@/components/public/CartSidebar'
import { MobileBottomBar } from '@/components/public/MobileBottomBar'
import type { Producto } from '@/lib/supabase/types'

interface MenuClientProps {
  initialProductos: Producto[]
}

const ITEMS_POR_PAGINA = 48

export default function MenuClient({ initialProductos }: MenuClientProps) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todos')
  const [soloSinTacc, setSoloSinTacc] = useState(false)
  const [pagina, setPagina] = useState(1)

  // Reset page when any filter changes
  useEffect(() => {
    setPagina(1)
  }, [busqueda, categoriaActiva, soloSinTacc])

  // Chained filtering
  const filtrados = useMemo(() => {
    let result = initialProductos

    if (categoriaActiva !== 'todos') {
      result = result.filter((p) => p.categoria_slug === categoriaActiva)
    }

    if (soloSinTacc) {
      result = result.filter((p) => p.es_sin_tacc)
    }

    if (busqueda.trim()) {
      const q = busqueda
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
      result = result.filter((p) => {
        const nombre = p.nombre
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
        return nombre.includes(q)
      })
    }

    return result
  }, [initialProductos, categoriaActiva, soloSinTacc, busqueda])

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
      <FullNavbar />
      <CartSidebar />
      <MobileBottomBar />

      {/* Header */}
      <header
        style={{
          paddingTop: 'calc(68px + 48px)',
          paddingBottom: 32,
          textAlign: 'center',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
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
            fontSize: 15,
            color: 'rgba(255,255,255,0.45)',
            marginTop: 8,
          }}
        >
          Todos nuestros productos, en un solo lugar
        </motion.p>
      </header>

      {/* Filters */}
      <CatalogoFiltros
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        categoriaActiva={categoriaActiva}
        onCategoria={setCategoriaActiva}
        soloSinTacc={soloSinTacc}
        onSinTacc={setSoloSinTacc}
      />

      {/* Product Grid */}
      <div
        style={{
          maxWidth: 'var(--page-max, 1280px)',
          margin: '0 auto',
          padding: '24px var(--page-pad-x, 24px) 80px',
        }}
      >
        {/* Result count */}
        <p
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 16,
          }}
        >
          {filtrados.length}{' '}
          {filtrados.length === 1 ? 'producto' : 'productos'}
          {categoriaActiva !== 'todos' || soloSinTacc || busqueda.trim()
            ? ' encontrados'
            : ' disponibles'}
        </p>

        <AnimatePresence mode="wait">
          {paginados.length > 0 ? (
            <motion.div
              key={`page-${pagina}-${categoriaActiva}-${soloSinTacc}-${busqueda}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'grid',
                gap: 12,
              }}
              className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
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
                padding: '80px 24px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 15,
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
                padding: '10px 20px',
                borderRadius: 12,
                border: 'none',
                fontSize: 13,
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
              <ChevronLeft size={16} />
              Anterior
            </button>

            <span
              style={{
                fontSize: 13,
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
                padding: '10px 20px',
                borderRadius: 12,
                border: 'none',
                fontSize: 13,
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
              <ChevronRight size={16} />
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
