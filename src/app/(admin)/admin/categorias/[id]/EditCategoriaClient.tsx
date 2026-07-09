'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { updateCategoria } from '@/lib/supabase/actions'
import type { Categoria } from '@/types'

interface EditCategoriaClientProps {
  categoria: Categoria
}

const fieldLabel =
  'block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5'

export function EditCategoriaClient({ categoria }: EditCategoriaClientProps) {
  const router = useRouter()

  const [nombre, setNombre] = useState(categoria.nombre)
  const [descripcion, setDescripcion] = useState(categoria.descripcion ?? '')
  const [subtitulo, setSubtitulo] = useState(categoria.subtitulo ?? '')
  const [imagenFondoUrl, setImagenFondoUrl] = useState(categoria.imagen_fondo_url ?? '')
  const [orden, setOrden] = useState(String(categoria.orden))
  const [activa, setActiva] = useState(categoria.activa)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return

    const ordenNum = parseInt(orden, 10)

    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }

    setSaving(true)
    try {
      const res = await updateCategoria({
        id: categoria.id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() ? descripcion.trim() : null,
        subtitulo: subtitulo.trim() ? subtitulo.trim() : null,
        imagen_fondo_url: imagenFondoUrl.trim() ? imagenFondoUrl.trim() : null,
        orden: isNaN(ordenNum) ? 0 : ordenNum,
        activa,
      })
      if (!res.ok) throw new Error(res.error)
      toast.success(`Categoría "${nombre.trim()}" actualizada`)
      router.push('/admin/categorias')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm" type="button">
            <Link href="/admin/categorias" aria-label="Volver">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Editar categoría
            </h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded border border-border/30">
                {categoria.slug}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" type="button">
            <Link href="/admin/categorias">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            Guardar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main fields */}
        <GlassCard className="space-y-5 p-6 lg:col-span-2">
          <div>
            <label htmlFor="nombre" className={fieldLabel}>
              Nombre *
            </label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Hamburguesas"
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="subtitulo" className={fieldLabel}>
              Subtítulo
            </label>
            <Input
              id="subtitulo"
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              placeholder="Ej: Las más ricas de la ruta"
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="descripcion" className={fieldLabel}>
              Descripción
            </label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción opcional de la categoría…"
              maxLength={1000}
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="imagen_fondo" className={fieldLabel}>
              URL de imagen de fondo
            </label>
            <Input
              id="imagen_fondo"
              value={imagenFondoUrl}
              onChange={(e) => setImagenFondoUrl(e.target.value)}
              placeholder="https://…"
              type="url"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              URL de la imagen que se usará como fondo de esta categoría.
            </p>
          </div>
        </GlassCard>

        {/* Sidebar: status + order */}
        <div className="space-y-6">
          <GlassCard className="space-y-5 p-6">
            <span className={fieldLabel}>Estado</span>

            <label className="flex items-center justify-between gap-3">
              <div>
                <span className="text-sm text-foreground">Categoría activa</span>
                <p className="text-xs text-muted-foreground">
                  {activa
                    ? 'Visible en el catálogo.'
                    : 'Oculta en el catálogo.'}
                </p>
              </div>
              <Switch checked={activa} onCheckedChange={setActiva} />
            </label>
          </GlassCard>

          <GlassCard className="space-y-5 p-6">
            <span className={fieldLabel}>Orden</span>

            <div>
              <label htmlFor="orden" className="text-sm text-foreground">
                Posición
              </label>
              <Input
                id="orden"
                inputMode="numeric"
                value={orden}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^\d*$/.test(v)) setOrden(v)
                }}
                placeholder="0"
                className="mt-2"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Menor número aparece primero.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </form>
  )
}
