'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input, textarea, or select
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return
      }

      // Check for 'g' prefix + key
      // A simple implementation without a state machine:
      // We can just rely on single key press if we want, or a sequence.
      // For sequence "g + d", "g + p", "g + c":
      // Since it's a sequence, we need to track the last key.
    }

    // Better approach: track sequence
    let lastKey = ''
    let timeout: NodeJS.Timeout

    const handleSequence = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return
      }

      if (e.key === 'g') {
        lastKey = 'g'
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          lastKey = ''
        }, 1000) // 1 second to press the next key
        return
      }

      if (lastKey === 'g') {
        switch (e.key) {
          case 'd':
            e.preventDefault()
            router.push('/admin')
            toast.info('Navegando a Dashboard')
            break
          case 'p':
            e.preventDefault()
            router.push('/admin/productos')
            toast.info('Navegando a Productos')
            break
          case 'c':
            e.preventDefault()
            router.push('/admin/categorias')
            toast.info('Navegando a Categorías')
            break
          case 'f':
            e.preventDefault()
            router.push('/admin/combustibles')
            toast.info('Navegando a Combustibles')
            break
          case 's':
            e.preventDefault()
            router.push('/admin/configuracion')
            toast.info('Navegando a Configuración')
            break
        }
        lastKey = ''
      }
    }

    window.addEventListener('keydown', handleSequence)
    return () => window.removeEventListener('keydown', handleSequence)
  }, [router])

  return null
}
