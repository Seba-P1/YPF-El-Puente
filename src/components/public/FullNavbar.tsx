'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Search, X } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { useSearchStore } from '@/stores/search'
import { AnimatePresence, motion } from 'framer-motion'

export function FullNavbar() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const totalItems = useCartStore((state) => state.totalItems)
  const openCart = useCartStore((state) => state.openCart)
  const query = useSearchStore((state) => state.query)
  const setQuery = useSearchStore((state) => state.setQuery)

  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    handleWindowScroll()
    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

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
    const sections = ['hamburguesas', 'cafeteria', 'productos-full', 'sustentabilidad']

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
      className="fixed top-0 left-0 right-0 z-50 h-[68px] transition-all duration-300"
      style={{
        background: isScrolled ? 'rgba(0,0,0,0.75)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent'
      }}
    >
      <div
        className="flex justify-between items-center h-full mx-auto transition-all duration-300"
        style={{
          maxWidth: 'var(--page-max, 1280px)',
          padding: '0 var(--page-pad-x, 24px)',
          opacity: isSearchExpanded ? 0 : 1,
          pointerEvents: isSearchExpanded ? 'none' : 'auto',
          transform: isSearchExpanded ? 'scale(0.98)' : 'scale(1)'
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
            { id: 'productos-full', label: 'Marca FULL' },
            { id: 'sustentabilidad', label: 'Sustentabilidad' },
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

        <div className="flex items-center justify-end flex-1 ml-auto">
          <button
            onClick={() => setIsSearchExpanded(true)}
            className="flex items-center justify-center bg-transparent border-none cursor-pointer mr-2 md:mr-4"
            aria-label="Buscar productos"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <Search size={22} className="text-white" />
            </div>
          </button>

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
      </div>

      {/* OVERLAY ANIMADO DEL BUSCADOR */}
      <AnimatePresence>
        {isSearchExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-50%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute left-4 right-4 md:left-6 md:right-6 lg:left-[calc(50%-350px)] lg:right-[calc(50%-350px)] top-1/2 z-50 flex items-center h-12 px-4 rounded-full backdrop-blur-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <div className="flex items-center w-full">
              <Search size={20} className="text-white/50 mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Buscar hamburguesas, café, etc..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-white text-base outline-none placeholder:text-white/30"
              />
              <button
                onClick={() => {
                  setIsSearchExpanded(false)
                  setQuery('')
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}