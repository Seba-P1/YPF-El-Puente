'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart'

export function FullNavbar() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [imgError, setImgError] = useState(false)
  const totalItems = useCartStore((state) => state.totalItems)
  const openCart = useCartStore((state) => state.openCart)

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  useEffect(() => {
    const sections = ['hamburguesas', 'cafeteria', 'productos-full']

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[68px]"
      style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}
    >
      <div
        className="flex justify-between items-center h-full mx-auto"
        style={{
          maxWidth: 'var(--page-max, 1280px)',
          padding: '0 var(--page-pad-x, 24px)'
        }}
      >
        {/* LOGO */}
        <Link
          href="#home"
          onClick={(e) => handleScroll(e, 'home')}
          className="flex-shrink-0"
        >
          {!imgError ? (
            <Image
              src="/assets/logo/logo-white.svg"
              alt="YPF FULL"
              width={100}
              height={32}
              className="h-8 w-auto"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-white font-black text-lg">YPF FULL</span>
          )}
        </Link>

        {/* LINKS DE SECCIÓN (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { id: 'hamburguesas', label: 'Hamburguesas' },
            { id: 'cafeteria', label: 'Cafetería' },
            { id: 'productos-full', label: 'Marca FULL' }
          ].map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className={`text-sm font-medium transition-colors duration-200 py-5 ${activeSection === item.id
                  ? 'text-white border-b-2 border-[#FFD100]'
                  : 'text-white/65 hover:text-white border-b-2 border-transparent'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* BOTÓN CARRITO */}
        <button
          onClick={openCart}
          className="flex items-center gap-2 rounded-full py-2 px-4 transition-colors"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          <ShoppingCart size={20} className="text-white" />
          {totalItems > 0 && (
            <span className="bg-[#FFD100] text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}