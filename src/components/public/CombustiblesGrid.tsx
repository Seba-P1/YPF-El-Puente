'use client'

import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Combustible } from '@/lib/supabase/types'
import { getCombustibleColor } from '@/lib/utils/public'

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — COMBUSTIBLES
   ═══════════════════════════════════════════════════════════════ */

interface CombustiblesGridProps {
  combustibles: Combustible[]
}

export function CombustiblesGrid({ combustibles }: CombustiblesGridProps) {
  return (
    <section
      id="combustibles"
      style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border)',
      }}
      className="py-[72px] md:py-[100px]"
    >
      {/* Header */}
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', marginBottom: 64, padding: '0 24px' }}>
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--ypf-yellow-muted)',
            border: '1px solid rgba(255,209,0,0.3)',
            color: 'var(--ypf-yellow)',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.15em',
            padding: '5px 14px',
            borderRadius: 999,
          }}
        >
          ⛽ COMBUSTIBLES
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginTop: 12,
          }}
        >
          Calidad certificada YPF
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            marginTop: 8,
          }}
        >
          Todos los días, a los mejores precios
        </motion.p>
      </div>

      {/* Cards grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-7"
        style={{
          maxWidth: 'min(1280px, 92vw)',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {combustibles.length > 0 ? (
          combustibles.map((c, index) => {
            const color = getCombustibleColor(c.nombre, c.color_hex)
            return (
              <CombustibleCard
                key={c.id}
                combustible={c}
                color={color}
                index={index}
              />
            )
          })
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', gridColumn: '1 / -1', textAlign: 'center' }}>
            Precios no disponibles temporalmente.
          </p>
        )}
      </div>
    </section>
  )
}

/* ─── CombustibleCard ─── */

function CombustibleCard({
  combustible,
  color,
  index,
}: {
  combustible: Combustible
  color: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
      }}
      whileHover={{
        y: -4,
        borderColor: 'rgba(0,112,192,0.5)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,112,192,0.2)',
      }}
    >
      {/* Color strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: color,
          borderRadius: '22px 22px 0 0',
        }}
      />

      {/* Octanaje decorative number */}
      {combustible.octanaje && (
        <span
          style={{
            position: 'absolute',
            top: 16,
            right: 20,
            fontSize: 48,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.04)',
            letterSpacing: '-0.04em',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 1,
          }}
        >
          {combustible.octanaje.replace(/[^0-9]/g, '')}
        </span>
      )}

      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-sm)',
          background: `${color}1A`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Flame style={{ width: 20, height: 20, color }} />
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginTop: 12,
        }}
      >
        {combustible.nombre}
      </h3>

      {/* Octanaje badge */}
      {combustible.octanaje && (
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginTop: 4,
          }}
        >
          {combustible.octanaje}
        </span>
      )}

      {/* Price */}
      <div style={{ marginTop: 16 }}>
        {!combustible.precio || combustible.precio === 0 ? (
          <span
            style={{
              fontSize: 18,
              fontStyle: 'italic',
              color: 'var(--text-muted)',
            }}
          >
            Consultanos
          </span>
        ) : (
          <div className="flex items-baseline gap-0.5">
            <span style={{ fontSize: 16, color: 'var(--ypf-yellow)' }}>$</span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--ypf-yellow)',
                lineHeight: 1,
              }}
            >
              {combustible.precio.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: 16, color: 'var(--ypf-yellow)', opacity: 0.7, marginLeft: 2 }}>/L</span>
          </div>
        )}
      </div>

      {/* Description */}
      {combustible.descripcion && (
        <p
          className="line-clamp-2"
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginTop: 8,
          }}
        >
          {combustible.descripcion}
        </p>
      )}
    </motion.div>
  )
}
