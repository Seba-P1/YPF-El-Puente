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

      {/* Wrapper to align center and occupy full width */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-16 flex flex-col justify-between items-center min-h-[calc(100vh-80px)] mt-[80px] pb-8">
        {/* Content Top: Logo con Slogan */}
        <motion.div
          className="relative flex flex-col items-center text-center pt-6 md:pt-12 w-full max-w-[340px] sm:max-w-[460px] md:max-w-[560px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="relative w-full aspect-[2.2/1]">
            <Image
              src="/assets/ypf imagenes/logo-con-slogan.png"
              alt="YPF El Puente — Con la mejor energía de la Patagonia desde 1930"
              fill
              priority
              sizes="(max-width: 768px) 340px, 560px"
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* 3 Circular Buttons fixed horizontal row (Ubicación, Full, WhatsApp) */}
        <motion.div
          className="flex items-center justify-center gap-4 sm:gap-7 mt-auto pb-36 md:pb-14"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 1. Ubicación Button */}
          <motion.a
            variants={itemVariants}
            href="https://www.google.com/maps/dir/?api=1&destination=YPF+El+Puente,+Ruta+Nacional+22+Km+857,+Rio+Colorado"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-300 flex items-center justify-center shrink-0"
            style={{
              width: 'clamp(60px, 15vw, 76px)',
              height: 'clamp(60px, 15vw, 76px)',
              boxShadow: '0 4px 20px rgba(0,112,192,0.4)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
            title="Ver Ubicación"
          >
            <Image
              src="/assets/ypf imagenes/ubicacion.png"
              alt="Ubicación"
              fill
              sizes="88px"
              className="object-cover rounded-full"
            />
          </motion.a>

          {/* 2. Full Button */}
          <motion.div variants={itemVariants}>
            <Link
              href="/full"
              className="group relative rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-300 flex items-center justify-center shrink-0 block"
              style={{
                width: 'clamp(60px, 15vw, 76px)',
                height: 'clamp(60px, 15vw, 76px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
              title="Menú FULL"
            >
              <Image
                src="/assets/ypf imagenes/logo-circular-full.png"
                alt="Ver Full"
                fill
                sizes="88px"
                className="object-cover rounded-full"
              />
            </Link>
          </motion.div>

          {/* 3. WhatsApp Button */}
          <motion.a
            variants={itemVariants}
            href="https://wa.me/5492920264433"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-300 flex items-center justify-center shrink-0"
            style={{
              width: 'clamp(60px, 15vw, 76px)',
              height: 'clamp(60px, 15vw, 76px)',
              boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
            title="WhatsApp"
          >
            <Image
              src="/assets/ypf imagenes/wsap.png"
              alt="WhatsApp"
              fill
              sizes="88px"
              className="object-cover rounded-full"
            />
          </motion.a>
        </motion.div>

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
