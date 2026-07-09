'use client'

import React from 'react'
import Image from 'next/image'

interface ProductImagePlaceholderProps {
  categoriaSlug: string
  nombre?: string
  /** Fixed pixel size. Ignored when `fill` is true. */
  size?: number
  /** When true, the placeholder stretches to fill its parent container. */
  fill?: boolean
}

// ── LEVEL 1: STRICT KEYWORD IMAGE MATCHING ──
function getPlaceholderImage(categoriaSlug: string, nombre: string): string | null {
  const nameLower = nombre.toLowerCase().trim()
  if (!nameLower) return null

  // ONLY match real images if the name explicitly contains these keywords
  if (nameLower.includes('hamburguesa') || nameLower.includes('burger')) {
    const burgerIds = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const id = burgerIds[hash % burgerIds.length]
    return `/assets/ypf imagenes/full_hamburguesas/burger-${id}.webp`
  }

  if (nameLower.includes('papas')) {
    return '/assets/ypf imagenes/full_mundial/papas-chimi.webp'
  }

  if (
    nameLower.includes('cafe') ||
    nameLower.includes('cappuccino') ||
    nameLower.includes('cortado') ||
    nameLower.includes('latte') ||
    nameLower.includes('espresso')
  ) {
    if (nameLower.includes('capi') || nameLower.includes('cappuccino')) {
      return '/assets/ypf imagenes/full_cafeteria/cafe-capi.webp'
    }
    const cafeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const id = cafeIds[hash % cafeIds.length]
    return `/assets/ypf imagenes/full_cafeteria/cafe-${id}.webp`
  }

  if (nameLower.includes('alfajor')) {
    if (nameLower.includes('negro') || nameLower.includes('chocolate')) {
      return '/assets/ypf imagenes/marca_full/alfajor-negro.webp'
    }
    if (nameLower.includes('blanco')) {
      return '/assets/ypf imagenes/marca_full/alfajor-15.webp'
    }
    const alfajorIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15]
    const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const id = alfajorIds[hash % alfajorIds.length]
    return `/assets/ypf imagenes/marca_full/alfajor-${id}.webp`
  }

  if (nameLower.includes('dona')) {
    return '/assets/ypf imagenes/dona.webp'
  }

  return null
}

// ── LEVEL 2: PREMIUM 3D ICON SYSTEM ──

/** Subtle, premium glow colors per category */
function getCategoryGlow(categoriaSlug: string): string {
  switch (categoriaSlug) {
    case 'cafeteria':
      return 'rgba(180, 120, 80, 0.4)'
    case 'panaderia':
      return 'rgba(245, 176, 65, 0.4)'
    case 'comidas_calientes':
      return 'rgba(216, 34, 0, 0.4)'
    case 'comidas_frias':
      return 'rgba(0, 124, 163, 0.4)'
    case 'marca_full':
      return 'rgba(241, 196, 15, 0.4)'
    case 'combos':
      return 'rgba(142, 68, 173, 0.4)'
    default:
      return 'rgba(127, 140, 141, 0.2)'
  }
}

/** Maps product name keywords to 3D icon filenames */
function get3DIcon(categoriaSlug: string, nombre: string): string {
  const nameLower = nombre.toLowerCase().trim()

  // Keyword-based matching
  if (
    nameLower.includes('cafe') ||
    nameLower.includes('cappuccino') ||
    nameLower.includes('cortado') ||
    nameLower.includes('latte') ||
    nameLower.includes('espresso') ||
    nameLower.includes('capi')
  ) {
    return '/assets/3d-icons/hot-beverage.png'
  }

  if (
    nameLower.includes('medialuna') ||
    nameLower.includes('croissant') ||
    nameLower.includes('factura')
  ) {
    return '/assets/3d-icons/croissant.png'
  }

  if (nameLower.includes('dona') || nameLower.includes('donut')) {
    return '/assets/3d-icons/doughnut.png'
  }

  if (nameLower.includes('hamburguesa') || nameLower.includes('burger')) {
    return '/assets/3d-icons/hamburger.png'
  }

  if (
    nameLower.includes('licuado') ||
    nameLower.includes('exprimido') ||
    nameLower.includes('jugo') ||
    nameLower.includes('gaseosa') ||
    nameLower.includes('bebida')
  ) {
    return '/assets/3d-icons/cup-with-straw.png'
  }

  if (nameLower.includes('alfajor') || nameLower.includes('chocolate')) {
    return '/assets/3d-icons/chocolate-bar.png'
  }

  if (nameLower.includes('pizza') || nameLower.includes('pizzeta')) {
    return '/assets/3d-icons/pizza.png'
  }

  // Category-based fallback
  switch (categoriaSlug) {
    case 'cafeteria':
      return '/assets/3d-icons/hot-beverage.png'
    case 'panaderia':
      return '/assets/3d-icons/croissant.png'
    case 'comidas_calientes':
      return '/assets/3d-icons/hamburger.png'
    case 'comidas_frias':
      return '/assets/3d-icons/cup-with-straw.png'
    case 'marca_full':
      return '/assets/3d-icons/chocolate-bar.png'
    case 'combos':
      return '/assets/3d-icons/doughnut.png'
    default:
      return '/assets/3d-icons/hot-beverage.png'
  }
}

export function ProductImagePlaceholder({
  categoriaSlug,
  nombre = '',
  size = 200,
  fill = false,
}: ProductImagePlaceholderProps) {
  const mappedImage = getPlaceholderImage(categoriaSlug, nombre)

  // Level 1: real product image by keyword match
  if (mappedImage) {
    return (
      <div
        style={{
          ...(fill
            ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
            : { width: size, height: size }),
          borderRadius: fill ? 0 : 16,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Image
          src={mappedImage}
          alt={nombre}
          fill
          sizes={fill ? '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw' : `${size}px`}
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  // Level 2: premium glassmorphism 3D icon fallback
  const iconSrc = get3DIcon(categoriaSlug, nombre)
  const glowColor = getCategoryGlow(categoriaSlug)

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative' as const,
  }

  const iconContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 12px 40px -8px ${glowColor}, 0 4px 12px rgba(0,0,0,0.3)`,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
  }

  // Fill mode: used in FullProductCard (overlapping cover layout)
  if (fill) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <div
          style={{
            ...cardStyle,
            width: 'clamp(140px, 18vw, 200px)',
            height: 'clamp(140px, 18vw, 200px)',
            borderRadius: 24,
          }}
        >
          {/* Subtle top highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 100%)',
              borderRadius: '24px 24px 0 0',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              ...iconContainerStyle,
              width: 'clamp(64px, 8vw, 96px)',
              height: 'clamp(64px, 8vw, 96px)',
              padding: '12%',
            }}
          >
            <Image
              src={iconSrc}
              alt={nombre || categoriaSlug}
              fill
              sizes="clamp(64px, 8vw, 96px)"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Fixed size mode: used in CatalogoProductCard (square grid)
  const iconSize = Math.round(size * 0.55)

  return (
    <div
      style={{
        ...cardStyle,
        width: size,
        height: size,
        borderRadius: 20,
      }}
    >
      {/* Subtle top highlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 100%)',
          borderRadius: '20px 20px 0 0',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          ...iconContainerStyle,
          width: iconSize,
          height: iconSize,
          padding: '10%',
        }}
      >
        <Image
          src={iconSrc}
          alt={nombre || categoriaSlug}
          fill
          sizes={`${iconSize}px`}
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  )
}
