'use client'

import Link from 'next/link'
import Image from 'next/image'
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
      className="py-20 md:py-32 px-6"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4 w-full">
        {/* Logo Circular Full Blanco */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-10 md:mb-14"
        >
          <Image
            src="/assets/ypf imagenes/logo-circular-full-blanco.png"
            alt="Full YPF"
            fill
            sizes="192px"
            className="object-contain"
          />
        </motion.div>

        {/* Text Image + Arrow Container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative flex flex-col items-center w-full max-w-[420px]"
        >
          <div className="relative flex items-center justify-center w-full">
            <div className="relative w-[220px] sm:w-[260px] md:w-[300px] aspect-[2.6/1]">
              <Image
                src="/assets/ypf imagenes/full-mira-todo-lo-que-tenemos.png"
                alt="Mirá todo lo que tenemos para vos"
                fill
                sizes="(max-width: 768px) 320px, 360px"
                className="object-contain"
              />
            </div>
            {/* Flecha abajo al costado */}
            <div className="absolute -right-8 sm:-right-12 md:-right-14 -bottom-2 w-10 h-16 sm:w-12 sm:h-20 md:w-14 md:h-24">
              <Image
                src="/assets/ypf imagenes/flecha-abajo.png"
                alt="Flecha"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Button VER MENÚ FULL */}
          <div className="mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/full"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 54,
                padding: '0 40px',
                borderRadius: 9999,
                background: 'rgb(144, 128, 112)',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 800,
                fontFamily: 'var(--font-din-medium), sans-serif',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 20px rgba(144,128,112,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              VER MENÚ FULL
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
