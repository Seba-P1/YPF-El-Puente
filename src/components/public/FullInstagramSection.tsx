'use client'

import { useCallback, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import Image from 'next/image'
import type { InstagramPost } from '@/lib/supabase/types'

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url)
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface FullInstagramSectionProps {
  posts: InstagramPost[]
}

// ─── Card Backgrounds (fallback) ──────────────────────────────────────────────
const CARD_BG = [
  'from-neutral-900 to-neutral-950',
  'from-zinc-900 to-zinc-950',
  'from-stone-900 to-stone-950',
  'from-neutral-800 to-neutral-950',
  'from-zinc-800 to-zinc-950',
  'from-stone-800 to-stone-950',
]

// ─── Instagram Card ──────────────────────────────────────────────────────────
function InstagramCard({ post, index }: { post: InstagramPost; index: number }) {
  const [error, setError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [poster, setPoster] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleError = useCallback(() => setError(true), [])

  const hasThumbnail = !!post.thumbnail_url
  const isVideo = hasThumbnail && isVideoUrl(post.thumbnail_url!)

  // Lazy-load: only set shouldLoad when near viewport
  useEffect(() => {
    if (!isVideo) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isVideo])

  // Auto-play/pause + extract poster frame
  useEffect(() => {
    if (!isVideo || !videoRef.current || !shouldLoad) return

    const video = videoRef.current

    const handleLoadedData = () => {
      // Extract first frame as poster
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 270
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          setPoster(canvas.toDataURL('image/jpeg', 0.6))
        }
      } catch {}
    }

    video.addEventListener('loadeddata', handleLoadedData)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {})
        } else {
          videoRef.current.pause()
        }
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      observer.disconnect()
    }
  }, [isVideo, shouldLoad])

  // ── Fallback (sin miniatura o media no cargada) ──
  if (error || !hasThumbnail) {
    return (
      <motion.div
        custom={index}
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{
          delay: index * 0.08,
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="relative w-full"
        style={{ aspectRatio: '9/16' }}
      >
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full group"
        >
          <div
            className={`w-full h-full rounded-2xl bg-gradient-to-br ${CARD_BG[index % CARD_BG.length]} 
              flex flex-col items-center justify-center gap-2
              shadow-[8px_8px_30px_-5px_rgba(0,0,0,0.6),-4px_-4px_20px_-5px_rgba(255,255,255,0.02),0_0_0_1px_rgba(255,255,255,0.05)]
              transition-all duration-500 group-hover:shadow-[12px_12px_40px_-5px_rgba(0,0,0,0.7),-6px_-6px_25px_-5px_rgba(255,255,255,0.03),0_0_0_1px_rgba(255,255,255,0.1)]
              group-hover:-translate-y-1.5`}
          >
            <Instagram size={28} className="text-white/20" />
            <span className="text-white/10 text-[10px] font-mono">Post {index + 1}</span>
          </div>
        </a>
      </motion.div>
    )
  }

  // ── Card con VIDEO ──
  if (isVideo) {
    return (
      <motion.div
        ref={containerRef}
        custom={index}
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{
          delay: index * 0.08,
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="relative w-full"
        style={{ aspectRatio: '9/16' }}
      >
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full group"
        >
          <div
            className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900
              shadow-[8px_8px_30px_-5px_rgba(0,0,0,0.6),-6px_-6px_25px_-5px_rgba(255,255,255,0.03),0_0_0_1px_rgba(255,255,255,0.06)]
              transition-all duration-500 ease-out
              group-hover:shadow-[12px_12px_40px_-5px_rgba(0,0,0,0.75),-8px_-8px_30px_-5px_rgba(255,255,255,0.04),0_0_0_1px_rgba(255,255,255,0.1)]
              group-hover:-translate-y-1.5
            "
          >
            <video
              ref={videoRef}
              src={shouldLoad ? post.thumbnail_url! : undefined}
              poster={poster ?? undefined}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              muted
              loop
              playsInline
              preload={shouldLoad ? 'metadata' : 'none'}
              onError={handleError}
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Badge Instagram (hover) */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg">
                <Instagram size={12} className="text-white" />
              </div>
            </div>

            {/* Indicador "Abrir post" */}
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
              <span className="text-[10px] text-white/80 font-medium bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                Abrir en Instagram →
              </span>
            </div>

            {/* Outline sutil hover */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 group-hover:ring-white/10 transition-all duration-500 pointer-events-none" />
          </div>
        </a>
      </motion.div>
    )
  }

  // ── Card con IMAGEN ──
  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative w-full"
      style={{ aspectRatio: '9/16' }}
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full group"
      >
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900
            shadow-[8px_8px_30px_-5px_rgba(0,0,0,0.6),-6px_-6px_25px_-5px_rgba(255,255,255,0.03),0_0_0_1px_rgba(255,255,255,0.06)]
            transition-all duration-500 ease-out
            group-hover:shadow-[12px_12px_40px_-5px_rgba(0,0,0,0.75),-8px_-8px_30px_-5px_rgba(255,255,255,0.04),0_0_0_1px_rgba(255,255,255,0.1)]
            group-hover:-translate-y-1.5
          "
        >
          <Image
            src={post.thumbnail_url!}
            alt="Publicación de Instagram"
            fill
            sizes="(max-width: 768px) 33vw, 16vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={handleError}
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Badge Instagram (hover) */}
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg">
              <Instagram size={12} className="text-white" />
            </div>
          </div>

          {/* Indicador "Abrir post" */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <span className="text-[10px] text-white/80 font-medium bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
              Abrir en Instagram →
            </span>
          </div>

          {/* Outline sutil hover */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 group-hover:ring-white/10 transition-all duration-500 pointer-events-none" />
        </div>
      </a>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FullInstagramSection({ posts }: FullInstagramSectionProps) {
  if (posts.length === 0) return null

  return (
    <section
      id="instagram"
      className="relative bg-black pt-[100px] pb-[60px] border-t border-white/5
        md:min-h-[100svh] md:py-0 md:flex md:flex-col md:justify-center"
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 'var(--page-max, 1280px)',
          padding: '0 var(--page-pad-x, 24px)',
        }}
      >
        {/* ── Header: QR + Texto ── */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-8 md:mb-[3svh]">
          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-shrink-0"
          >
            <a
              href="https://instagram.com/ypf.elpuente"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group"
            >
              <div
                className="transition-transform duration-300 group-hover:scale-105"
                style={{
width: 'clamp(168px, 33.6vw, 264px)',
                    height: 'clamp(168px, 33.6vw, 264px)',
                }}
              >
                <Image
                  src="/assets/instagram/QR-YPFinstagram.png"
                  alt="QR Instagram @YPF.ELPUENTE"
                  width={260}
                  height={260}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </a>
          </motion.div>

          {/* Texto + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center md:text-left"
          >
            <p className="font-[family-name:var(--font-caveat)] text-lg md:text-xl text-white/55 mb-1 tracking-wide">
              Seguinos
            </p>

            <h2 className="font-[family-name:var(--font-din-medium)] font-black text-3xl md:text-5xl text-white leading-none mb-2 tracking-tight">
              Instagram
            </h2>

            <p
              className="text-white/50 mt-3 mb-4 max-w-lg mx-auto md:mx-0"
              style={{ fontSize: 'clamp(14px, 1.6vw, 18px)' }}
            >
              Enterate de todas las promociones, novedades y el día a día de YPF El Puente.
            </p>
          </motion.div>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 w-full">
          {posts.map((post, index) => (
            <InstagramCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
