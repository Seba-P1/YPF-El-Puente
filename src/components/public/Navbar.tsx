'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart'

const NAV_LINKS = [
  { href: '/', label: 'Inicio', exact: true },
  { href: '/combustibles', label: 'Combustibles' },
  { href: '/boxes', label: 'Boxes' },
  { href: '/full', label: 'Menú FULL' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { totalItems, openCart } = useCartStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (link: typeof NAV_LINKS[number]) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '68px',
        background: scrolled ? 'rgba(6,8,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div className="h-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="flex items-center justify-center rounded-lg font-black italic text-white text-lg"
            style={{
              width: 36,
              height: 36,
              background: '#005A9C',
              transition: 'transform 0.2s ease',
            }}
          >
            <span className="group-hover:scale-110 transition-transform">Y</span>
          </div>
          <span
            className="font-bold tracking-tight"
            style={{ fontSize: 16, color: '#F8FAFC' }}
          >
            EL PUENTE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.01em',
                color: isActive(link) ? '#F8FAFC' : 'rgba(248,250,252,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                position: 'relative',
                paddingBottom: 4,
              }}
              className="hover:!text-[#F8FAFC]"
            >
              {link.label}
              {isActive(link) && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: '#FFD100',
                    borderRadius: 1,
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Cart Button */}
        <button
          onClick={openCart}
          className="flex items-center gap-2 cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999,
            padding: '8px 16px',
            transition: 'background 0.2s ease, border-color 0.2s ease',
            color: 'rgba(248,250,252,0.85)',
            fontSize: 14,
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
          aria-label="Abrir carrito"
        >
          <ShoppingCart style={{ width: 18, height: 18 }} />
          <span className="hidden md:inline">Carrito</span>
          {totalItems > 0 && (
            <span
              style={{
                background: '#FFD100',
                color: '#000',
                fontWeight: 700,
                fontSize: 11,
                borderRadius: 999,
                minWidth: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6px',
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
