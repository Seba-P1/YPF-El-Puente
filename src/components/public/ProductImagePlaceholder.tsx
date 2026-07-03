'use client'

import {
  Flame,
  Salad,
  Coffee,
  Croissant,
  Package,
  Star,
  HelpCircle,
  ImageOff,
  type LucideIcon,
} from 'lucide-react'

interface ProductImagePlaceholderProps {
  categoriaSlug: string
  /** Fixed pixel size. Ignored when `fill` is true. */
  size?: number
  /** When true, the placeholder stretches to fill its parent container. */
  fill?: boolean
}

const ICON_BY_CATEGORY: Record<string, LucideIcon> = {
  comidas_calientes: Flame,
  comidas_frias: Salad,
  cafeteria: Coffee,
  panaderia: Croissant,
  combos: Package,
  marca_full: Star,
  sin_categoria: HelpCircle,
}

export function ProductImagePlaceholder({
  categoriaSlug,
  size = 200,
  fill = false,
}: ProductImagePlaceholderProps) {
  const Icono = ICON_BY_CATEGORY[categoriaSlug] ?? ImageOff

  const iconSize = fill ? '32%' : size * 0.32

  return (
    <div
      style={{
        ...(fill
          ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
          : { width: size, height: size }),
        borderRadius: fill ? 0 : 16,
        background:
          'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 60%), #1A1D27',
        border: fill ? 'none' : '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icono
        size={iconSize as number}
        color="rgba(255,255,255,0.25)"
        strokeWidth={1.5}
        style={fill ? { width: '32%', height: '32%' } : undefined}
      />
    </div>
  )
}
