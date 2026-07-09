'use client'

import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { Loader2, Pencil, Trash2, Plus, X, Link2, Link2Off } from 'lucide-react'
import { upsertProductoCurado, deleteProductoCurado, updateCategoriaActivaPorSlug, updateProductoDisponible, getProductosCurados } from '@/lib/supabase/actions'
import { CuratedProductImage } from '@/components/public/CuratedProductImage'
import type { Producto } from '@/lib/supabase/types'

const SECCIONES = [
  { slug: 'full_hamburguesas', label: 'Hamburguesas' },
  { slug: 'full_cafeteria',    label: 'Cafetería' },
  { slug: 'marca_full',        label: 'Productos Full' },
  { slug: 'full_sin_tacc',     label: 'Sin Tacc' },
  { slug: 'full_mundial',      label: 'Mundial' },
] as const

type FormState = {
  id: string | null
  nombre: string
  codigo_plu: string
  precio: string
  codigo_ypf: string
}

const initialForm: FormState = { id: null, nombre: '', codigo_plu: '', precio: '', codigo_ypf: '' }

export function FullPrincipalManager({ initialData }: { initialData: Record<string, Producto[]> }) {
  const [seccionActiva, setSeccionActiva] = useState<string>(SECCIONES[0].slug)
  const [productosPorSeccion, setProductosPorSeccion] = useState<Record<string, Producto[]>>(initialData)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [seccionesStatus, setSeccionesStatus] = useState<Record<string, boolean>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const productos = productosPorSeccion[seccionActiva] ?? []

  const refreshSeccion = useCallback(async (slug: string) => {
    const result = await getProductosCurados({ categoriaSlug: slug })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setProductosPorSeccion(prev => ({ ...prev, [slug]: result.data }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (guardando) return

    const nombre = form.nombre.trim()
    const codigo_plu = form.codigo_plu.trim()
    const precioNum = parseFloat(form.precio.replace(',', '.'))

    if (!nombre) { toast.error('El nombre es obligatorio'); return }
    if (!codigo_plu) { toast.error('El código es obligatorio'); return }
    if (isNaN(precioNum) || precioNum < 0) { toast.error('El precio no es válido'); return }

    setGuardando(true)
    const result = await upsertProductoCurado({
      codigo_plu,
      nombre,
      precio: precioNum,
      categoria_slug: seccionActiva,
      codigo_ypf: form.codigo_ypf.trim() || null,
    })
    if (!result.ok) {
      toast.error(result.error)
      setGuardando(false)
      return
    }
    toast.success(editandoId ? 'Producto actualizado' : 'Producto agregado')
    setForm(initialForm)
    setEditandoId(null)
    setModalOpen(false)
    refreshSeccion(seccionActiva)
    setGuardando(false)
  }

  const handleEditar = (p: Producto) => {
    setForm({
      id: p.id,
      nombre: p.nombre,
      codigo_plu: p.codigo_plu,
      precio: String(p.precio),
      codigo_ypf: p.codigo_ypf || '',
    })
    setEditandoId(p.id)
    setModalOpen(true)
  }

  const handleCancelEdit = () => {
    setForm(initialForm)
    setEditandoId(null)
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteProductoCurado({ id })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success('Producto eliminado')
    setDeleteConfirm(null)
    refreshSeccion(seccionActiva)
  }

  const handleToggleDisponible = async (id: string, disponible: boolean) => {
    const result = await updateProductoDisponible({ id, disponible })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(disponible ? 'Producto activado' : 'Producto desactivado')
    refreshSeccion(seccionActiva)
  }

  const handleToggleSeccion = async (slug: string, activa: boolean) => {
    const result = await updateCategoriaActivaPorSlug({ slug, activa })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setSeccionesStatus(prev => ({ ...prev, [slug]: activa }))
    toast.success(activa ? 'Sección activada en la portada' : 'Sección desactivada de la portada')
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {SECCIONES.map((s) => (
          <button
            key={s.slug}
            onClick={() => { setSeccionActiva(s.slug); setForm(initialForm); setEditandoId(null) }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
            style={{
              background: seccionActiva === s.slug ? 'var(--ypf-blue)' : 'var(--bg-card-hover, rgba(255,255,255,0.06))',
              color: seccionActiva === s.slug ? '#FFFFFF' : 'var(--text-muted, #aaa)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Form — add new products */}
      <form onSubmit={handleSubmit} className="rounded-xl p-5 border" style={{ background: 'var(--bg-card, #111)', borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Nombre</label>
            <input
              value={form.nombre ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Fullbo"
              className="h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Código</label>
            <input
              value={form.codigo_plu ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, codigo_plu: e.target.value }))}
              placeholder="Ej: burger-1"
              className="h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 font-mono"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Debe coincidir con el nombre del archivo de imagen</p>
          </div>
          <div className="w-[120px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.precio ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, precio: e.target.value }))}
              placeholder="0"
              className="h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <div className="w-[140px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Código YPF <span className="normal-case font-normal text-muted-foreground/70">(opcional)</span></label>
            <input
              value={form.codigo_ypf ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, codigo_ypf: e.target.value }))}
              placeholder="Ej: 02131"
              className="h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 font-mono"
            />
            <p className="mt-1 text-[10px] text-muted-foreground/70">Sincroniza solo el precio</p>
          </div>
          <button
            type="submit"
            disabled={guardando}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white transition-all cursor-pointer disabled:opacity-50"
            style={{ background: 'var(--ypf-blue)' }}
          >
            {guardando ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Agregar producto
          </button>
        </div>
      </form>

      {/* Products table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}>
          <h3 className="text-sm font-semibold text-foreground">
            {SECCIONES.find(s => s.slug === seccionActiva)?.label} — {productos.length} productos
          </h3>
          {/* Section active toggle */}
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Sección activa</span>
            <button
              role="switch"
              aria-checked={seccionesStatus[seccionActiva] ?? true}
              onClick={() => handleToggleSeccion(seccionActiva, !(seccionesStatus[seccionActiva] ?? true))}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer"
              style={{ background: (seccionesStatus[seccionActiva] ?? true) ? 'var(--ypf-blue)' : 'rgba(255,255,255,0.15)' }}
            >
              <span
                className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
                style={{ transform: (seccionesStatus[seccionActiva] ?? true) ? 'translateX(18px)' : 'translateX(3px)' }}
              />
            </button>
          </label>
        </div>

        {productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-lg mb-1">Todavía no cargaste productos en esta sección.</p>
            <p className="text-sm">Usá el formulario de arriba para agregar el primero.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted-foreground border-b" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.06))' }}>
                  <th className="text-left px-4 py-3 font-semibold w-14">Img</th>
                  <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                  <th className="text-left px-4 py-3 font-semibold font-mono">Código</th>
                  <th className="text-right px-4 py-3 font-semibold">Precio</th>
                  <th className="text-center px-4 py-3 font-semibold w-28">Sync YPF</th>
                  <th className="text-center px-4 py-3 font-semibold w-24">Disponible</th>
                  <th className="text-center px-4 py-3 font-semibold w-24">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} className="border-b text-foreground transition-colors hover:bg-white/[0.02]" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.04))' }}>
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/20">
                        <CuratedProductImage
                          codigo={p.codigo_plu}
                          categoriaSlug={p.categoria_slug}
                          size={48}
                          productoNombre={p.nombre}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{p.nombre}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.codigo_plu}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      ${p.precio > 0 ? p.precio.toLocaleString('es-AR') : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.codigo_ypf ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" title={`Código YPF: ${p.codigo_ypf}`}>
                          <Link2 size={10} />
                          {p.codigo_ypf}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted/50 text-muted-foreground border border-muted">
                          <Link2Off size={10} />
                          Sin sincronizar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        role="switch"
                        aria-checked={p.disponible}
                        onClick={() => handleToggleDisponible(p.id, !p.disponible)}
                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer"
                        style={{ background: p.disponible ? 'var(--ypf-blue)' : 'rgba(255,255,255,0.15)' }}
                      >
                        <span
                          className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
                          style={{ transform: p.disponible ? 'translateX(18px)' : 'translateX(3px)' }}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditar(p)}
                          className="p-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil size={14} className="text-muted-foreground" />
                        </button>
                        {deleteConfirm === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-2 py-1 rounded text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
                            >
                              Eliminar
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="p-1.5 rounded-md hover:bg-red-500/20 transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancelEdit} />
          <div className="relative w-full max-w-lg mx-4 rounded-xl border shadow-2xl" style={{ background: 'var(--bg-card, #111)', borderColor: 'var(--border-color, rgba(255,255,255,0.1))' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}>
              <h3 className="text-base font-semibold text-foreground">Editar producto</h3>
              <button onClick={handleCancelEdit} className="p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Nombre</label>
                <input
                  value={form.nombre ?? ''}
                  onChange={(e) => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Código</label>
                <input
                  value={form.codigo_plu ?? ''}
                  onChange={(e) => setForm(prev => ({ ...prev, codigo_plu: e.target.value }))}
                  className="h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.precio ?? ''}
                  onChange={(e) => setForm(prev => ({ ...prev, precio: e.target.value }))}
                  className="h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Código YPF <span className="normal-case font-normal text-muted-foreground/70">(opcional)</span>
                </label>
                <input
                  value={form.codigo_ypf ?? ''}
                  onChange={(e) => setForm(prev => ({ ...prev, codigo_ypf: e.target.value }))}
                  placeholder="Ej: 02131"
                  className="h-9 w-full text-sm rounded-lg border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 font-mono"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  El código real que usa YPF Central para este producto en el archivo de precios. Si lo completás, el precio se actualiza solo al subir un Excel nuevo — el nombre y la imagen no se tocan.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={guardando}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-white transition-all cursor-pointer disabled:opacity-50"
                  style={{ background: 'var(--ypf-blue)' }}
                >
                  {guardando ? <Loader2 size={14} className="animate-spin" /> : null}
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="h-9 px-4 rounded-lg text-sm font-medium border cursor-pointer"
                  style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.1))' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
