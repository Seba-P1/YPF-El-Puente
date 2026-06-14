'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Flame,
  Droplets,
  Gauge,
  Thermometer,
  Eye,
  Activity,
  CheckCircle2,
  Car,
  MessageCircle,
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import type { Combustible } from '@/lib/supabase/types'

/* ─── Color fallback logic ─── */
function getCombustibleColor(nombre: string, colorHex: string | null): string {
  if (colorHex && colorHex !== '#005A9C') return colorHex
  const lower = nombre.toLowerCase()
  if (lower.includes('infinia') && !lower.includes('diesel')) return '#9B1C1C'
  if (lower.includes('premium')) return '#9B1C1C'
  if (lower.includes('super') || lower.includes('nafta super')) return '#1D4ED8'
  if (lower.includes('infinia diesel') || lower.includes('diesel')) return '#065F46'
  if (lower.includes('gnc')) return '#5B21B6'
  return '#374151'
}

/* ─── Stagger variants ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

/* ─── CountUp hook ─── */
function useCountUp(target: number, duration: number = 2000, inView: boolean) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!inView || hasRun.current) return
    hasRun.current = true

    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return count
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

interface LandingClientProps {
  combustibles: Combustible[]
}

export function LandingClient({ combustibles }: LandingClientProps) {
  return (
    <div className="flex flex-col w-full" style={{ background: 'var(--bg-base)', marginTop: -68 }}>
      <HeroSection />
      <TickerMarquee />
      <CombustiblesSection combustibles={combustibles} />
      <BoxesSection />
      <CTAMenuSection />
      <FooterSection />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════════════════════════ */

function HeroSection() {
  const [showScroll, setShowScroll] = useState(true)

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY < 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: '100svh',
        background: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,90,156,0.35) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,90,156,0.12) 0%, transparent 60%),
          #06080F
        `,
      }}
    >
      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ paddingTop: 68, maxWidth: 800 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1. Badge */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2"
          style={{
            background: 'rgba(0,90,156,0.15)',
            border: '1px solid rgba(0,90,156,0.4)',
            backdropFilter: 'blur(4px)',
            padding: '6px 16px',
            borderRadius: 999,
            marginBottom: 28,
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4ade80',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: 'rgba(248,250,252,0.7)',
              letterSpacing: '0.08em',
              fontWeight: 500,
            }}
          >
            Río Colorado · Patagonia, Argentina
          </span>
        </motion.div>

        {/* 2. Logo / Brand Mark */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-5">
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.4em',
              color: 'rgba(255,209,0,0.8)',
              textTransform: 'uppercase' as const,
            }}
          >
            YPF
          </span>
          <span
            className="text-[28px] md:text-[36px]"
            style={{
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            EL PUENTE
          </span>
        </motion.div>

        {/* 3. Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-[13px] md:text-[15px] mb-5"
          style={{
            color: 'var(--text-secondary)',
            letterSpacing: '0.12em',
          }}
        >
          Combustibles{' '}
          <span style={{ color: 'rgba(255,209,0,0.6)' }}>·</span>{' '}
          Menú FULL{' '}
          <span style={{ color: 'rgba(255,209,0,0.6)' }}>·</span>{' '}
          Boxes
        </motion.p>

        {/* 4. Description */}
        <motion.p
          variants={itemVariants}
          className="text-[16px] md:text-[18px] mb-10"
          style={{
            color: 'var(--text-secondary)',
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Tu estación de servicio en el corazón de la Patagonia.
        </motion.p>

        {/* 5. CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/full"
            className="group"
            style={{
              height: 52,
              padding: '0 28px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #0070C0, #005A9C)',
              boxShadow: '0 0 0 0 rgba(0,112,192,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,112,192,0.25)'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0,112,192,0.25)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Ver Menú FULL →
          </Link>
          <a
            href="#combustibles"
            style={{
              height: 52,
              padding: '0 28px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            }}
          >
            Combustibles ↓
          </a>
        </motion.div>
      </motion.div>

      {/* 6. Scroll indicator */}
      <motion.div
        className="absolute bottom-10 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showScroll ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="animate-scroll-line"
          style={{
            height: 48,
            width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase' as const,
          }}
        >
          scroll
        </span>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — TICKER MARQUEE
   ═══════════════════════════════════════════════════════════════ */

function TickerMarquee() {
  const text =
    'YPF EL PUENTE  ✦  COMBUSTIBLES DE CALIDAD  ✦  MENÚ FULL  ✦  SERVICIO DE BOXES  ✦  RÍO COLORADO  ✦  PATAGONIA  ✦  '

  return (
    <div
      className="marquee-wrapper"
      style={{
        height: 44,
        overflow: 'hidden',
        position: 'relative',
        background: '#FFD100',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <div
        className="marquee-track flex items-center"
        style={{
          width: 'fit-content',
          height: '100%',
        }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: '#06080F',
              textTransform: 'uppercase' as const,
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — COMBUSTIBLES
   ═══════════════════════════════════════════════════════════════ */

function CombustiblesSection({ combustibles }: { combustibles: Combustible[] }) {
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        style={{
          maxWidth: 1100,
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

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — BOXES
   ═══════════════════════════════════════════════════════════════ */

const SERVICIOS = [
  { icon: Droplets, text: 'Cambio de aceite' },
  { icon: Gauge, text: 'Inflado de neumáticos' },
  { icon: Thermometer, text: 'Agua y refrigerante' },
  { icon: Eye, text: 'Limpieza de parabrisas' },
  { icon: Activity, text: 'Control de presión' },
  { icon: CheckCircle2, text: 'Revisión general' },
]

const BENEFICIOS = [
  'Técnicos certificados YPF',
  'Productos originales garantizados',
  'Servicio rápido, sin turnos',
]

function BoxesSection() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const leftInView = useInView(leftRef, { once: true, margin: '-80px' })
  const rightInView = useInView(rightRef, { once: true, margin: '-80px' })
  const count = useCountUp(420, 2000, rightInView)

  return (
    <section
      style={{
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border)',
      }}
      className="py-[72px] md:py-[100px]"
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}
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
            🔧 BOXES
          </span>

          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 800,
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
            {SERVICIOS.map((s, i) => {
              const Icon = s.icon
              return (
                <div
                  key={i}
                  className="group/item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: i < SERVICIOS.length - 1 ? '1px solid var(--border)' : 'none',
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
                    <Icon style={{ width: 18, height: 18, color: 'var(--ypf-blue-bright)' }} />
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {s.text}
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
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                Boxes YPF
              </span>
            </div>

            {/* Stat */}
            <div className="relative z-10 mb-2">
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: 'var(--ypf-yellow)',
                  lineHeight: 1,
                }}
              >
                +{count}
              </span>
            </div>
            <span
              className="relative z-10"
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                fontWeight: 600,
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

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — CTA MENÚ FULL
   ═══════════════════════════════════════════════════════════════ */

function CTAMenuSection() {
  return (
    <section
      style={{
        background: '#000000',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
      className="py-20 md:py-[120px] px-6"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(44px, 8vw, 88px)',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          }}
        >
          ¿Tenés{' '}
          <span style={{ color: '#FFD100' }}>hambre</span>
          ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 18,
            color: 'var(--text-secondary)',
            marginTop: 16,
          }}
        >
          Hamburguesas, cafetería y exclusivos FULL esperándote.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ marginTop: 40 }}
        >
          <Link
            href="/full"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 60,
              padding: '0 40px',
              borderRadius: 999,
              background: '#FFD100',
              color: '#000000',
              fontSize: 17,
              fontWeight: 800,
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,209,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Ver el Menú FULL →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — FOOTER
   ═══════════════════════════════════════════════════════════════ */

function FooterSection() {
  return (
    <footer
      style={{
        background: '#000000',
        borderTop: '1px solid var(--border)',
        padding: '48px 0 32px',
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}
      >
        {/* Column 1 — Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="relative">
            <Image
              src="/assets/ypf imagenes/logo-modoclaro.png"
              alt="YPF El Puente"
              width={140}
              height={42}
              className="h-9 w-auto object-contain dark:hidden"
            />
            <Image
              src="/assets/ypf imagenes/logo-modooscuro.png"
              alt="YPF El Puente"
              width={140}
              height={42}
              className="h-9 w-auto object-contain hidden dark:block"
            />
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              YPF El Puente
            </span>
            <span
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                marginTop: 4,
              }}
            >
              Río Colorado · Río Negro, Argentina
            </span>
          </div>
        </div>

        {/* Column 2 — Navigation */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <span
            style={{
              fontSize: 11,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            Navegación
          </span>
          {[
            { href: '#combustibles', label: 'Combustibles' },
            { href: '/boxes', label: 'Boxes' },
            { href: '/full', label: 'Menú FULL' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              className="hover:!text-[#F8FAFC]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Column 3 — Contact */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <span
            style={{
              fontSize: 11,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            Contacto
          </span>
          <a
            href="https://wa.me/5492920000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:!text-[#F8FAFC]"
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            <MessageCircle style={{ width: 16, height: 16 }} />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom line */}
      <div
        style={{
          maxWidth: 1100,
          margin: '32px auto 0',
          padding: '24px 24px 0',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--text-muted)',
        }}
      >
        © {new Date().getFullYear()} AXPE Soluciones Digitales
      </div>
    </footer>
  )
}
