'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — CTA MENÚ FULL
   ═══════════════════════════════════════════════════════════════ */

export function CTASection() {
  return (
    <section
      style={{
        background: '#000000',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
      className="py-20 md:py-[120px] px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(18px, 3.8vw, 54px)',
            fontWeight: 900,
            fontFamily: 'var(--font-din-medium), sans-serif',
            color: 'white',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
          className="w-full text-center whitespace-nowrap overflow-visible"
        >
          ¿Querés ver nuestros{' '}
          <span style={{ color: '#FFD100' }}>productos</span>
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
              height: 56,
              padding: '0 40px',
              borderRadius: 9999,
              background: '#FFD100',
              color: '#000000',
              fontSize: 15,
              fontWeight: 800,
              fontFamily: 'var(--font-din-medium), sans-serif',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 20px rgba(255,209,0,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Ver Menú FULL →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
