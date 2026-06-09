'use client'

import { useState, useEffect } from 'react'
import { Fuel, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Combustible } from '@/types'
import { toast } from 'sonner'

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

    const { error } = await supabase
      .from('combustibles')
      .update({ precio: newPrice })
      .eq('id', combustible.id)

    if (error) {
      toast.error('Error al actualizar el precio')
      console.error(error)
    } else {
      setCombustibles((prev) =>
        prev.map((c) => (c.id === combustible.id ? { ...c, precio: newPrice } : c))
      )
      toast.success(`Precio de ${combustible.nombre} actualizado`)
    }

    setSavingId(null)
  }

  const handleToggleDisponible = async (combustible: Combustible) => {
    const newValue = !combustible.disponible

    // Optimistic update
    setCombustibles((prev) =>
      prev.map((c) => (c.id === combustible.id ? { ...c, disponible: newValue } : c))
    )

    const { error } = await supabase
      .from('combustibles')
      .update({ disponible: newValue })
      .eq('id', combustible.id)

    if (error) {
      // Revert
      setCombustibles((prev) =>
        prev.map((c) => (c.id === combustible.id ? { ...c, disponible: !newValue } : c))
      )
      toast.error('Error al actualizar disponibilidad')
    } else {
      toast.success(`${combustible.nombre} ${newValue ? 'activado' : 'desactivado'}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Fuel className="w-8 h-8 text-[#005A9C]" />
          Combustibles
        </h1>
        <p className="text-gray-500 mt-1">
          Actualizá los precios de los combustibles manualmente.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {combustibles.map((combustible) => (
          <div
            key={combustible.id}
            className={`p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-opacity ${
              !combustible.disponible ? 'opacity-50' : ''
            }`}
          >
            {/* Color strip + Name */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className="w-4 h-14 rounded-full shrink-0"
                style={{ backgroundColor: combustible.color_hex }}
              />
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {combustible.nombre}
                </h3>
                <p className="text-sm text-gray-500">
                  {combustible.octanaje || 'Combustible'}
                </p>
              </div>
            </div>

            {/* Price Input + Save */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
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
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-lg outline-none focus:ring-2 focus:ring-[#005A9C] focus:border-transparent transition-all"
                  disabled={savingId === combustible.id}
                />
              </div>

              <button
                onClick={() => handleSavePrice(combustible)}
                disabled={savingId === combustible.id}
                className="px-4 py-3 bg-[#005A9C] text-white rounded-xl font-bold hover:bg-[#004a80] transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {savingId === combustible.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Guardar</span>
              </button>
            </div>

            {/* Toggle */}
            <button
              onClick={() => handleToggleDisponible(combustible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#005A9C] focus:ring-offset-2 shrink-0 ${
                combustible.disponible ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  combustible.disponible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}

        {combustibles.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No hay combustibles registrados en la base de datos.
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800 font-medium leading-relaxed">
        <strong>Nota:</strong> Los precios de combustibles se actualizan exclusivamente desde
        este panel. No se modifican con la carga de archivos Excel de YPF Central.
      </div>
    </div>
  )
}
