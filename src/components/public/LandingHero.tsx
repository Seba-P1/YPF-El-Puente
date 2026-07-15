'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  containerVariants,
  itemVariants,
} from '@/lib/utils/public'

export function LandingHero() {
  const [showScroll, setShowScroll] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScroll(window.scrollY < 100)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', motionListener)

    const mobileQuery = window.matchMedia('(max-width: 768px)')
    setIsMobile(mobileQuery.matches)
    const mobileListener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mobileQuery.addEventListener('change', mobileListener)

    return () => {
      motionQuery.removeEventListener('change', motionListener)
      mobileQuery.removeEventListener('change', mobileListener)
    }
  }, [])

  const videoSources = isMobile
    ? { webm: '/assets/hero/hero-video-mobile.webm', mp4: '/assets/hero/hero-video-mobile.mp4', poster: '/assets/hero/hero-poster-mobile.jpg' }
    : { webm: '/assets/hero/hero-video.webm', mp4: '/assets/hero/hero-video.mp4', poster: '/assets/hero/hero-poster.jpg' }

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{
        background: '#000000',
      }}
    >
      {/* Background Video */}
      {!prefersReducedMotion && (
        <video
          key={isMobile ? 'mobile' : 'desktop'}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={videoSources.poster}
          onPlay={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <source src={videoSources.webm} type="video/webm" />
          <source src={videoSources.mp4} type="video/mp4" />
        </video>
      )}

      {/* Fallback image when prefers reduced motion is enabled */}
      {prefersReducedMotion && (
        <Image
          src={videoSources.poster}
          alt="Hero background"
          fill
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60"
          preload={true}
        />
      )}
      {/* Grid lines overlay (YPF technical engineering vibe) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.5,
        }}
      />

      {/* Cyberpunk radial energy beam in center */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '80vw',
          height: '40vh',
          top: '20%',
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.08) 0%, transparent 65%)',
          filter: 'blur(40px)',
          zIndex: 1,
        }}
      />

      {/* Diagonal corporate brand stripe (official YPF language) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '180%',
          height: '220px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 209, 0, 0.015) 50%, transparent 100%)',
          transform: 'rotate(-12deg) translateY(-80px)',
          zIndex: 1,
        }}
      />

      {/* Wrapper to align left and occupy full width in BenQ/ultra-wide screens */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col justify-between items-center md:items-start min-h-[calc(100vh-80px)] mt-[80px]">
        {/* Content Top: Badge and Title (cercano al header) */}
        <motion.div
          className="relative flex flex-col items-center md:items-start text-center md:text-left pt-4 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. Badge Location */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2.5"
            style={{
              background: 'rgba(0,112,192,0.1)',
              border: '1px solid rgba(0,112,192,0.3)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '6px 18px',
              borderRadius: 999,
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <span
              className="animate-pulse-dot"
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#22c55e',
                flexShrink: 0,
                boxShadow: '0 0 8px #22c55e',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-din-medium), sans-serif',
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.8)',
                letterSpacing: '0.12em',
                fontWeight: 500,
              }}
            >
              RÍO COLORADO · PATAGONIA, ARGENTINA
            </span>
          </motion.div>

          {/* 2. Brand Identity Block */}
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
            <h1
              style={{
                fontFamily: 'var(--font-din-medium), sans-serif',
                textTransform: 'uppercase',
              }}
              className="text-center md:text-left"
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: '0.45em',
                  color: '#FFD100',
                  textShadow: '0 2px 10px rgba(255,209,0,0.2)',
                  marginBottom: 8,
                }}
              >
                YPF
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(38px, 6.5vw, 76px)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.98,
                }}
              >
                EL PUENTE
              </span>
            </h1>
          </motion.div>
        </motion.div>

        {/* Content Center: Tagline, Description, CTA Buttons (en el centro de la pantalla) */}
        <motion.div
          className="relative flex flex-col items-center md:items-start text-center md:text-left my-auto py-8 w-full"
          style={{ maxWidth: 'min(780px, 92vw)' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 3. Section Taglines */}
          <motion.p
            variants={itemVariants}
            className="text-[12px] md:text-[14px] mb-6"
            style={{
              fontFamily: 'var(--font-din-medium), sans-serif',
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Combustibles{' '}
            <span style={{ color: '#FFD100', opacity: 0.8 }}>/</span>{' '}
            Full{' '}
            <span style={{ color: '#FFD100', opacity: 0.8 }}>/</span>{' '}
            Boxes
          </motion.p>

          {/* 4. Description */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: 'rgba(255, 255, 255, 0.72)',
              maxWidth: 580,
              lineHeight: 1.6,
              marginBottom: 36,
              fontWeight: 400,
            }}
          >
            Una parada estratégica en tu viaje. Tecnología de combustibles premium, servicio de lubricación experta y el mejor café de la Patagonia.
          </motion.p>

          {/* 5. CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/full"
              style={{
                height: 54,
                padding: '0 24px',
                borderRadius: 9999,
                background: 'linear-gradient(135deg, #0070C0 0%, #005A9C 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,112,192,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-din-medium), sans-serif',
                fontSize: 14,
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
              className="hover:shadow-[0_8px_32px_rgba(0,112,192,0.5)] hover:scale-[1.02] active:scale-95 w-[220px]"
            >
              FULL
            </Link>
            <a
              href="#combustibles"
              style={{
                height: 54,
                padding: '0 24px',
                borderRadius: 9999,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-din-medium), sans-serif',
                fontSize: 13,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
              className="hover:bg-white/10 hover:border-white/20 active:scale-95 w-[220px]"
            >
              Ver Combustibles
            </a>
          </motion.div>
        </motion.div>

        {/* Spacer at the bottom to balance the top area and allow perfect my-auto centering */}
        <div className="h-[60px] md:h-[80px] w-full pointer-events-none flex-shrink-0" />
      </div>

      {/* 6. Scroll indicator */}
      <motion.div
        className="absolute bottom-10 hidden md:flex flex-col items-center gap-2.5"
        style={{
          left: '50%',
        }}
        initial={{ opacity: 0, x: '-50%' }}
        animate={{ opacity: showScroll ? 1 : 0, x: '-50%' }}
        transition={{ duration: 0.4 }}
      >
        <div
          style={{
            height: 40,
            width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(255,209,0,0.5), transparent)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-din-medium), sans-serif',
            fontSize: 9,
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
          }}
        >
          deslizar
        </span>
      </motion.div>
    </section>
  )
}
