'use client'

import React from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/excel/parser'
import { ProductImagePlaceholder } from '@/components/public/ProductImagePlaceholder'
import type { Producto } from '@/lib/supabase/types'

interface CatalogoProductCardProps {
  producto: Producto
}

export function CatalogoProductCard({ producto }: CatalogoProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem(producto)
    toast.success(`${producto.nombre} agregado`, { duration: 2000 })
  }

  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      className="hover:border-white/15 hover:scale-[1.02] group"
    >
      {/* Square image */}
      <div
        style={{
          aspectRatio: '1/1',
          position: 'relative',
          background: '#0D1120',
        }}
      >
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <ProductImagePlaceholder
            categoriaSlug={producto.categoria_slug}
            nombre={producto.nombre}
            fill
          />
        )}
        {producto.es_sin_tacc && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'rgba(34,197,94,0.9)',
              color: 'white',
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            SIN TACC
          </span>
        )}
      </div>

      {/* Info */}
      <div
        style={{
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 34,
          }}
        >
          {producto.nombre}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 800, color: '#FFD100' }}>
            {formatearPrecioARS(producto.precio)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'rgba(0,90,156,0.85)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            className="hover:!bg-[#0070C0]"
          >
            <Plus size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}
