'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Search, X } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { useSearchStore } from '@/stores/search'
import { AnimatePresence, motion } from 'framer-motion'
import { useFullPageStore } from '@/stores/fullpage'

interface FullNavbarProps {
  visible?: boolean
  transparent?: boolean
}

export function FullNavbar({ visible = true, transparent = false }: FullNavbarProps = {}) {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const totalItems = useCartStore((state) => state.totalItems)
  const openCart = useCartStore((state) => state.openCart)
  const query = useSearchStore((state) => state.query)
  const setQuery = useSearchStore((state) => state.setQuery)

  const pathname = usePathname()
  const router = useRouter()
  const isMenuPage = pathname === '/full/menu'

  const isFullPageEnabled = useFullPageStore((state) => state.isEnabled)
  const currentSection = useFullPageStore((state) => state.currentSection)
  const goToSectionById = useFullPageStore((state) => state.goToSectionById)

  // Sync active section and navbar scrolled style with fullpage slides on desktop
  useEffect(() => {
    if (!isFullPageEnabled) return

    // Scrolled state
    setIsScrolled(currentSection > 0)

    // Map section index to slug
    if (currentSection === 0) setActiveSection('home')
    if (currentSection === 1) setActiveSection('mundial')
    if (currentSection === 2) setActiveSection('hamburguesas')
    if (currentSection === 3) setActiveSection('cafeteria')
    if (currentSection === 4) setActiveSection('productos-full')
    if (currentSection === 5) setActiveSection('sin-tacc')
    if (currentSection === 7) setActiveSection('sustentabilidad')
  }, [isFullPageEnabled, currentSection])

  // Normal window scroll handler (mobile / standard layout)
  useEffect(() => {
    if (isFullPageEnabled) return

    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    handleWindowScroll()
    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [isFullPageEnabled])

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    if (isMenuPage) {
      if (targetId === 'home') {
        router.push('/full')
      } else {
        router.push(`/full#${targetId}`)
      }
      return
    }
    if (isFullPageEnabled) {
      goToSectionById(targetId)
    } else {
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }, [isMenuPage, isFullPageEnabled, goToSectionById, router])

  // Intersection Observer for normal scroll layout (mobile / standard)
  useEffect(() => {
    if (isFullPageEnabled) return
    if (query.length > 0) return

    const sections = ['hamburguesas', 'cafeteria', 'productos-full', 'sin-tacc', 'mundial']

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
  }, [isFullPageEnabled, query])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: isScrolled ? '54px' : '68px',
        background: transparent ? 'transparent' : (isScrolled ? 'rgba(6,8,15,0.4)' : 'transparent'),
        backdropFilter: transparent ? 'none' : (isScrolled ? 'blur(12px)' : 'none'),
        WebkitBackdropFilter: transparent ? 'none' : (isScrolled ? 'blur(12px)' : 'none'),
        borderBottom: transparent ? 'none' : (isScrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent'),
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <div
        className="flex justify-between items-center h-full mx-auto transition-all duration-300"
        style={{
          maxWidth: 'var(--page-max, 1920px)',
          padding: '0 var(--page-pad-x, 32px)',
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
              src="/assets/ypf imagenes/full-logomodooscuro.png"
              alt="YPF FULL"
              width={120}
              height={38}
              priority
              className="h-10 w-auto"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-white font-black text-lg">YPF FULL</span>
          )}
        </Link>

        {/* LINKS DE SECCIÓN (Desktop) — flows naturally between logo and right actions */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {[
            { id: 'mundial', label: 'Mundial' },
            { id: 'hamburguesas', label: 'Hamburguesas' },
            { id: 'cafeteria', label: 'Cafetería' },
            { id: 'productos-full', label: 'Productos Full' },
            { id: 'sin-tacc', label: 'Sin Tacc' },
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

        <div className="flex items-center justify-end flex-shrink-0 gap-2">
          {/* CTA: Ver Menú Completo */}
          {!isMenuPage && (
            <Link
              href="/full/menu"
              className="hidden md:inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,209,0,0.12)',
                border: '1px solid rgba(255,209,0,0.35)',
                color: '#FFD100',
                textDecoration: 'none',
              }}
            >
              Ver Menú Completo →
            </Link>
          )}

          <button
            onClick={() => setIsSearchExpanded(true)}
            className="flex items-center justify-center bg-transparent border-none cursor-pointer"
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
