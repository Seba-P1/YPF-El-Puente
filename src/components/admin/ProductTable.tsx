'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, ImageOff, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { updateProductoDisponible, updateProductoBadge } from '@/lib/supabase/actions'
import { formatearPrecioARS } from '@/lib/excel/parser'
import type { Producto } from '@/types'
import { toast } from 'sonner'
import { ImageUploader } from './ImageUploader'

interface ProductTableProps {
  productos: Producto[]
}

const ITEMS_PER_PAGE = 20

export function ProductTable({ productos: initialProductos }: ProductTableProps) {
  const [productos, setProductos] = useState(initialProductos)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterState, setFilterState] = useState('all')
  const [page, setPage] = useState(1)
  
  // Image Uploader Modal State
  const [uploaderOpen, setUploaderOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; nombre: string; imagen: string | null } | null>(null)

  // Derived state: categories
  const categories = useMemo(() => {
    const cats = new Set(productos.map((p) => p.categoria_slug))
    return Array.from(cats).sort()
  }, [productos])

  // Filtering
  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      // Search filter (name or PLU)
      const matchesSearch = 
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo_plu.toLowerCase().includes(search.toLowerCase())
      
      // Category filter
      const matchesCat = filterCat === 'all' || p.categoria_slug === filterCat
      
      // State filter
      const matchesState = 
        filterState === 'all' ||
        (filterState === 'active' && p.disponible) ||
        (filterState === 'inactive' && !p.disponible) ||
        (filterState === 'noprice' && (!p.precio || p.precio === 0))

      return matchesSearch && matchesCat && matchesState
    })
  }, [productos, search, filterCat, filterState])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  // Handlers
  const handleToggleDisponible = async (id: string, currentValue: boolean) => {
    try {
      // Optimistic update
      setProductos(prev => prev.map(p => p.id === id ? { ...p, disponible: !currentValue } : p))
      
      await updateProductoDisponible(id, !currentValue)
      toast.success(`Producto ${!currentValue ? 'activado' : 'desactivado'}`)
    } catch (error) {
      // Revert on error
      setProductos(prev => prev.map(p => p.id === id ? { ...p, disponible: currentValue } : p))
      toast.error('Error al actualizar disponibilidad')
    }
  }

  const handleBadgeChange = async (id: string, badge: string) => {
    try {
      const newBadge = badge === 'none' ? null : badge
      setProductos(prev => prev.map(p => p.id === id ? { ...p, badge: newBadge } : p))
      await updateProductoBadge(id, newBadge)
      toast.success('Etiqueta actualizada')
    } catch (error) {
      toast.error('Error al actualizar etiqueta')
    }
  }

  const handleOpenUploader = (producto: Producto) => {
    setSelectedProduct({
      id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen_url
    })
    setUploaderOpen(true)
  }

  const handleUploadSuccess = (imagenUrl: string, imagenPath: string) => {
    if (selectedProduct) {
      setProductos(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, imagen_url: imagenUrl, imagen_path: imagenPath } 
          : p
      ))
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* TOOLBAR */}
      <div className="p-6 border-b border-gray-100 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between bg-gray-50/50">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o PLU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#005A9C] focus:border-transparent outline-none text-sm transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={filterCat}
            onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#005A9C] min-w-[140px]"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterState}
            onChange={(e) => { setFilterState(e.target.value); setPage(1); }}
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#005A9C]"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Solo Activos</option>
            <option value="inactive">Solo Inactivos</option>
            <option value="noprice">Sin precio</option>
          </select>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-gray-100 bg-white flex justify-between items-center text-sm">
        <span className="text-gray-500">
          Mostrando <span className="font-bold text-gray-900">{filteredProducts.length}</span> productos
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Imagen</th>
              <th className="px-6 py-4">Producto & PLU</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Visible</th>
              <th className="px-6 py-4">Etiqueta</th>
              <th className="px-6 py-4 text-right rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => (
                <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${!p.disponible ? 'opacity-60' : ''}`}>
                  
                  {/* Image */}
                  <td className="px-6 py-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden relative flex items-center justify-center">
                      {p.imagen_url ? (
                        <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-1" sizes="48px" />
                      ) : (
                        <ImageOff className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </td>

                  {/* Name & PLU */}
                  <td className="px-6 py-3">
                    <p className="font-bold text-gray-900 leading-tight max-w-[200px] truncate" title={p.nombre}>{p.nombre}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{p.codigo_plu}</p>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
                      {p.categoria_slug}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-3">
                    {!p.precio || p.precio === 0 ? (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-md">
                        Sin Precio
                      </span>
                    ) : (
                      <span className="font-black text-[#005A9C]">{formatearPrecioARS(p.precio)}</span>
                    )}
                  </td>

                  {/* Toggle Visible */}
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggleDisponible(p.id, p.disponible)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#005A9C] focus:ring-offset-2 ${
                        p.disponible ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        p.disponible ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>

                  {/* Badge */}
                  <td className="px-6 py-3">
                    <select
                      value={p.badge || 'none'}
                      onChange={(e) => handleBadgeChange(p.id, e.target.value)}
                      className="bg-white border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-2 py-1.5 outline-none focus:border-[#005A9C]"
                    >
                      <option value="none">Sin etiqueta</option>
                      <option value="NUEVA">NUEVA</option>
                      <option value="PROMO">PROMO</option>
                      <option value="RECOMENDADO">RECOMENDADO</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleOpenUploader(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#005A9C] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Imagen
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No se encontraron productos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Página <span className="font-bold text-gray-900">{page}</span> de <span className="font-bold text-gray-900">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Image Uploader Modal */}
      {uploaderOpen && selectedProduct && (
        <ImageUploader
          productoId={selectedProduct.id}
          productoNombre={selectedProduct.nombre}
          imagenActual={selectedProduct.imagen}
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setUploaderOpen(false)}
        />
      )}
    </div>
  )
}
