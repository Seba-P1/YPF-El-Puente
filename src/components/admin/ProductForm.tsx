'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ImagePlus, Loader2, Save, ImageOff } from 'lucide-react'
import { toast } from 'sonner'
import { createProducto, updateProducto } from '@/lib/supabase/actions'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ImageUploader } from '@/components/admin/ImageUploader'
import type { Producto } from '@/types'

type CategoriaOption = { slug: string; nombre: string }

interface ProductFormProps {
  mode: 'create' | 'edit'
  producto?: Producto
  categorias: CategoriaOption[]
}

const BADGE_OPTIONS = [
  { value: 'none', label: 'Sin etiqueta' },
  { value: 'NUEVA', label: 'NUEVA' },
  { value: 'RECOMENDADO', label: 'RECOMENDADO' },
  { value: 'PROMO', label: 'PROMO' },
]

const fieldLabel =
  'block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5'
const selectClass =
  'h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50'

export function ProductForm({ mode, producto, categorias }: ProductFormProps) {
  const router = useRouter()

  const [nombre, setNombre] = useState(producto?.nombre ?? '')
  const [codigoPlu, setCodigoPlu] = useState(producto?.codigo_plu ?? '')
  const [categoriaSlug, setCategoriaSlug] = useState(
    producto?.categoria_slug ?? categorias[0]?.slug ?? ''
  )
  const [precio, setPrecio] = useState(
    producto?.precio && producto.precio > 0 ? String(producto.precio) : ''
  )
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '')
  const [badge, setBadge] = useState(producto?.badge ?? 'none')
  const [disponible, setDisponible] = useState(producto?.disponible ?? true)
  const [destacado, setDestacado] = useState(producto?.destacado ?? false)
  const [orden, setOrden] = useState(String(producto?.orden ?? 0))

  const [imagenUrl, setImagenUrl] = useState<string | null>(
    producto?.imagen_url ?? null
  )
  const [showUploader, setShowUploader] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return

    const precioNum = parseFloat(precio.replace(',', '.'))
    const ordenNum = parseInt(orden, 10)

    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }
    if (!codigoPlu.trim()) {
      toast.error('El código PLU es obligatorio')
      return
    }
    if (!categoriaSlug) {
      toast.error('Elegí una categoría')
      return
    }
    if (precio !== '' && (isNaN(precioNum) || precioNum < 0)) {
      toast.error('El precio no es válido')
      return
    }

    const payload = {
      codigo_plu: codigoPlu.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim() ? descripcion.trim() : null,
      categoria_slug: categoriaSlug,
      precio: isNaN(precioNum) ? 0 : precioNum,
      disponible,
      destacado,
      badge: badge === 'none' ? null : (badge as 'NUEVA' | 'RECOMENDADO' | 'PROMO'),
      orden: isNaN(ordenNum) ? 0 : ordenNum,
    }

    setSaving(true)
    try {
      if (mode === 'create') {
        const res = await createProducto(payload)
        if (!res.ok) throw new Error(res.error)
        toast.success('Producto creado')
        router.push(`/admin/productos/${res.data.id}`)
        router.refresh()
      } else if (producto) {
        const res = await updateProducto({ id: producto.id, ...payload })
        if (!res.ok) throw new Error(res.error)
        toast.success('Cambios guardados')
        router.push('/admin/productos')
        router.refresh()
      }
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
            <Link href="/admin/productos" aria-label="Volver">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'create'
                ? 'Completá los datos del producto'
                : producto?.nombre}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" type="button">
            <Link href="/admin/productos">Cancelar</Link>
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
              placeholder="Ej: Café con Leche"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="codigo" className={fieldLabel}>
                Código PLU *
              </label>
              <Input
                id="codigo"
                value={codigoPlu}
                onChange={(e) => setCodigoPlu(e.target.value)}
                placeholder="Ej: CAFE-001"
                className="font-mono"
                maxLength={64}
              />
            </div>
            <div>
              <label htmlFor="categoria" className={fieldLabel}>
                Categoría *
              </label>
              <select
                id="categoria"
                value={categoriaSlug}
                onChange={(e) => setCategoriaSlug(e.target.value)}
                className={selectClass}
              >
                {categorias.length === 0 && (
                  <option value="">Sin categorías</option>
                )}
                {categorias.map((c) => (
                  <option key={c.slug} value={c.slug} className="bg-background">
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="precio" className={fieldLabel}>
                Precio (ARS)
              </label>
              <Input
                id="precio"
                inputMode="decimal"
                value={precio}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^[\d.,]*$/.test(v)) setPrecio(v)
                }}
                placeholder="0"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Dejalo vacío o en 0 para mostrar &ldquo;Consultar precio&rdquo;.
              </p>
            </div>
            <div>
              <label htmlFor="orden" className={fieldLabel}>
                Orden
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
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Menor número aparece primero.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className={fieldLabel}>
              Descripción
            </label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción opcional del producto…"
              maxLength={1000}
              rows={4}
            />
          </div>
        </GlassCard>

        {/* Sidebar: image + status */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <span className={fieldLabel}>Imagen</span>
            <div className="relative mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-2xl border bg-muted">
              {imagenUrl ? (
                <Image
                  src={imagenUrl}
                  alt={nombre || 'Producto'}
                  fill
                  sizes="220px"
                  className="object-contain p-3"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageOff className="h-7 w-7" />
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>

            {mode === 'edit' && producto ? (
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setShowUploader(true)}
              >
                <ImagePlus />
                {imagenUrl ? 'Cambiar imagen' : 'Subir imagen'}
              </Button>
            ) : (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Guardá el producto para poder subir una imagen.
              </p>
            )}
          </GlassCard>

          <GlassCard className="space-y-5 p-6">
            <span className={fieldLabel}>Estado</span>

            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground">Disponible</span>
              <Switch checked={disponible} onCheckedChange={setDisponible} />
            </label>

            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground">Destacado</span>
              <Switch checked={destacado} onCheckedChange={setDestacado} />
            </label>

            <div>
              <label htmlFor="badge" className={fieldLabel}>
                Etiqueta
              </label>
              <select
                id="badge"
                value={badge ?? 'none'}
                onChange={(e) => setBadge(e.target.value)}
                className={selectClass}
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value} className="bg-background">
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </GlassCard>
        </div>
      </div>

      {showUploader && producto && (
        <ImageUploader
          productoId={producto.id}
          productoNombre={producto.nombre}
          imagenActual={imagenUrl}
          onUploadSuccess={(url) => setImagenUrl(url)}
          onClose={() => setShowUploader(false)}
        />
      )}
    </form>
  )
}
