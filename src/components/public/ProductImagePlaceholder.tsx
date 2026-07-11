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

/**
 * Noto Emoji CDN base URL (Apache 2.0 license, free for commercial use).
 * Format: https://cdn.jsdelivr.net/npm/@svgmoji/noto@0.2.0/svg/{UNICODE_HEX}.svg
 */
const NOTO = 'https://cdn.jsdelivr.net/npm/@svgmoji/noto@0.2.0/svg'

/** Maps product name keywords → Noto Emoji SVG. Priority order: first match wins. */
const KEYWORD_ICON_RULES: Array<{ keywords: string[]; icon: string }> = [
  // ── EMPANADAS ──
  { keywords: ['empanada'], icon: `${NOTO}/1F95F.svg` },          // 🥟 dumpling

  // ── WRAPS / BURRITOS / CREPES / FAJITAS ──
  { keywords: ['wrap', 'burrito', 'crepe', 'crêpe', 'fajita'], icon: `${NOTO}/1F32F.svg` }, // 🌯 burrito/wrap

  // ── TARTAS / QUICHES ──
  { keywords: ['tarta', 'quiche', 'pastel', 'pie'], icon: `${NOTO}/1F967.svg` }, // 🥧 pie

  // ── PIZZA / PIZZETAS ──
  { keywords: ['pizza', 'pizzeta', 'muzzarella'], icon: `${NOTO}/1F355.svg` }, // 🍕 pizza

  // ── HAMBURGUESAS ──
  { keywords: ['hamburguesa', 'burger', 'smash'], icon: `${NOTO}/1F354.svg` },  // 🍔 hamburger

  // ── SANDWICHES / TOSTADOS ──
  { keywords: ['sandwich', 'sándwich', 'tostado', 'tostada', 'bagel', 'ciabatta'], icon: `${NOTO}/1F96A.svg` },  // 🥪 sandwich
  { keywords: ['pancho', 'hot dog'], icon: `${NOTO}/1F32D.svg` }, // 🌭 hot dog

  // ── WOK / COMIDA ASIATICA ──
  { keywords: ['wok', 'stir fry', 'noodle', 'fideos', 'pasta'], icon: `${NOTO}/1F35C.svg` },   // 🍜 steaming bowl

  // ── MILANESAS / SUPREMAS / CARNES ──
  { keywords: ['milanesa', 'suprema', 'schnitzel', 'carne', 'bife', 'lomo', 'peceto', 'pollo', 'chicken', 'pata muslo'], icon: `${NOTO}/1F969.svg` }, // 🥩 cut of meat

  // ── PAPAS FRITAS ──
  { keywords: ['papas', 'frita'], icon: `${NOTO}/1F35F.svg` },  // 🍟 french fries

  // ── ENSALADAS ──
  { keywords: ['ensalada', 'salad', 'bowl verde'], icon: `${NOTO}/1F957.svg` }, // 🥗 green salad

  // ── PLATOS CALIENTES / GUISOS ──
  { keywords: ['guiso', 'estofado', 'locro', 'plato'], icon: `${NOTO}/1F372.svg` }, // 🍲 pot of food

  // ── TACOS ──
  { keywords: ['taco', 'nacho'], icon: `${NOTO}/1F32E.svg` }, // 🌮 taco

  // ── ARROZ ──
  { keywords: ['arroz', 'rice'], icon: `${NOTO}/1F35A.svg` }, // 🍚 cooked rice

  // ── HUEVOS ──
  { keywords: ['huevo', 'omelette', 'revuelto'], icon: `${NOTO}/1F373.svg` }, // 🍳 cooking/egg

  // ── CAFÉ / BEBIDAS CALIENTES ──
  { keywords: ['cafe', 'café', 'cappuccino', 'cortado', 'latte', 'espresso', 'capi', 'mocca', 'flat white', 'pocillo', 'tazón', 'submarino'], icon: `${NOTO}/2615.svg` }, // ☕ hot beverage
  { keywords: ['te ', 'té ', 'infusion', 'infusión', 'mate cocido'], icon: `${NOTO}/1FAD6.svg` }, // 🫖 teapot
  { keywords: ['chocolate caliente'], icon: `${NOTO}/2615.svg` }, // ☕ hot beverage

  // ── FRAPPES / LICUADOS / SMOOTHIES ──
  { keywords: ['frappe', 'frappé', 'licuado', 'smoothie', 'batido', 'milkshake'], icon: `${NOTO}/1F964.svg` }, // 🥤 cup with straw

  // ── JUGOS / EXPRIMIDOS ──
  { keywords: ['jugo', 'exprimido', 'naranja', 'limonada'], icon: `${NOTO}/1F9C3.svg` }, // 🧃 beverage box

  // ── GASEOSAS / BEBIDAS FRIAS ──
  { keywords: ['gaseosa', 'coca', 'pepsi', 'sprite', 'fanta', 'seven up', 'aquarius', 'agua'], icon: `${NOTO}/1F964.svg` }, // 🥤 cup with straw

  // ── PANADERÍA / FACTURAS ──
  { keywords: ['medialuna', 'croissant', 'factura'], icon: `${NOTO}/1F950.svg` }, // 🥐 croissant
  { keywords: ['pan ', 'baguette', 'focaccia', 'chipá', 'chipa', 'muffin', 'cupcake', 'magdalena'], icon: `${NOTO}/1F956.svg` },       // 🥖 baguette
  { keywords: ['dona', 'donut', 'rosquilla'], icon: `${NOTO}/1F369.svg` },         // 🍩 doughnut
  { keywords: ['torta', 'cake', 'cheesecake', 'brownie', 'budín', 'budin'], icon: `${NOTO}/1F370.svg` }, // 🍰 shortcake
  { keywords: ['galleta', 'galletita', 'cookie', 'cuadradito'], icon: `${NOTO}/1F36A.svg` }, // 🍪 cookie

  // ── ALFAJORES / CHOCOLATE / SNACKS ──
  { keywords: ['alfajor', 'chocolate', 'barra', 'snack', 'mix energetico', 'mix clasico', 'bocadito'], icon: `${NOTO}/1F36B.svg` }, // 🍫 chocolate bar
  { keywords: ['caramelo', 'gomita', 'chupetin'], icon: `${NOTO}/1F36C.svg` },         // 🍬 candy

  // ── HELADOS ──
  { keywords: ['helado', 'ice cream', 'paleta'], icon: `${NOTO}/1F368.svg` },  // 🍨 ice cream

  // ── COMBOS (must be LAST — it's generic) ──
  { keywords: ['combo'], icon: `${NOTO}/1F371.svg` }, // 🍱 bento box
]

/** Category-based fallback icons when no keyword matches */
const CATEGORY_FALLBACK_ICONS: Record<string, string> = {
  cafeteria: `${NOTO}/2615.svg`,           // ☕
  panaderia: `${NOTO}/1F950.svg`,          // 🥐
  comidas_calientes: `${NOTO}/1F372.svg`,  // 🍲
  comidas_frias: `${NOTO}/1F957.svg`,      // 🥗
  marca_full: `${NOTO}/1F36B.svg`,         // 🍫
  combos: `${NOTO}/1F371.svg`,             // 🍱
  sin_tacc: `${NOTO}/1F957.svg`,           // 🥗
  sin_categoria: `${NOTO}/1F37D.svg`,      // 🍽️ fork and knife with plate
}

const DEFAULT_ICON = `${NOTO}/1F37D.svg`   // 🍽️ fork and knife with plate

/** Smart keyword-first icon resolver */
function getEmojiIcon(categoriaSlug: string, nombre: string): string {
  const nameLower = nombre.toLowerCase().trim()

  // Priority scan: first matching rule wins
  for (const rule of KEYWORD_ICON_RULES) {
    if (rule.keywords.some((kw) => nameLower.includes(kw))) {
      return rule.icon
    }
  }

  // Category fallback
  return CATEGORY_FALLBACK_ICONS[categoriaSlug] ?? DEFAULT_ICON
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
          quality={95}
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  // Level 2: Noto Emoji SVG icon fallback
  const iconSrc = getEmojiIcon(categoriaSlug, nombre)
  const glowColor = getCategoryGlow(categoriaSlug)

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt={nombre || categoriaSlug}
          style={{
            width: 'clamp(60px, 8vw, 100px)',
            height: 'clamp(60px, 8vw, 100px)',
            objectFit: 'contain',
            filter: `drop-shadow(0 8px 24px ${glowColor}) drop-shadow(0 2px 8px rgba(0,0,0,0.3))`,
          }}
        />
      </div>
    )
  }

  // Fixed size mode: used in CatalogoProductCard (square grid)
  const iconSize = Math.round(size * 0.38)

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        borderRadius: 20,
        position: 'relative',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconSrc}
        alt={nombre || categoriaSlug}
        style={{
          width: iconSize,
          height: iconSize,
          objectFit: 'contain',
          filter: `drop-shadow(0 6px 16px ${glowColor}) drop-shadow(0 2px 6px rgba(0,0,0,0.2))`,
        }}
      />
    </div>
  )
}
