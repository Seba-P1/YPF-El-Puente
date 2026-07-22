'use client'

import { useState, useEffect, useRef } from 'react'
import { Fuel, Save, Loader2, Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  updateCombustiblePrecio,
  updateCombustibleDisponible,
  updateCombustibleNombre,
  updateCombustibleDescripcionExtendida,
  createCombustible,
  deleteCombustible,
} from '@/lib/supabase/actions'
import type { Combustible } from '@/types'
import { toast } from 'sonner'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

/* ──────────────────────────────────────────────
   ADMIN COMBUSTIBLES — Premium Panel
   ────────────────────────────────────────────── */

export default function AdminCombustiblesPage() {
  const [combustibles, setCombustibles] = useState<Combustible[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [editedPrices, setEditedPrices] = useState<Record<string, string>>({})
  const [editedDescriptions, setEditedDescriptions] = useState<Record<string, string>>({})

  // Name editing
  const [editingNameId, setEditingNameId] = useState<string | null>(null)
  const [editingNameValue, setEditingNameValue] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  // New fuel form
  const [showNewForm, setShowNewForm] = useState(false)
  const [newFuel, setNewFuel] = useState({
    nombre: '',
    octanaje: '',
    color_hex: '#005A9C',
    precio: 0,
  })
  const [creatingFuel, setCreatingFuel] = useState(false)

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient() as any

  useEffect(() => {
    async function fetchCombustibles() {
      const { data, error } = await supabase
        .from('combustibles')
        .select('*')
        .order('orden', { ascending: true })

      if (error) {
        toast.error('Error al cargar los combustibles')
        console.error(error)
      } else {
        const combustiblesData = data as Combustible[] | null
        setCombustibles(combustiblesData ?? [])
        const prices: Record<string, string> = {}
        const descs: Record<string, string> = {}
        combustiblesData?.forEach((c) => {
          prices[c.id] = c.precio?.toString() ?? '0'
          descs[c.id] = c.descripcion_extendida ?? ''
        })
        setEditedPrices(prices)
        setEditedDescriptions(descs)
      }
      setLoading(false)
    }

    fetchCombustibles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Focus name input when editing starts
  useEffect(() => {
    if (editingNameId && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingNameId])

  /* ── Handlers ── */

  const handleSavePrice = async (combustible: Combustible) => {
    const newPrice = parseFloat(editedPrices[combustible.id] || '0')
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error('Ingresá un precio válido (número positivo)')
      return
    }

    setSavingId(combustible.id)
    try {
      const res = await updateCombustiblePrecio({ id: combustible.id, precio: newPrice })
      if (!res.ok) throw new Error(res.error)
      setCombustibles((prev) =>
        prev.map((c) => (c.id === combustible.id ? { ...c, precio: newPrice } : c))
      )
      toast.success(`Precio actualizado`)
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el precio')
    } finally {
      setSavingId(null)
    }
  }

  const handleSaveDescripcionExtendida = async (combustible: Combustible) => {
    const newDesc = editedDescriptions[combustible.id] ?? ''
    setSavingId(combustible.id)
    try {
      const res = await updateCombustibleDescripcionExtendida({
        id: combustible.id,
        descripcion_extendida: newDesc.trim() || null,
      })
      if (!res.ok) throw new Error(res.error)
      setCombustibles((prev) =>
        prev.map((c) => (c.id === combustible.id ? { ...c, descripcion_extendida: newDesc.trim() || null } : c))
      )
      toast.success('Descripción extendida actualizada')
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar la descripción extendida')
    } finally {
      setSavingId(null)
    }
  }

  const handleToggleDisponible = async (combustible: Combustible) => {
    const newValue = !combustible.disponible
    setCombustibles((prev) =>
      prev.map((c) => (c.id === combustible.id ? { ...c, disponible: newValue } : c))
    )
    try {
      const res = await updateCombustibleDisponible({ id: combustible.id, disponible: newValue })
      if (!res.ok) throw new Error(res.error)
      toast.success(`${combustible.nombre} ${newValue ? 'activado' : 'desactivado'}`)
    } catch (error: any) {
      setCombustibles((prev) =>
        prev.map((c) => (c.id === combustible.id ? { ...c, disponible: !newValue } : c))
      )
      toast.error(error.message || 'Error al actualizar disponibilidad')
    }
  }

  const handleStartEditName = (combustible: Combustible) => {
    setEditingNameId(combustible.id)
    setEditingNameValue(combustible.nombre)
  }

  const handleCancelEditName = () => {
    setEditingNameId(null)
    setEditingNameValue('')
  }

  const handleSaveName = async (id: string) => {
    if (!editingNameValue.trim()) {
      toast.error('El nombre no puede estar vacío')
      return
    }
    setSavingId(id)
    try {
      const res = await updateCombustibleNombre({ id, nombre: editingNameValue.trim() })
      if (!res.ok) throw new Error(res.error)
      setCombustibles((prev) =>
        prev.map((c) => (c.id === id ? { ...c, nombre: editingNameValue.trim() } : c))
      )
      toast.success('Nombre actualizado')
      setEditingNameId(null)
      setEditingNameValue('')
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el nombre')
    } finally {
      setSavingId(null)
    }
  }

  const handleCreateFuel = async () => {
    if (!newFuel.nombre.trim()) {
      toast.error('Ingresá un nombre para el combustible')
      return
    }
    setCreatingFuel(true)
    try {
      const res = await createCombustible({
        nombre: newFuel.nombre.trim(),
        octanaje: newFuel.octanaje.trim() || undefined,
        color_hex: newFuel.color_hex,
        precio: newFuel.precio,
        orden: combustibles.length,
      })
      if (!res.ok) throw new Error(res.error)
      // Re-fetch to get the new item with its ID
      const { data } = await supabase
        .from('combustibles')
        .select('*')
        .order('orden', { ascending: true })
      if (data) {
        setCombustibles(data as Combustible[])
        const prices: Record<string, string> = {}
        ;(data as Combustible[]).forEach((c) => {
          prices[c.id] = c.precio?.toString() ?? '0'
        })
        setEditedPrices(prices)
      }
      toast.success('Combustible creado')
      setShowNewForm(false)
      setNewFuel({ nombre: '', octanaje: '', color_hex: '#005A9C', precio: 0 })
    } catch (error: any) {
      toast.error(error.message || 'Error al crear el combustible')
    } finally {
      setCreatingFuel(false)
    }
  }

  const handleDeleteFuel = async (id: string) => {
    setSavingId(id)
    try {
      const res = await deleteCombustible({ id })
      if (!res.ok) throw new Error(res.error)
      setCombustibles((prev) => prev.filter((c) => c.id !== id))
      toast.success('Combustible eliminado')
      setDeletingId(null)
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar el combustible')
    } finally {
      setSavingId(null)
    }
  }

  /* ── Loading State ── */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  /* ── Render ── */

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5 text-foreground">
            <Fuel className="w-6 h-6 text-primary" />
            Combustibles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestioná precios, nombres y disponibilidad.
          </p>
        </div>
        <Button
          onClick={() => setShowNewForm(!showNewForm)}
          variant={showNewForm ? 'outline' : 'default'}
          size="sm"
          className="rounded-xl font-bold gap-1.5"
        >
          {showNewForm ? (
            <>
              <X className="w-4 h-4" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Agregar
            </>
          )}
        </Button>
      </div>

      {/* New Fuel Form */}
      {showNewForm && (
        <GlassCard className="p-5 space-y-4 border-primary/20">
          <h3 className="text-sm font-bold text-foreground">Nuevo Combustible</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Nombre
              </label>
              <input
                type="text"
                value={newFuel.nombre}
                onChange={(e) => setNewFuel((p) => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej: Infinia"
                className="w-full px-3 py-2 rounded-lg text-sm font-medium outline-none bg-muted/50 border focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Octanaje / Tipo
              </label>
              <input
                type="text"
                value={newFuel.octanaje}
                onChange={(e) => setNewFuel((p) => ({ ...p, octanaje: e.target.value }))}
                placeholder="Ej: 97"
                className="w-full px-3 py-2 rounded-lg text-sm font-medium outline-none bg-muted/50 border focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newFuel.color_hex}
                  onChange={(e) => setNewFuel((p) => ({ ...p, color_hex: e.target.value }))}
                  className="w-8 h-8 rounded-lg border cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {newFuel.color_hex}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Precio inicial
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newFuel.precio}
                onChange={(e) =>
                  setNewFuel((p) => ({ ...p, precio: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-3 py-2 rounded-lg text-sm font-medium outline-none bg-muted/50 border focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleCreateFuel}
              disabled={creatingFuel || !newFuel.nombre.trim()}
              size="sm"
              className="rounded-xl font-bold gap-1.5"
            >
              {creatingFuel ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Crear Combustible
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Fuel Cards */}
      <div className="space-y-2">
        {combustibles.map((combustible) => (
          <GlassCard
            key={combustible.id}
            className={`group transition-all duration-200 ${
              !combustible.disponible ? 'opacity-50 grayscale-[0.3]' : ''
            }`}
          >
            <div className="p-4 flex flex-col gap-3">
              {/* Row 1: Name + Status + Actions */}
              <div className="flex items-center gap-3">
                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm ring-2 ring-white/10"
                  style={{ backgroundColor: combustible.color_hex }}
                />

                {/* Name (editable) */}
                <div className="flex-1 min-w-0">
                  {editingNameId === combustible.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={editingNameValue}
                        onChange={(e) => setEditingNameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName(combustible.id)
                          if (e.key === 'Escape') handleCancelEditName()
                        }}
                        className="flex-1 px-2 py-1 rounded-lg text-sm font-bold outline-none bg-muted/50 border focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                        disabled={savingId === combustible.id}
                      />
                      <button
                        onClick={() => handleSaveName(combustible.id)}
                        disabled={savingId === combustible.id}
                        className="p-1 rounded-md text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEditName}
                        className="p-1 rounded-md text-muted-foreground hover:bg-muted/50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm leading-tight text-foreground truncate">
                        {combustible.nombre}
                      </h3>
                      {combustible.octanaje && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground shrink-0">
                          {combustible.octanaje}
                        </span>
                      )}
                      <button
                        onClick={() => handleStartEditName(combustible)}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        title="Editar nombre"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Status + Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      combustible.disponible
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}
                  >
                    {combustible.disponible ? 'Activo' : 'Off'}
                  </span>
                  <Switch
                    checked={combustible.disponible}
                    onCheckedChange={() => handleToggleDisponible(combustible)}
                  />
                </div>

                {/* Delete */}
                {deletingId === combustible.id ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDeleteFuel(combustible.id)}
                      disabled={savingId === combustible.id}
                      className="px-2 py-1 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {savingId === combustible.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        'Sí'
                      )}
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-2 py-1 text-xs font-bold text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingId(combustible.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                    title="Eliminar combustible"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Row 2: Price input + Save */}
              <div className="flex items-center gap-2 pl-6">
                <div className="relative flex-1 max-w-[180px]">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editedPrices[combustible.id] ?? ''}
                    onChange={(e) =>
                      setEditedPrices((prev) => ({
                        ...prev,
                        [combustible.id]: e.target.value,
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 rounded-lg font-bold text-sm outline-none transition-all bg-muted/50 border focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                    disabled={savingId === combustible.id}
                  />
                </div>
                <Button
                  onClick={() => handleSavePrice(combustible)}
                  disabled={savingId === combustible.id}
                  size="sm"
                  variant="outline"
                  className="rounded-lg font-bold px-3 h-9 gap-1.5"
                >
                  {savingId === combustible.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Guardar Precio</span>
                </Button>
              </div>

              {/* Row 3: Extended Description ("Leer más") */}
              <div className="pl-6 pt-2 space-y-1.5 border-t border-border/40 mt-1">
                <label className="text-[11px] font-semibold text-muted-foreground block">
                  Descripción Extendida ("Leer más"):
                </label>
                <div className="flex gap-2 items-start">
                  <textarea
                    rows={2}
                    value={editedDescriptions[combustible.id] ?? ''}
                    onChange={(e) =>
                      setEditedDescriptions((prev) => ({
                        ...prev,
                        [combustible.id]: e.target.value,
                      }))
                    }
                    placeholder="Texto al desplegar 'Leer más'..."
                    className="flex-1 p-2 rounded-lg text-xs font-medium outline-none bg-muted/50 border focus:border-primary focus:ring-1 focus:ring-primary text-foreground resize-y"
                    disabled={savingId === combustible.id}
                  />
                  <Button
                    onClick={() => handleSaveDescripcionExtendida(combustible)}
                    disabled={savingId === combustible.id}
                    size="sm"
                    variant="outline"
                    className="rounded-lg font-bold px-3 h-8 text-xs gap-1 self-start"
                  >
                    {savingId === combustible.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Guardar Texto</span>
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}

        {combustibles.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No hay combustibles registrados.
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="rounded-xl p-4 text-xs font-medium leading-relaxed bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
        <strong>Nota:</strong> Los precios se actualizan exclusivamente desde este panel.
        No se modifican con la carga de archivos Excel.
      </div>
    </div>
  )
}
