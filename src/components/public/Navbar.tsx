'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart'

const NAV_LINKS = [
  { href: '/', label: 'Inicio', exact: true },
  { href: '/#combustibles', label: 'Combustibles', isHash: true },
  { href: '/#boxes', label: 'Boxes', isHash: true },
  { href: '/full', label: 'Full' },
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

  const isActive = (link: typeof NAV_LINKS[number]) => {
    if (link.href === '/') {
      return pathname === '/'
    }
    if (link.isHash) {
      return false
    }
    return pathname.startsWith(link.href)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '68px',
        background: scrolled ? 'var(--navbar-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div className="w-full h-full max-w-[1920px] mx-auto px-4 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/assets/ypf imagenes/logo-modoclaro.png"
            alt="YPF El Puente"
            width={160}
            height={48}
            className="h-10 w-auto dark:hidden transition-transform group-hover:scale-105"
          />
          <Image
            src="/assets/ypf imagenes/logo-modooscuro.png"
            alt="YPF El Puente"
            width={160}
            height={48}
            className="h-10 w-auto hidden dark:block transition-transform group-hover:scale-105"
          />
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
                  color: isActive(link) ? 'var(--nav-text)' : 'var(--nav-text-muted)',
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
            background: 'var(--btn-secondary-bg)',
            border: '1px solid var(--btn-secondary-border)',
            borderRadius: 999,
            padding: '8px 16px',
            transition: 'background 0.2s ease, border-color 0.2s ease',
            color: 'var(--nav-text)',
            fontSize: 14,
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--btn-secondary-hover-bg)'
            e.currentTarget.style.borderColor = 'var(--btn-secondary-hover-border)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--btn-secondary-bg)'
            e.currentTarget.style.borderColor = 'var(--btn-secondary-border)'
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
