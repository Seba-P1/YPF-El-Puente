'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductImagePlaceholder } from './ProductImagePlaceholder'

interface CuratedProductImageProps {
  codigo: string
  categoriaSlug: string
  size?: number
  productoNombre: string
}

const EXTENSIONES = ['webp', 'jpg', 'png'] as const

export function CuratedProductImage({
  codigo,
  categoriaSlug,
  size = 220,
  productoNombre,
}: CuratedProductImageProps) {
  const [intentoActual, setIntentoActual] = useState(0)
  const [agotado, setAgotado] = useState(false)

  if (agotado) {
    return <ProductImagePlaceholder categoriaSlug={categoriaSlug} size={size} />
  }

  const ext = EXTENSIONES[intentoActual]
  const src = `/assets/ypf%20imagenes/${categoriaSlug}/${codigo}.${ext}`

  return (
    <Image
      src={src}
      alt={productoNombre}
      fill
      style={{ objectFit: 'contain', filter: 'drop-shadow(0px 20px 45px rgba(0,0,0,0.55))' }}
      onError={() => {
        if (intentoActual < EXTENSIONES.length - 1) {
          setIntentoActual(intentoActual + 1)
        } else {
          setAgotado(true)
        }
      }}
    />
  )
}
