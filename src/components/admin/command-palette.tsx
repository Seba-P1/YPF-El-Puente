'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Search, Package, Tags, Fuel, Settings, History, Activity } from 'lucide-react'

export function CommandPaletteTrigger() {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('open-command-palette'))
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="search">
      <input 
        type="text" 
        className="search__input" 
        placeholder="Buscar..." 
        onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
        readOnly
      />
      <button 
        className="search__button"
        onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
        aria-label="Buscar"
      >
        <svg className="search__icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
        </svg>
      </button>
    </div>
  )
}

export function CommandPalette({ productos = [] }: { productos?: any[] }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    const customOpen = () => setOpen(true)

    document.addEventListener('keydown', down)
    document.addEventListener('open-command-palette', customOpen)
    
    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('open-command-palette', customOpen)
    }
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Buscar productos, páginas o configuración..." />
        <CommandList>
          <CommandEmpty>No hay resultados.</CommandEmpty>
          
          <CommandGroup heading="Catálogo">
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/productos'))}>
              <Package className="mr-2 h-4 w-4" />
              <span>Gestión de Productos</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/categorias'))}>
              <Tags className="mr-2 h-4 w-4" />
              <span>Categorías</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/combustibles'))}>
              <Fuel className="mr-2 h-4 w-4" />
              <span>Combustibles</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Sistema">
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/configuracion'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/historial'))}>
              <History className="mr-2 h-4 w-4" />
              <span>Historial Excel</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/logs'))}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Logs de Auditoría</span>
            </CommandItem>
          </CommandGroup>
          
          {productos.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Productos (Buscar)">
                {productos.map((producto: any) => (
                  <CommandItem 
                    key={producto.id} 
                    value={`${producto.nombre || 'Producto'} ${producto.codigo_plu || ''}`}
                    onSelect={() => runCommand(() => router.push(`/admin/productos`))}
                  >
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{producto.nombre || `Producto ${producto.codigo_plu}`}</span>
                    {producto.codigo_plu && (
                      <span className="ml-2 text-xs text-muted-foreground border px-1.5 py-0.5 rounded">
                        PLU: {producto.codigo_plu}
                      </span>
                    )}
                    <span className="ml-auto text-muted-foreground text-xs font-medium">
                      ${producto.precio}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
