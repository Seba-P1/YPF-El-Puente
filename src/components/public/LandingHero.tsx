'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  containerVariants,
  itemVariants,
} from '@/lib/utils/public'

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════════════════════════ */

export function LandingHero() {
  const [showScroll, setShowScroll] = useState(true)

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY < 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-hero-gradient"
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
        style={{ paddingTop: 68, maxWidth: 'min(860px, 92vw)' }}
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
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
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
