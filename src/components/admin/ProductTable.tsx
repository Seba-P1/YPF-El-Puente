'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Search,
  ImageOff,
  Pencil,
  Loader2,
  ImagePlus,
} from 'lucide-react'
import {
  updateProductoDisponible,
  updateProductoBadge,
  updateProductoPrecio,
} from '@/lib/supabase/actions'
import { formatearPrecioARS } from '@/lib/excel/parser'
import type { Producto } from '@/types'
import { toast } from 'sonner'
import { ImageUploader } from './ImageUploader'

interface ProductTableProps {
  productos: Producto[]
}

const ITEMS_POR_PAGINA = 20

const CATEGORY_LABELS: Record<string, string> = {
  hamburguesas: 'Hamburguesas',
  cafeteria: 'Cafetería',
  marca_full: 'Exclusivos Full',
}

const CATEGORY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  hamburguesas: { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  cafeteria: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
  marca_full: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  NUEVA: { bg: '#FEF08A', color: '#000000' },
  RECOMENDADO: { bg: '#3B82F6', color: '#FFFFFF' },
  PROMO: { bg: '#EF4444', color: '#FFFFFF' },
}

export function ProductTable({ productos: initialProductos }: ProductTableProps) {
  const [productos, setProductos] = useState(initialProductos)
  const [filtroNombre, setFiltroNombre] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<
    'all' | 'hamburguesas' | 'cafeteria' | 'marca_full'
  >('all')
  const [filtroEstado, setFiltroEstado] = useState<
    'all' | 'active' | 'inactive' | 'noprice'
  >('all')
  const [paginaActual, setPaginaActual] = useState(1)
  const [editandoPrecio, setEditandoPrecio] = useState<{
    id: string
    valor: string
  } | null>(null)
  const [guardandoPrecioId, setGuardandoPrecioId] = useState<string | null>(null)
  const [imageUploadModal, setImageUploadModal] = useState<{
    productoId: string
    nombre: string
    imagenActual: string | null
  } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editandoPrecio?.id) {
      inputRef.current?.select()
    }
  }, [editandoPrecio?.id])

  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      const matchesSearch =
        p.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
        p.codigo_plu.toLowerCase().includes(filtroNombre.toLowerCase())
      const matchesCat =
        filtroCategoria === 'all' || p.categoria_slug === filtroCategoria
      const matchesState =
        filtroEstado === 'all' ||
        (filtroEstado === 'active' && p.disponible) ||
        (filtroEstado === 'inactive' && !p.disponible) ||
        (filtroEstado === 'noprice' && (!p.precio || p.precio === 0))
      return matchesSearch && matchesCat && matchesState
    })
  }, [productos, filtroNombre, filtroCategoria, filtroEstado])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_POR_PAGINA)
  const paginatedProducts = filteredProducts.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  )

  const handleGuardarPrecio = useCallback(
    async (id: string, valorString: string) => {
      const precio = parseFloat(valorString.replace(',', '.'))
      if (isNaN(precio) || precio <= 0) {
        toast.error('Precio inválido — ingresá un número mayor a 0')
        setEditandoPrecio(null)
        return
      }
      setGuardandoPrecioId(id)
      try {
        await updateProductoPrecio(id, precio)
        setProductos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, precio } : p))
        )
        toast.success(`Precio actualizado: ${formatearPrecioARS(precio)}`)
        setEditandoPrecio(null)
      } catch {
        toast.error('Error al actualizar el precio')
      } finally {
        setGuardandoPrecioId(null)
      }
    },
    []
  )

  const handleToggleDisponible = useCallback(
    async (id: string, currentValue: boolean) => {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, disponible: !currentValue } : p))
      )
      try {
        await updateProductoDisponible(id, !currentValue)
        toast.success(`Producto ${!currentValue ? 'activado' : 'desactivado'}`)
      } catch {
        setProductos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, disponible: currentValue } : p))
        )
        toast.error('Error al actualizar disponibilidad')
      }
    },
    []
  )

  const handleBadgeChange = useCallback(async (id: string, badge: string) => {
    const newBadge = badge === 'none' ? null : badge
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, badge: newBadge } : p))
    )
    try {
      await updateProductoBadge(id, newBadge)
      toast.success('Etiqueta actualizada')
    } catch {
      toast.error('Error al actualizar etiqueta')
    }
  }, [])

  const handleImageUploadSuccess = useCallback(
    (imagenUrl: string, imagenPath: string) => {
      if (imageUploadModal) {
        setProductos((prev) =>
          prev.map((p) =>
            p.id === imageUploadModal.productoId
              ? { ...p, imagen_url: imagenUrl, imagen_path: imagenPath }
              : p
          )
        )
      }
      setImageUploadModal(null)
    },
    [imageUploadModal]
  )

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-2.5 mb-4 bg-white border border-[#E2E8F0] p-3.5"
        style={{ borderRadius: 10 }}
      >
        <div className="relative w-[240px] max-sm:w-full">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex text-[#94A3B8]">
            <Search size={12} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o PLU..."
            value={filtroNombre}
            onChange={(e) => {
              setFiltroNombre(e.target.value)
              setPaginaActual(1)
            }}
            className="w-full h-9 text-[13px] border border-[#E2E8F0] rounded-lg pl-7 pr-2.5 outline-none focus:border-[#005A9C]"
          />
        </div>

        <select
          value={filtroCategoria}
          onChange={(e) => {
            setFiltroCategoria(e.target.value as any)
            setPaginaActual(1)
          }}
          className="w-[160px] h-9 text-[13px] border border-[#E2E8F0] rounded-lg px-2.5 outline-none bg-white text-[#334155]"
        >
          <option value="all">Todas</option>
          <option value="hamburguesas">Hamburguesas</option>
          <option value="cafeteria">Cafetería</option>
          <option value="marca_full">Exclusivos Full</option>
        </select>

        <select
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value as any)
            setPaginaActual(1)
          }}
          className="w-[140px] h-9 text-[13px] border border-[#E2E8F0] rounded-lg px-2.5 outline-none bg-white text-[#334155]"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="noprice">Sin precio</option>
        </select>

        <div className="ml-auto text-xs text-[#64748B]">
          Mostrando {filteredProducts.length} de {productos.length}
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] overflow-hidden" style={{ borderRadius: 10 }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b-2 border-[#E2E8F0]">
                <Th className="w-[60px]">Imagen</Th>
                <Th>Producto</Th>
                <Th className="w-[120px]">Categoría</Th>
                <Th className="w-[140px]">Precio</Th>
                <Th className="w-[80px]">Estado</Th>
                <Th className="w-[100px]">Badge</Th>
                <Th className="w-[90px] text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#E2E8F0] transition-colors duration-150 hover:bg-[#F8FAFC]"
                    style={{ opacity: p.disponible ? 1 : 0.6 }}
                  >
                    <Td>
                      <div className="w-11 h-11 rounded-lg border border-[#E2E8F0] overflow-hidden relative flex items-center justify-center bg-[#F1F5F9]">
                        {p.imagen_url ? (
                          <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" sizes="44px" />
                        ) : (
                          <ImageOff size={16} color="#94A3B8" />
                        )}
                      </div>
                    </Td>

                    <Td>
                      <div className="font-semibold text-[#0F172A] max-w-[220px] truncate" title={p.nombre}>
                        {p.nombre}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">{p.codigo_plu}</div>
                    </Td>

                    <Td>
                      <span
                        className="inline-block text-[11px] font-semibold px-2 py-0.5"
                        style={{
                          borderRadius: 9999,
                          backgroundColor: CATEGORY_STYLES[p.categoria_slug]?.bg ?? '#F1F5F9',
                          color: CATEGORY_STYLES[p.categoria_slug]?.color ?? '#475569',
                          border: `1px solid ${CATEGORY_STYLES[p.categoria_slug]?.border ?? '#E2E8F0'}`,
                        }}
                      >
                        {CATEGORY_LABELS[p.categoria_slug] ?? p.categoria_slug}
                      </span>
                    </Td>

                    <Td>
                      <div
                        className="inline-flex items-center gap-1.5 cursor-text group"
                        onClick={() => {
                          if (guardandoPrecioId !== p.id && editandoPrecio?.id !== p.id) {
                            setEditandoPrecio({
                              id: p.id,
                              valor: p.precio && p.precio > 0 ? String(p.precio) : '',
                            })
                          }
                        }}
                      >
                        {editandoPrecio?.id === p.id ? (
                          <>
                            <input
                              ref={inputRef}
                              type="text"
                              value={editandoPrecio.valor}
                              onChange={(e) => {
                                const val = e.target.value
                                if (/^[\d.,]*$/.test(val)) {
                                  setEditandoPrecio((prev) =>
                                    prev ? { ...prev, valor: val } : prev
                                  )
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleGuardarPrecio(p.id, editandoPrecio.valor)
                                } else if (e.key === 'Escape') {
                                  setEditandoPrecio(null)
                                }
                              }}
                              onBlur={() => {
                                if (guardandoPrecioId !== p.id) {
                                  handleGuardarPrecio(p.id, editandoPrecio.valor)
                                }
                              }}
                              disabled={guardandoPrecioId === p.id}
                              autoFocus
                              className="text-[13px] font-semibold text-[#005A9C] border-none border-b-2 border-[#005A9C] bg-transparent outline-none w-[100px] py-0.5 px-1"
                            />
                            {guardandoPrecioId === p.id && (
                              <Loader2 size={12} className="animate-spin text-[#005A9C]" />
                            )}
                          </>
                        ) : (
                          <>
                            {!p.precio || p.precio === 0 ? (
                              <span
                                className="text-[11px] font-semibold px-2 py-0.5"
                                style={{
                                  borderRadius: 9999,
                                  backgroundColor: '#FFF7ED',
                                  color: '#C2410C',
                                  border: '1px solid #FED7AA',
                                }}
                              >
                                Sin precio
                              </span>
                            ) : (
                              <span className="text-[13px] font-semibold text-[#005A9C]">
                                {formatearPrecioARS(p.precio)}
                              </span>
                            )}
                            {guardandoPrecioId === p.id ? (
                              <Loader2 size={12} className="animate-spin text-[#005A9C]" />
                            ) : (
                              <Pencil size={12} color="#94A3B8" className="opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                            )}
                          </>
                        )}
                      </div>
                    </Td>

                    <Td>
                      <button
                        onClick={() => handleToggleDisponible(p.id, p.disponible)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 border-none cursor-pointer outline-none"
                        style={{ backgroundColor: p.disponible ? '#22C55E' : '#CBD5E1' }}
                      >
                        <span
                          className="inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 shadow-sm"
                          style={{ transform: p.disponible ? 'translateX(26px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </Td>

                    <Td>
                      <select
                        value={p.badge || 'none'}
                        onChange={(e) => handleBadgeChange(p.id, e.target.value)}
                        className="text-[11px] font-semibold rounded-lg border border-[#E2E8F0] px-2 py-1 outline-none cursor-pointer max-w-[100px]"
                        style={{
                          backgroundColor: p.badge ? BADGE_STYLES[p.badge]?.bg ?? '#FFFFFF' : '#FFFFFF',
                          color: p.badge ? BADGE_STYLES[p.badge]?.color ?? '#334155' : '#94A3B8',
                        }}
                      >
                        <option value="none" style={{ color: '#94A3B8' }}>&mdash;</option>
                        <option value="NUEVA" style={{ backgroundColor: '#FEF08A', color: '#000000' }}>NUEVA</option>
                        <option value="RECOMENDADO" style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}>RECOMENDADO</option>
                        <option value="PROMO" style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}>PROMO</option>
                      </select>
                    </Td>

                    <Td className="text-right">
                      <button
                        onClick={() =>
                          setImageUploadModal({
                            productoId: p.id,
                            nombre: p.nombre,
                            imagenActual: p.imagen_url,
                          })
                        }
                        className="inline-flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#475569] cursor-pointer transition-colors duration-150 hover:border-[#005A9C] hover:text-[#005A9C]"
                      >
                        <ImagePlus size={14} />
                        Imagen
                      </button>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[13px] text-[#94A3B8]">
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-[#E2E8F0]">
            <span className="text-xs text-[#64748B]">
              Página {paginaActual} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="h-8 px-3 rounded-lg text-xs border border-[#E2E8F0] bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: paginaActual === 1 ? '#CBD5E1' : '#475569' }}
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual((p) => Math.min(totalPages, p + 1))}
                disabled={paginaActual === totalPages}
                className="h-8 px-3 rounded-lg text-xs border border-[#E2E8F0] bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: paginaActual === totalPages ? '#CBD5E1' : '#475569' }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {imageUploadModal && (
        <ImageUploader
          productoId={imageUploadModal.productoId}
          productoNombre={imageUploadModal.nombre}
          imagenActual={imageUploadModal.imagenActual}
          onUploadSuccess={handleImageUploadSuccess}
          onClose={() => setImageUploadModal(null)}
        />
      )}
    </div>
  )
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={`text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-3.5 py-2.5 text-left whitespace-nowrap ${className ?? ''}`}
      style={{ letterSpacing: '0.06em' }}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <td className={`px-3.5 py-2.5 text-[13px] text-[#334155] ${className ?? ''}`}>
      {children}
    </td>
  )
}
