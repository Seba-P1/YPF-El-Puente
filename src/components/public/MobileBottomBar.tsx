'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, UtensilsCrossed, Car, ShoppingCart, BookOpen } from 'lucide-react'
import { useCartStore } from '@/stores/cart'

export function MobileBottomBar() {
  const pathname = usePathname()
  const { totalItems, openCart } = useCartStore()

  // Fix: mantener visible por encima del browser chrome dinámico en mobile
  const [bottomOffset, setBottomOffset] = useState(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      // La diferencia entre innerHeight y visualViewport.height es el browser chrome
      const chrome = window.innerHeight - vv.height
      setBottomOffset(Math.max(0, chrome - vv.offsetTop))
    }

    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    update()

    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname.startsWith(path)

  return (
    <nav
      className="md:hidden fixed left-0 z-50"
      style={{
        bottom: bottomOffset,
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        background: 'rgba(6,8,15,0.98)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-1" style={{ width: '100%', maxWidth: '100vw' }}>
        <Link
          href="/"
          className="flex flex-col items-center justify-center flex-1 min-w-0 h-full space-y-1"
          style={{ color: isActive('/', true) ? '#FFD100' : 'rgba(248,250,252,0.45)' }}
        >
          <Home style={{ width: 22, height: 22, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600 }}>Inicio</span>
        </Link>
        <Link
          href="/full"
          className="flex flex-col items-center justify-center flex-1 min-w-0 h-full space-y-1"
          style={{ color: isActive('/full', true) ? '#FFD100' : 'rgba(248,250,252,0.45)' }}
        >
          <UtensilsCrossed style={{ width: 22, height: 22, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600 }}>Full</span>
        </Link>
        {pathname.startsWith('/full') ? (
          <Link
            href="/full/menu"
            className="flex flex-col items-center justify-center flex-1 min-w-0 h-full space-y-1"
            style={{ color: isActive('/full/menu') ? '#FFD100' : 'rgba(248,250,252,0.45)' }}
          >
            <BookOpen style={{ width: 22, height: 22, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>Full Completo</span>
          </Link>
        ) : (
          <Link
            href="/#boxes"
            className="flex flex-col items-center justify-center flex-1 min-w-0 h-full space-y-1"
            style={{ color: 'rgba(248,250,252,0.45)' }}
          >
            <Car style={{ width: 22, height: 22, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>Boxes</span>
          </Link>
        )}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center flex-1 min-w-0 h-full space-y-1 cursor-pointer"
          style={{ color: 'rgba(248,250,252,0.45)' }}
        >
          <div className="relative">
            <ShoppingCart style={{ width: 22, height: 22 }} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -10,
                  background: '#FFD100',
                  color: '#000',
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 999,
                  minWidth: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Carrito</span>
        </button>
      </div>
    </nav>
  )
}
