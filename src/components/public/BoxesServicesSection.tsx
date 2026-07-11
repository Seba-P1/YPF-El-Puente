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
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
        style={{ maxWidth: 'min(1280px, 92vw)', margin: '0 auto', padding: '0 24px' }}
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

          {/* Services list */}
          <div style={{ marginTop: 28 }}>
            {servicios.map((s, i) => {
              const IconComponent = ICON_MAP[s.icono_slug] ?? ICON_MAP.Car
              return (
                <div
                  key={s.id}
                  className="group/item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: i < servicios.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: 'rgba(0,90,156,0.15)',
                      border: '1px solid rgba(0,90,156,0.25)',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent style={{ width: 18, height: 18, color: 'var(--ypf-blue-bright)' }} />
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: 'var(--font-din-medium), sans-serif',
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {s.nombre}
                  </span>
                </div>
              )
            })}
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
