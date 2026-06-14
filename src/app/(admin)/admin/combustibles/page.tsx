'use client'

import { useState, useEffect } from 'react'
import { Fuel, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateCombustiblePrecio, updateCombustibleDisponible } from '@/lib/supabase/actions'
import type { Combustible } from '@/types'
import { toast } from 'sonner'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function AdminCombustiblesPage() {
  const [combustibles, setCombustibles] = useState<Combustible[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [editedPrices, setEditedPrices] = useState<Record<string, string>>({})

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
        // Initialize edited prices
        const prices: Record<string, string> = {}
        combustiblesData?.forEach((c) => {
          prices[c.id] = c.precio?.toString() ?? '0'
        })
        setEditedPrices(prices)
      }
      setLoading(false)
    }

    fetchCombustibles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      toast.success(`Precio de ${combustible.nombre} actualizado`)
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el precio')
    } finally {
      setSavingId(null)
    }
  }

  const handleToggleDisponible = async (combustible: Combustible) => {
    const newValue = !combustible.disponible

    // Optimistic update
    setCombustibles((prev) =>
      prev.map((c) => (c.id === combustible.id ? { ...c, disponible: newValue } : c))
    )

    try {
      const res = await updateCombustibleDisponible({ id: combustible.id, disponible: newValue })
      if (!res.ok) throw new Error(res.error)
      toast.success(`${combustible.nombre} ${newValue ? 'activado' : 'desactivado'}`)
    } catch (error: any) {
      // Revert
      setCombustibles((prev) =>
        prev.map((c) => (c.id === combustible.id ? { ...c, disponible: !newValue } : c))
      )
      toast.error(error.message || 'Error al actualizar disponibilidad')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
          <Fuel className="w-8 h-8 text-primary" />
          Combustibles
        </h1>
        <p className="mt-1 text-muted-foreground">
          Actualizá los precios de los combustibles manualmente.
        </p>
      </div>

      <GlassCard className="overflow-hidden">
        {combustibles.map((combustible) => (
          <div
            key={combustible.id}
            className={`p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-opacity border-b last:border-b-0 hover:bg-muted/30 ${
              !combustible.disponible ? 'opacity-50 grayscale-[0.3]' : ''
            }`}
          >
            {/* Color strip + Name */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className="w-4 h-14 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: combustible.color_hex }}
              />
              <div className="min-w-0">
                <h3 className="font-bold text-lg leading-tight text-foreground">
                  {combustible.nombre}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {combustible.octanaje || 'Combustible'}
                </p>
              </div>
            </div>

            {/* Price Input + Save */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
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
                  className="w-full pl-8 pr-4 py-3 rounded-xl font-bold text-lg outline-none transition-all bg-muted/50 border focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                  disabled={savingId === combustible.id}
                />
              </div>

              <Button
                onClick={() => handleSavePrice(combustible)}
                disabled={savingId === combustible.id}
                size="lg"
                className="rounded-xl font-bold px-6 h-12"
              >
                {savingId === combustible.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span className="hidden sm:inline ml-2">Guardar</span>
              </Button>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${combustible.disponible ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                {combustible.disponible ? 'Activo' : 'Desactivado'}
              </span>
              <Switch
                checked={combustible.disponible}
                onCheckedChange={() => handleToggleDisponible(combustible)}
              />
            </div>
          </div>
        ))}

        {combustibles.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No hay combustibles registrados en la base de datos.
          </div>
        )}
      </GlassCard>

      <div className="rounded-2xl p-6 text-sm font-medium leading-relaxed bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
        <strong>Nota:</strong> Los precios de combustibles se actualizan exclusivamente desde
        este panel. No se modifican con la carga de archivos Excel de YPF Central.
      </div>
    </div>
  )
}
