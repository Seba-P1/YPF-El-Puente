/* ─── Color fallback logic ─── */
export function getCombustibleColor(
  nombre: string,
  colorHex: string | null,
): string {
  if (colorHex && colorHex !== '#005A9C') return colorHex
  const lower = nombre.toLowerCase()
  if (lower.includes('infinia') && !lower.includes('diesel')) return '#9B1C1C'
  if (lower.includes('premium')) return '#9B1C1C'
  if (lower.includes('super') || lower.includes('nafta super')) return '#1D4ED8'
  if (
    lower.includes('infinia diesel') || lower.includes('diesel')
  ) return '#065F46'
  if (lower.includes('gnc')) return '#5B21B6'
  return '#374151'
}

/* ─── Image mapping logic ─── */
export function getCombustibleImage(nombre: string): string {
  const lower = nombre.toLowerCase()
  if (lower.includes('infinia') && lower.includes('diesel')) {
    return '/assets/ypf imagenes/combustibles/infinia-diesel.webp'
  }
  if (lower.includes('infinia')) {
    return '/assets/ypf imagenes/combustibles/infinia-nafta.webp'
  }
  if (lower.includes('super') || lower.includes('súper')) {
    return '/assets/ypf imagenes/combustibles/nafta-super.webp'
  }
  if (lower.includes('500') || lower.includes('diesel')) {
    return '/assets/ypf imagenes/combustibles/Diesel-500.webp'
  }
  return '/assets/ypf imagenes/combustibles/infinia-nafta.webp'
}

/* ─── Stagger variants ─── */
export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}
