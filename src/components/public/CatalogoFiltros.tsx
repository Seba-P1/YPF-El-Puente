'use client'

import React from 'react'
import { Search, Wheat } from 'lucide-react'

interface CatalogoFiltrosProps {
  busqueda: string
  onBusqueda: (value: string) => void
  categoriaActiva: string
  onCategoria: (slug: string) => void
  soloSinTacc: boolean
  onSinTacc: (value: boolean) => void
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
  soloSinTacc,
  onSinTacc,
}: CatalogoFiltrosProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 68,
        zIndex: 30,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '16px 0',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--page-max, 1280px)',
          margin: '0 auto',
          padding: '0 var(--page-pad-x, 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 9999,
            padding: '0 16px',
            height: 44,
          }}
        >
          <Search size={18} color="rgba(255,255,255,0.35)" />
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
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        {/* Category pills + Sin TACC toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
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
                  gap: 4,
                  padding: '6px 14px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: isActive
                    ? 'rgba(255,209,0,0.15)'
                    : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#FFD100' : 'rgba(255,255,255,0.55)',
                  ...(isActive
                    ? { boxShadow: 'inset 0 0 0 1px rgba(255,209,0,0.35)' }
                    : {}),
                }}
              >
                {emoji && <span>{emoji}</span>}
                {label}
              </button>
            )
          })}

          {/* Sin TACC toggle */}
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.10)', flexShrink: 0, marginLeft: 4, marginRight: 4 }} />
          <button
            onClick={() => onSinTacc(!soloSinTacc)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 14px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: soloSinTacc
                ? 'rgba(34,197,94,0.15)'
                : 'rgba(255,255,255,0.06)',
              color: soloSinTacc ? '#22c55e' : 'rgba(255,255,255,0.55)',
              ...(soloSinTacc
                ? { boxShadow: 'inset 0 0 0 1px rgba(34,197,94,0.4)' }
                : {}),
            }}
          >
            <Wheat size={14} />
            Sin TACC
          </button>
        </div>
      </div>
    </div>
  )
}
