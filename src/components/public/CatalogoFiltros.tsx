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
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        background: 'rgba(6,8,15,0.75)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        transform: visible ? 'translateY(0)' : 'translateY(-220px)',
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.3s, padding 0.3s',
        padding: isCompact ? '8px 0' : '12px 0',
      }}
    >
      <div
        className="w-full max-w-[1280px] mx-auto px-4 md:px-6"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isCompact ? 8 : 10,
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, rgba(26,29,39,0.8) 0%, rgba(20,23,33,0.9) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 9999,
            padding: isCompact ? '0 14px' : '0 16px',
            height: isCompact ? 36 : 40,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
            transition: 'height 0.2s, padding 0.2s, border-color 0.2s',
          }}
          className="focus-within:border-[rgba(255,209,0,0.3)]"
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
              letterSpacing: '0.01em',
            }}
          />
          {busqueda && (
            <button
              onClick={() => onBusqueda('')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 12,
                cursor: 'pointer',
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              ✕
            </button>
          )}
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
                  gap: 4,
                  padding: isCompact ? '5px 12px' : '6px 14px',
                  borderRadius: 9999,
                  fontSize: isCompact ? 11 : 12,
                  fontWeight: isActive ? 700 : 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(255,209,0,0.2) 0%, rgba(255,165,0,0.15) 100%)'
                    : 'rgba(26,29,39,0.6)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: isActive ? '#FFD100' : 'rgba(255,255,255,0.65)',
                  border: isActive
                    ? '1px solid rgba(255,209,0,0.4)'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isActive
                    ? '0 4px 12px rgba(255,209,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                {emoji && <span style={{ fontSize: isCompact ? 11 : 13 }}>{emoji}</span>}
                {label}
              </button>
            )
          })}

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', flexShrink: 0, marginLeft: 4, marginRight: 4 }} />

          {/* Sin TACC toggle */}
          <button
            onClick={() => onCategoria(categoriaActiva === 'sin_tacc' ? 'todos' : 'sin_tacc')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: isCompact ? '5px 12px' : '6px 14px',
              borderRadius: 9999,
              fontSize: isCompact ? 11 : 12,
              fontWeight: categoriaActiva === 'sin_tacc' ? 700 : 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: categoriaActiva === 'sin_tacc'
                ? 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(22,163,74,0.15) 100%)'
                : 'rgba(26,29,39,0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: categoriaActiva === 'sin_tacc' ? '#22c55e' : 'rgba(255,255,255,0.65)',
              border: categoriaActiva === 'sin_tacc'
                ? '1px solid rgba(34,197,94,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
              boxShadow: categoriaActiva === 'sin_tacc'
                ? '0 4px 12px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            <Wheat size={isCompact ? 12 : 14} />
            Sin TACC
          </button>
        </div>
      </div>
    </div>
  )
}
