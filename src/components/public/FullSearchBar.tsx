'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchStore } from '@/stores/search'
import { useFullPageStore } from '@/stores/fullpage'

export function FullSearchBar() {
  const [activePill, setActivePill] = useState('todos')
  const [showSearch, setShowSearch] = useState(false)
  const query = useSearchStore((state) => state.query)
  
  const isFullPageEnabled = useFullPageStore((state) => state.isEnabled)
  const currentSection = useFullPageStore((state) => state.currentSection)

  // Sync state with fullpage slide changes on desktop
  useEffect(() => {
    if (!isFullPageEnabled || query.length > 0) return

    // Show searchbar pills on category slides (indices 1-5)
    const isCategorySlide = currentSection >= 1 && currentSection <= 5
    setShowSearch(isCategorySlide)

    if (currentSection === 1) setActivePill('mundial')
    if (currentSection === 2) setActivePill('hamburguesas')
    if (currentSection === 3) setActivePill('cafeteria')
    if (currentSection === 4) setActivePill('productos-full')
    if (currentSection === 5) setActivePill('sin-tacc')
  }, [isFullPageEnabled, currentSection, query])
  
  // Intersection Observer para actualizar el pill activo basado en scroll (solo en mobile/normal scroll)
  useEffect(() => {
    if (isFullPageEnabled) return // Ignorar si el fullpage está activo
    if (query.length > 0) return // No espiar secciones si estamos buscando
    
    const sections = ['mundial', 'hamburguesas', 'cafeteria', 'productos-full', 'sin-tacc']
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePill(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    
    // Observer para la barra superior flotante
    const handleScroll = () => {
      setShowSearch(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Un observer para el "top"
    const topObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && query.length === 0) {
          setActivePill('todos')
        }
      },
      { threshold: 0.1 }
    )
    
    const topEl = document.getElementById('home-hero')
    if (topEl) topObserver.observe(topEl)

    return () => {
      observer.disconnect()
      topObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [query, isFullPageEnabled])

  const handlePillClick = (id: string) => {
    const setQuery = useSearchStore.getState().setQuery
    if (query.length > 0) {
      setQuery('') // Si estábamos buscando, limpiamos para poder ver las secciones
    }
    
    setActivePill(id)
    
    if (isFullPageEnabled) {
      useFullPageStore.getState().goToSectionById(id)
    } else {
      if (id === 'todos') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const pills = [
    { id: 'todos', label: 'Todos' },
    { id: 'mundial', label: '⚽ Mundial' },
    { id: 'hamburguesas', label: '🍔 Hamburguesas' },
    { id: 'cafeteria', label: '☕ Cafetería' },
    { id: 'productos-full', label: '⭐ Exclusivos' },
    { id: 'sin-tacc', label: '🌾 Sin Tacc' }
  ]

  return (
    <div 
      className={`fixed z-40 w-full transition-all duration-500 ease-in-out md:hidden ${showSearch ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'}`}
      style={{
        top: '68px',
        background: 'transparent',
        borderBottom: 'none',
        padding: '12px var(--page-pad-x, 24px)',
        pointerEvents: 'none' // Evita que la franja invisible bloquee clics
      }}
    >
      <div 
        className="mx-auto flex flex-col md:flex-row gap-4 items-center"
        style={{ maxWidth: 'var(--page-max, 1280px)', pointerEvents: 'auto' }}
      >
        {/* PILLS DE CATEGORÍA */}
        <div className="flex gap-2 overflow-x-auto w-full flex-grow hide-scrollbar">
          {pills.map((pill) => {
            const isActive = activePill === pill.id
            return (
              <button
                key={pill.id}
                onClick={() => handlePillClick(pill.id)}
                className="relative px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200"
                style={!isActive ? {
                  background: 'rgba(0,0,0,0.75)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)'
                } : {
                  background: 'var(--ypf-blue)',
                  border: '1px solid transparent',
                  color: 'white',
                  boxShadow: '0 0 16px var(--ypf-blue-glow)'
                }}
              >
                <span className="relative z-10">{pill.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activePillFull"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--ypf-blue)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
