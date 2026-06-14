'use client'

import { useState } from 'react'
import { Tags, Loader2 } from 'lucide-react'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { updateCategoriaActiva } from '@/lib/supabase/actions'
import type { Categoria } from '@/types'

interface CategoriasClientProps {
  initialCategorias: Categoria[]
}

export function CategoriasClient({ initialCategorias }: CategoriasClientProps) {
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleToggleActiva = async (categoria: Categoria) => {
    const newValue = !categoria.activa
    setUpdatingId(categoria.id)

    // Optimistic update
    setCategorias((prev) =>
      prev.map((c) => (c.id === categoria.id ? { ...c, activa: newValue } : c))
    )

    try {
      const res = await updateCategoriaActiva({ id: categoria.id, activa: newValue })
      if (!res.ok) throw new Error(res.error)
      toast.success(`Categoría "${categoria.nombre}" ${newValue ? 'activada' : 'desactivada'}`)
    } catch (error: any) {
      // Revert on error
      setCategorias((prev) =>
        prev.map((c) => (c.id === categoria.id ? { ...c, activa: !newValue } : c))
      )
      toast.error(error.message || 'Error al actualizar estado de categoría')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <Tags className="w-8 h-8 text-primary" />
          Categorías de Productos
        </h1>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {categorias.length} categorías
        </span>
      </div>
      <p className="text-sm text-muted-foreground -mt-2">
        Habilitá o deshabilitá las categorías en la pantalla del catálogo principal de YPF.
      </p>

      <GlassCard className="overflow-hidden">
        <div className="divide-y divide-border/20">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-muted/30 ${
                !categoria.activa ? 'opacity-60 grayscale-[0.2]' : ''
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-foreground truncate">
                    {categoria.nombre}
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/30">
                    {categoria.slug}
                  </span>
                </div>
                {categoria.subtitulo && (
                  <p className="text-sm font-semibold text-primary/80">
                    {categoria.subtitulo}
                  </p>
                )}
                {categoria.descripcion && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {categoria.descripcion}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0 max-sm:w-full max-sm:justify-between">
                <div className="text-xs font-semibold text-muted-foreground">
                  Orden: <span className="font-bold text-foreground">{categoria.orden}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoria.activa ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                    {categoria.activa ? 'Activa' : 'Inactiva'}
                  </span>
                  <Switch
                    checked={categoria.activa}
                    onCheckedChange={() => handleToggleActiva(categoria)}
                    disabled={updatingId === categoria.id}
                  />
                </div>
              </div>
            </div>
          ))}

          {categorias.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No hay categorías cargadas en el sistema.
            </div>
          )}
        </div>
      </GlassCard>

      <div className="rounded-xl p-4 text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
        Nota: Al desactivar una categoría, sus productos asociados no se mostrarán en la interfaz del cliente.
      </div>
    </div>
  )
}
