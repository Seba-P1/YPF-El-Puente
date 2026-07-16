'use client'

import React from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/cart'
import { formatearPrecioARS } from '@/lib/format'
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
        background: 'linear-gradient(145deg, rgba(17,24,39,0.95) 0%, rgba(13,17,32,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
         transition: 'border-color 0.3s, transform 0.25s',
        position: 'relative',
      }}
      className="hover:border-white/15 hover:scale-[1.03] group"
    >
      {/* Image area */}
      <div
        style={{
          aspectRatio: '1/1',
          position: 'relative',
          background: 'radial-gradient(circle at 50% 60%, rgba(255,209,0,0.03) 0%, rgba(13,17,32,1) 70%)',
          overflow: 'hidden',
        }}
      >
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            quality={95}
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            className="group-hover:scale-110"
          />
        ) : (
          <ProductImagePlaceholder
            categoriaSlug={producto.categoria_slug}
            nombre={producto.nombre}
            fill
          />
        )}

        {/* Sin TACC badge */}
        {producto.es_sin_tacc && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.95) 0%, rgba(22,163,74,0.95) 100%)',
              color: 'white',
              fontSize: 9,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.05em',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
            }}
          >
            SIN TACC
          </span>
        )}

        {/* Bottom gradient fade for seamless transition */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(13,17,32,0.9) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Info section */}
      <div
        style={{
          padding: '10px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.88)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 32,
            lineHeight: '1.35',
            letterSpacing: '-0.01em',
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
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#FFD100',
              letterSpacing: '-0.02em',
            }}
          >
            {formatearPrecioARS(producto.precio)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(0,90,156,0.9) 0%, rgba(0,112,192,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,90,156,0.25)',
            }}
            className="hover:!bg-[#0070C0] hover:scale-105 active:scale-90"
          >
            <Plus size={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}
