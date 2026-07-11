'use client'

import React from 'react'
import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Combustible } from '@/lib/supabase/types'
import { getCombustibleColor } from '@/lib/utils/public'

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — COMBUSTIBLES (PREMIUM REDESIGN)
   ═══════════════════════════════════════════════════════════════ */

interface CombustiblesGridProps {
  combustibles: Combustible[]
}

export function CombustiblesGrid({ combustibles }: CombustiblesGridProps) {
  return (
    <section
      id="combustibles"
      style={{
        background: 'linear-gradient(to bottom, #06080F 0%, #090D1A 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="py-[60px] md:py-[88px]"
    >
      {/* Background ambient light */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          height: '40vh',
          background: 'radial-gradient(ellipse at center, rgba(0, 112, 192, 0.04) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div 
        style={{ 
          maxWidth: 680, 
          margin: '0 auto', 
          textAlign: 'center', 
          marginBottom: 44, 
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,112,192,0.08)',
            border: '1px solid rgba(0,112,192,0.25)',
            color: '#0080FF',
            fontSize: 10,
            fontWeight: 800,
            fontFamily: 'var(--font-din-medium), sans-serif',
            letterSpacing: '0.18em',
            padding: '5px 16px',
            borderRadius: 999,
          }}
        >
          ⛽ TECNOLOGÍA EN RUTA
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(26px, 3.5vw, 42px)',
            fontWeight: 900,
            fontFamily: 'var(--font-din-medium), sans-serif',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginTop: 12,
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Calidad Certificada YPF
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.45)',
            marginTop: 8,
            maxWidth: 480,
            margin: '8px auto 0',
          }}
        >
          Fórmulas de máxima performance para el cuidado de tu motor
        </motion.p>
      </div>

      {/* Cards grid - Optimized height for notebook viewports */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 xl:gap-8"
        style={{
          maxWidth: 'min(1200px, 92vw)',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
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
          <p style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
            Precios no disponibles temporalmente.
          </p>
        )}
      </div>
    </section>
  )
}

/* ─── CombustibleCard — PREMIUM INTERACTIVE ─── */

function CombustibleCard({
  combustible,
  color,
  index,
}: {
  combustible: Combustible
  color: string
  index: number
}) {
  const isDiesel = combustible.nombre.toLowerCase().includes('diesel') || combustible.nombre.toLowerCase().includes('d5')
  const isInfinia = combustible.nombre.toLowerCase().includes('infinia')

  // Generate a customized glow color based on the actual brand fuel color
  const glowShadow = `0 12px 36px rgba(${
    isInfinia ? '0,112,192' : isDiesel ? '34,197,94' : '234,88,12'
  }, 0.15)`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(20,24,38,0.7) 0%, rgba(13,17,28,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: '24px 28px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
      }}
      whileHover={{
        y: -4,
        borderColor: `${color}4D`, // 30% opacity of actual color
        boxShadow: `${glowShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
      }}
    >
      {/* Top fluid colored light strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}CC, ${color}33)`,
        }}
      />

      {/* Futuristic fluid tech lines SVG background */}
      <div
        style={{
          position: 'absolute',
          right: -10,
          bottom: -20,
          width: '70%',
          height: '80%',
          opacity: 0.04,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        className="group-hover:opacity-8 transition-opacity duration-300"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <path d="M0,50 Q25,30 50,50 T100,50" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M0,60 Q25,45 50,60 T100,60" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M0,40 Q25,15 50,40 T100,40" stroke="#FFFFFF" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Giant high-tech octanaje watermark */}
      {combustible.octanaje && (
        <span
          style={{
            position: 'absolute',
            top: 14,
            right: 24,
            fontSize: 54,
            fontWeight: 900,
            fontFamily: 'var(--font-din-medium), sans-serif',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.05em',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          {combustible.octanaje.replace(/[^0-9]/g, '')}
        </span>
      )}

      {/* Icon with glow background */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `radial-gradient(circle, ${color}1C 0%, ${color}0A 100%)`,
          border: `1px solid ${color}2B`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Flame style={{ width: 22, height: 22, color }} />
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: 22,
          fontWeight: 900,
          fontFamily: 'var(--font-din-medium), sans-serif',
          color: '#FFFFFF',
          marginTop: 16,
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {combustible.nombre}
      </h3>

      {/* Octanaje badge */}
      {combustible.octanaje && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'var(--font-din-medium), sans-serif',
            color: 'rgba(255,255,255,0.6)',
            marginTop: 6,
            letterSpacing: '0.02em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {combustible.octanaje}
        </span>
      )}

      {/* Price with interactive scaling */}
      <div 
        style={{ 
          marginTop: 20,
          position: 'relative',
          zIndex: 1,
          display: 'inline-block',
        }}
      >
        {!combustible.precio || combustible.precio === 0 ? (
          <span
            style={{
              fontSize: 18,
              fontStyle: 'italic',
              fontFamily: 'var(--font-din-medium), sans-serif',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            Consultanos
          </span>
        ) : (
          <div 
            className="flex items-baseline gap-0.5 transition-transform duration-300 group-hover:scale-[1.03]" 
            style={{ 
              fontFamily: 'var(--font-din-medium), sans-serif',
            }}
          >
            <span style={{ fontSize: 16, color: '#FFD100', fontWeight: 700 }}>$</span>
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: '#FFD100',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textShadow: '0 2px 12px rgba(255,209,0,0.15)',
              }}
            >
              {combustible.precio.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: 16, color: '#FFD100', opacity: 0.7, marginLeft: 2, fontWeight: 700 }}>/L</span>
          </div>
        )}
      </div>

      {/* Description */}
      {combustible.descripcion && (
        <p
          className="line-clamp-2"
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.5,
            marginTop: 10,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {combustible.descripcion}
        </p>
      )}
    </motion.div>
  )
}
