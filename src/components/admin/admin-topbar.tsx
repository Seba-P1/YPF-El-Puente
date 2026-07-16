'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { CommandPaletteTrigger } from './command-palette'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function AdminTopbar() {
  const pathname = usePathname()
  // Generar breadcrumbs simples basados en el pathname
  const segments = pathname.split('/').filter(Boolean)
  // Ignorar "admin" del principio si queremos
  const breadcrumbs = segments.map((seg, i) => {
    const isLast = i === segments.length - 1
    const name = seg.charAt(0).toUpperCase() + seg.slice(1)
    return (
      <span key={seg} className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span className={isLast ? 'text-foreground font-medium' : ''}>{name}</span>
        {!isLast && <span>/</span>}
      </span>
    )
  })

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/98 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden sm:flex items-center space-x-2 ml-4 border-l border-border pl-4">
          {breadcrumbs}
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <CommandPaletteTrigger />

        <ThemeToggle className="ml-2" />
      </div>
    </header>
  )
}
