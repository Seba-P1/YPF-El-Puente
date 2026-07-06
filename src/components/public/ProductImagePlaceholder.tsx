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

// ── STRICT KEYWORD IMAGE MATCHING ──
function getPlaceholderImage(categoriaSlug: string, nombre: string): string | null {
  const nameLower = nombre.toLowerCase().trim()
  if (!nameLower) return null

  // ONLY match real images if the name explicitly contains these keywords
  if (nameLower.includes('hamburguesa') || nameLower.includes('burger')) {
    const burgerIds = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const id = burgerIds[hash % burgerIds.length]
    return `/assets/ypf imagenes/burger-${id}.webp`
  }

  if (nameLower.includes('papas')) {
    return '/assets/ypf imagenes/papas-chimi.webp'
  }

  if (
    nameLower.includes('cafe') ||
    nameLower.includes('cappuccino') ||
    nameLower.includes('cortado') ||
    nameLower.includes('latte') ||
    nameLower.includes('espresso')
  ) {
    if (nameLower.includes('capi') || nameLower.includes('cappuccino')) {
      return '/assets/ypf imagenes/cafe-capi.webp'
    }
    const cafeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const id = cafeIds[hash % cafeIds.length]
    return `/assets/ypf imagenes/cafe-${id}.webp`
  }

  if (nameLower.includes('alfajor')) {
    if (nameLower.includes('negro') || nameLower.includes('chocolate')) {
      return '/assets/ypf imagenes/alfajor-negro.webp'
    }
    if (nameLower.includes('blanco')) {
      return '/assets/ypf imagenes/alfajor-15.webp'
    }
    const alfajorIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15]
    const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const id = alfajorIds[hash % alfajorIds.length]
    return `/assets/ypf imagenes/alfajor-${id}.webp`
  }

  if (nameLower.includes('dona')) {
    return '/assets/ypf imagenes/dona.webp'
  }

  return null
}

// ── 3D ICON DESIGN SYSTEM ──
function get3DStyle(category: string) {
  switch (category) {
    case 'comidas_calientes':
      return {
        bg: 'radial-gradient(circle at 30% 30%, #FF6B4A 0%, #D82200 65%, #6A0000 100%)',
        glow: 'rgba(216,34,0,0.3)',
      }
    case 'comidas_frias':
      return {
        bg: 'radial-gradient(circle at 30% 30%, #5FE0FF 0%, #007CA3 65%, #00364A 100%)',
        glow: 'rgba(0,124,163,0.3)',
      }
    case 'cafeteria':
      return {
        bg: 'radial-gradient(circle at 30% 30%, #E8B48F 0%, #A35C37 65%, #4C1F0E 100%)',
        glow: 'rgba(163,92,55,0.3)',
      }
    case 'panaderia':
      return {
        bg: 'radial-gradient(circle at 30% 30%, #FFE082 0%, #F5B041 65%, #7E5109 100%)',
        glow: 'rgba(245,176,65,0.3)',
      }
    case 'combos':
      return {
        bg: 'radial-gradient(circle at 30% 30%, #D7BDE2 0%, #8E44AD 65%, #4A148C 100%)',
        glow: 'rgba(142,68,173,0.3)',
      }
    case 'marca_full':
      return {
        bg: 'radial-gradient(circle at 30% 30%, #FFF59D 0%, #F1C40F 65%, #7D6608 100%)',
        glow: 'rgba(241,196,15,0.3)',
      }
    default:
      return {
        bg: 'radial-gradient(circle at 30% 30%, #B2BABB 0%, #7F8C8D 65%, #34495E 100%)',
        glow: 'rgba(127,140,141,0.2)',
      }
  }
}

function getEmoji(categoriaSlug: string, nombre: string): string {
  const nameLower = nombre.toLowerCase().trim()

  if (nameLower.includes('empanada')) return '🥟'
  if (nameLower.includes('tostado') || nameLower.includes('sandwich') || nameLower.includes('miga') || nameLower.includes('ciabatta') || nameLower.includes('baguetin')) return '🥪'
  if (nameLower.includes('pizzeta') || nameLower.includes('pizza')) return '🍕'
  if (nameLower.includes('papas') || nameLower.includes('papas fritas')) return '🍟'
  if (nameLower.includes('medialuna')) return '🥐'
  if (nameLower.includes('muffin') || nameLower.includes('cupcake')) return '🧁'
  if (nameLower.includes('budin') || nameLower.includes('budín') || nameLower.includes('pan ')) return '🍞'
  if (nameLower.includes('cookie') || nameLower.includes('galleta') || nameLower.includes('pepa')) return '🍪'
  if (nameLower.includes('te ') || nameLower.includes('té')) return '🍵'
  if (nameLower.includes('licuado') || nameLower.includes('exprimido') || nameLower.includes('jugo') || nameLower.includes('gaseosa') || nameLower.includes('bebida') || nameLower.includes('agua')) return '🍹'

  switch (categoriaSlug) {
    case 'comidas_calientes':
      return '🍔'
    case 'comidas_frias':
      return '🥪'
    case 'cafeteria':
      return '☕'
    case 'panaderia':
      return '🥐'
    case 'combos':
      return '📦'
    case 'marca_full':
      return '⭐'
    default:
      return '🛍️'
  }
}

export function ProductImagePlaceholder({
  categoriaSlug,
  nombre = '',
  size = 200,
  fill = false,
}: ProductImagePlaceholderProps) {
  const mappedImage = getPlaceholderImage(categoriaSlug, nombre)

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

  // Fallback: 3D Illustration Sphere
  const style = get3DStyle(categoriaSlug)
  const emoji = getEmoji(categoriaSlug, nombre)

  // OPTIMIZATION FOR LANDING PAGE OVERLAPPING COVER:
  // If fill is true (used in FullProductCard), center a floating 3D sphere at a fixed scale.
  // This avoids a massive solid colored rectangle covering the entire slide container!
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
            width: 'clamp(120px, 15vw, 180px)',
            height: 'clamp(120px, 15vw, 180px)',
            borderRadius: '50%',
            background: style.bg,
            boxShadow: `0 12px 36px -4px ${style.glow}, inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -6px 12px rgba(0,0,0,0.45)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* 3D Glass Gloss Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)',
              borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
              transform: 'scaleX(0.9)',
              pointerEvents: 'none',
            }}
          />
          {/* Glossy ring */}
          <div
            style={{
              position: 'absolute',
              inset: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          {/* Floating 3D Emoji */}
          <span
            style={{
              fontSize: 'clamp(44px, 5vw, 64px)',
              filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.55))',
              transform: 'translateY(-2px)',
              userSelect: 'none',
            }}
          >
            {emoji}
          </span>
        </div>
      </div>
    )
  }

  // Fallback for square grids (e.g. Catalog Page)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        background: style.bg,
        boxShadow: `0 8px 24px -4px ${style.glow}, inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -4px 10px rgba(0,0,0,0.4)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 3D Glass Gloss Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          transform: 'scaleX(0.9)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Glossy ring */}
      <div
        style={{
          position: 'absolute',
          inset: 4,
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          pointerEvents: 'none',
        }}
      />

      {/* Floating 3D Emoji */}
      <span
        style={{
          fontSize: size * 0.28,
          filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.5))',
          transform: 'translateY(-2px)',
          userSelect: 'none',
        }}
      >
        {emoji}
      </span>
    </div>
  )
}
