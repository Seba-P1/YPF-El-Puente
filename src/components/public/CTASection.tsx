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
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(44px, 6vw, 96px)',
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
