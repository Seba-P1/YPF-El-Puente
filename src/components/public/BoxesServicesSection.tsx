'use client'

import { useRef } from 'react'
import {
  Car,
  Droplets,
  Gauge,
  Thermometer,
  Eye,
  Activity,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import type { BoxService } from '@/lib/supabase/types'

/* ─── Icon slug → Lucide component map ─── */
const ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Gauge,
  Thermometer,
  Eye,
  Activity,
  CheckCircle2,
  Car,
}

/* ─── Hardcoded benefits (not from DB) ─── */
const BENEFICIOS = [
  'Técnicos certificados YPF',
  'Productos originales garantizados',
  'Servicio rápido, sin turnos',
]

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — BOXES
   ═══════════════════════════════════════════════════════════════ */

interface BoxesServicesSectionProps {
  servicios: BoxService[]
}

export function BoxesServicesSection({ servicios }: BoxesServicesSectionProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const leftInView = useInView(leftRef, { once: true, margin: '-80px' })
  const rightInView = useInView(rightRef, { once: true, margin: '-80px' })
  const count = useCountUp(420, 2000, rightInView)

  return (
    <section
      id="boxes"
      style={{
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border)',
      }}
      className="py-[72px] md:py-[100px]"
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 w-full max-w-[1280px] mx-auto px-6"
      >
        {/* Left column — text */}
        <motion.div
          ref={leftRef}
          className="lg:col-span-5"
          initial={{ opacity: 0, x: -30 }}
          animate={leftInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(0,90,156,0.1)',
              border: '1px solid rgba(0,112,192,0.3)',
              color: '#0070C0',
              fontSize: 11,
              fontWeight: 800,
              fontFamily: 'var(--font-din-medium), sans-serif',
              letterSpacing: '0.15em',
              padding: '5px 14px',
              borderRadius: 999,
            }}
          >
            🔧 BOXES
          </span>

          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 900,
              fontFamily: 'var(--font-din-medium), sans-serif',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginTop: 12,
            }}
          >
            Tu vehículo en las mejores manos.
          </h2>

          <p
            style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginTop: 16,
            }}
          >
            Servicio completo de lubricación y mantenimiento en Río Colorado.
            Rapidez, confianza y tecnología YPF.
          </p>

          {/* Construction notice banner */}
          <div
            style={{
              marginTop: 32,
              padding: '24px 28px',
              background: 'linear-gradient(135deg, rgba(255,209,0,0.06) 0%, rgba(255,209,0,0.02) 100%)',
              border: '1px dashed rgba(255,209,0,0.3)',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  fontFamily: 'var(--font-din-medium), sans-serif',
                  color: '#FFD100',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Sitio en Construcción
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              Pronto la mejor atención. Estamos terminando el desarrollo de la sección de Boxes de lubricación y mantenimiento rápido.
            </p>
          </div>
        </motion.div>

        {/* Right column — visual panel */}
        <motion.div
          ref={rightRef}
          className="lg:col-span-7"
          initial={{ opacity: 0, x: 30 }}
          animate={rightInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px 32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative glow */}
            <div
              style={{
                position: 'absolute',
                right: -60,
                bottom: -60,
                width: 280,
                height: 280,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,90,156,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 mb-8">
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: 'rgba(0,90,156,0.2)',
                  border: '1px solid rgba(0,90,156,0.3)',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Car style={{ width: 28, height: 28, color: 'var(--ypf-blue-bright)' }} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-din-medium), sans-serif', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Boxes YPF
              </span>
            </div>

            {/* Stat */}
            <div className="relative z-10 mb-2">
              <span
                style={{
                  fontSize: 68,
                  fontWeight: 900,
                  fontFamily: 'var(--font-din-medium), sans-serif',
                  color: 'var(--ypf-yellow)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                +{count}
              </span>
            </div>
            <span
              className="relative z-10"
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.12em',
                fontWeight: 700,
                fontFamily: 'var(--font-din-medium), sans-serif',
              }}
            >
              YPF BOXES en Argentina
            </span>

            {/* Separator */}
            <div
              className="relative z-10"
              style={{
                height: 1,
                background: 'var(--border)',
                margin: '24px 0',
              }}
            />

            {/* Benefits */}
            <div className="relative z-10 flex flex-col gap-3">
              {BENEFICIOS.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2
                    style={{ width: 16, height: 16, color: 'var(--ypf-yellow)', flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
