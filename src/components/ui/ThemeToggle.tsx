'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: 'rgba(128,128,128,0.1)',
        }}
      />
    )
  }

  const current = theme === 'system' ? resolvedTheme : theme
  const isDark = current === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={className}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      style={{
        width: 36,
        height: 36,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s ease, transform 0.2s ease',
        background: isDark
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.06)',
        color: isDark
          ? 'rgba(248,250,252,0.7)'
          : 'rgba(15,23,42,0.6)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark
          ? 'rgba(255,255,255,0.14)'
          : 'rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isDark
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.06)'
      }}
    >
      {/* Contenedor relativo para posicionar los iconos */}
      <div style={{ position: 'relative', width: 16, height: 16 }}>
        <Sun 
          size={16} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'all 0.5s ease',
            transform: isDark ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
            opacity: isDark ? 0 : 1
          }} 
        />
        <Moon 
          size={16} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'all 0.5s ease',
            transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
            opacity: isDark ? 1 : 0
          }} 
        />
      </div>
    </button>
  )
}
