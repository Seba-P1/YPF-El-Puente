'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Producto } from '@/lib/supabase/types'

interface FullSearchBarProps {
  productos: Producto[]
  onFilter: (filtrados: Producto[], query: string) => void
}

export function FullSearchBar({ productos, onFilter }: FullSearchBarProps) {
  const [query, setQuery] = useState('')
  const [activePill, setActivePill] = useState('todos')
  
  // Ref para el timeout del debounce
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Intersection Observer para actualizar el pill activo basado en scroll
  useEffect(() => {
    if (query.length > 0) return // No espiar secciones si estamos buscando
    
    const sections = ['hamburguesas', 'cafeteria', 'productos-full']
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Solo si intersecta y estamos bajando, o si estamos muy arriba marcar 'todos'
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
    }
  }, [query])

  // Lógica de búsqueda con debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const searchTerm = query.toLowerCase().trim()
      
      if (searchTerm === '') {
        onFilter(productos, '')
      } else {
        const filtrados = productos.filter(p => 
          p.nombre.toLowerCase().includes(searchTerm) || 
          (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm))
        )
        onFilter(filtrados, searchTerm)
      }
    }, 200)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, productos, onFilter])

  const handleClear = () => {
    setQuery('')
  }

  const handlePillClick = (id: string) => {
    if (query.length > 0) {
      handleClear() // Si estábamos buscando, limpiamos para poder ver las secciones
    }
    
    setActivePill(id)
    
    if (id === 'todos') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const pills = [
    { id: 'todos', label: 'Todos' },
    { id: 'hamburguesas', label: '🍔 Hamburguesas' },
    { id: 'cafeteria', label: '☕ Cafetería' },
    { id: 'productos-full', label: '⭐ Exclusivos' }
  ]

  return (
    <div 
      className="sticky z-40 w-full"
      style={{
        top: '68px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '12px var(--page-pad-x, 24px)'
      }}
    >
      <div 
        className="mx-auto flex flex-col md:flex-row gap-4 items-center"
        style={{ maxWidth: 'var(--page-max, 1280px)' }}
      >
        {/* BUSCADOR */}
        <div className="relative flex-shrink-0 w-full md:w-[260px]">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2" 
            style={{ color: 'rgba(255,255,255,0.4)' }}
          />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm text-white placeholder-white/35 rounded-full outline-none transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,112,192,0.6)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
            }}
          />
          {query.length > 0 && (
            <button 
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
            </button>
          )}
        </div>

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
                  background: 'rgba(255,255,255,0.06)',
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
