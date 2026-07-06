'use client'

import React from 'react'
import { Search, Wheat } from 'lucide-react'

interface CatalogoFiltrosProps {
  busqueda: string
  onBusqueda: (value: string) => void
  categoriaActiva: string
  onCategoria: (slug: string) => void
  isCompact: boolean
  visible: boolean
}

const CATEGORIAS_PILLS = [
  { slug: 'todos', label: 'Todos', emoji: '' },
  { slug: 'comidas_calientes', label: 'Comidas Calientes', emoji: '🔥' },
  { slug: 'comidas_frias', label: 'Comidas Frías', emoji: '🥗' },
  { slug: 'cafeteria', label: 'Cafetería', emoji: '☕' },
  { slug: 'panaderia', label: 'Panadería', emoji: '🥐' },
  { slug: 'combos', label: 'Combos', emoji: '📦' },
  { slug: 'marca_full', label: 'Marca Full', emoji: '⭐' },
]

export function CatalogoFiltros({
  busqueda,
  onBusqueda,
  categoriaActiva,
  onCategoria,
  isCompact,
  visible,
}: CatalogoFiltrosProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: isCompact ? 54 : 68,
        zIndex: 30,
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        background: 'transparent',
        borderBottom: 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-220px)',
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.3s, padding 0.3s',
        padding: isCompact ? '6px 0' : '12px 0',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--page-max, 1280px)',
          margin: '0 auto',
          padding: '0 var(--page-pad-x, 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: isCompact ? 6 : 10,
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(26,29,39,0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 9999,
            padding: isCompact ? '0 12px' : '0 14px',
            height: isCompact ? 34 : 38,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            transition: 'height 0.2s, padding 0.2s',
          }}
        >
          <Search size={isCompact ? 14 : 16} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar en el menú..."
            value={busqueda}
            onChange={(e) => onBusqueda(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: isCompact ? 12 : 13,
              outline: 'none',
            }}
          />
        </div>

        {/* Category pills + Sin TACC toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 2,
          }}
          className="hide-scrollbar"
        >
          {CATEGORIAS_PILLS.map(({ slug, label, emoji }) => {
            const isActive = categoriaActiva === slug
            return (
              <button
                key={slug}
                onClick={() => onCategoria(slug)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: isCompact ? '4px 10px' : '5px 12px',
                  borderRadius: 9999,
                  fontSize: isCompact ? 11 : 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: isActive
                    ? 'rgba(255,209,0,0.22)'
                    : 'rgba(26,29,39,0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: isActive ? '#FFD100' : 'rgba(255,255,255,0.7)',
                  border: isActive
                    ? '1px solid rgba(255,209,0,0.45)'
                    : '1px solid rgba(255,255,255,0.12)',
                  boxShadow: isActive
                    ? '0 4px 10px rgba(255,209,0,0.15), 0 2px 4px rgba(0,0,0,0.3)'
                    : '0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {emoji && <span style={{ fontSize: isCompact ? 10 : 12 }}>{emoji}</span>}
                {label}
              </button>
            )
          })}

          {/* Sin TACC toggle */}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', flexShrink: 0, marginLeft: 2, marginRight: 2 }} />
          <button
            onClick={() => onCategoria(categoriaActiva === 'sin_tacc' ? 'todos' : 'sin_tacc')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: isCompact ? '4px 10px' : '5px 12px',
              borderRadius: 9999,
              fontSize: isCompact ? 11 : 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: categoriaActiva === 'sin_tacc'
                ? 'rgba(255,209,0,0.22)'
                : 'rgba(26,29,39,0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: categoriaActiva === 'sin_tacc' ? '#FFD100' : 'rgba(255,255,255,0.7)',
              border: categoriaActiva === 'sin_tacc'
                ? '1px solid rgba(255,209,0,0.45)'
                : '1px solid rgba(255,255,255,0.12)',
              boxShadow: categoriaActiva === 'sin_tacc'
                ? '0 4px 10px rgba(255,209,0,0.15), 0 2px 4px rgba(0,0,0,0.3)'
                : '0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <Wheat size={isCompact ? 11 : 13} />
            Sin TACC
          </button>
        </div>
      </div>
    </div>
  )
}
