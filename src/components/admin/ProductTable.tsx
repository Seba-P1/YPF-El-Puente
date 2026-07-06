'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  ImageOff,
  Pencil,
  Loader2,
  ImagePlus,
  MoreVertical,
  Copy,
  Trash2,
  Power,
  PowerOff,
} from 'lucide-react'
import {
  updateProductoDisponible,
  updateProductoBadge,
  updateProductoPrecio,
  duplicateProducto,
  deleteProducto,
  bulkUpdateDisponible,
} from '@/lib/supabase/actions'
import { formatearPrecioARS } from '@/lib/excel/parser'
import type { Producto } from '@/types'
import { toast } from 'sonner'
import { ImageUploader } from './ImageUploader'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductTableProps {
  productos: Producto[]
}

const ITEMS_POR_PAGINA = 20

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  comidas_calientes: { bg: 'bg-orange-500/10 dark:bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400' },
  comidas_frias: { bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', text: 'text-cyan-600 dark:text-cyan-400' },
  cafeteria: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
  panaderia: { bg: 'bg-yellow-500/10 dark:bg-yellow-500/20', text: 'text-yellow-600 dark:text-yellow-400' },
  combos: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400' },
  marca_full: { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
  sin_categoria: { bg: 'bg-gray-500/10 dark:bg-gray-500/20', text: 'text-gray-600 dark:text-gray-400' },
}

const CATEGORY_LABELS: Record<string, string> = {
  comidas_calientes: 'Comidas Calientes',
  comidas_frias: 'Comidas Frías',
  cafeteria: 'Cafetería',
  panaderia: 'Panadería',
  combos: 'Combos',
  marca_full: 'Marca Full',
  sin_categoria: 'Sin Categoría',
}

export function ProductTable({ productos: initialProductos }: ProductTableProps) {
  const [productos, setProductos] = useState(initialProductos)
  const [filtroNombre, setFiltroNombre] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('all')
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
  const [confirmDelete, setConfirmDelete] = useState<Producto | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)
  const [bulkUpdating, setBulkUpdating] = useState(false)

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
        const res = await updateProductoPrecio({ id, precio })
        if (!res.ok) throw new Error(res.error)

        setProductos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, precio } : p))
        )
        toast.success(`Precio actualizado: ${formatearPrecioARS(precio)}`)
        setEditandoPrecio(null)
      } catch (error: any) {
        toast.error(error.message || 'Error al actualizar el precio')
      } finally {
        setGuardandoPrecioId(null)
      }
    },
    []
  )

  const handleToggleDisponible = useCallback(
    async (id: string, currentValue: boolean) => {
      // Optimistic update
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, disponible: !currentValue } : p))
      )
      try {
        const res = await updateProductoDisponible({ id, disponible: !currentValue })
        if (!res.ok) throw new Error(res.error)
        toast.success(`Producto ${!currentValue ? 'activado' : 'desactivado'}`)
      } catch (error: any) {
        // Revert on error
        setProductos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, disponible: currentValue } : p))
        )
        toast.error(error.message || 'Error al actualizar disponibilidad')
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
      const res = await updateProductoBadge({ id, badge: newBadge })
      if (!res.ok) throw new Error(res.error)
      toast.success('Etiqueta actualizada')
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar etiqueta')
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

  const handleDuplicate = useCallback(
    async (producto: Producto) => {
      setDuplicatingId(producto.id)
      try {
        const res = await duplicateProducto({ id: producto.id })
        if (!res.ok) throw new Error(res.error)
        setProductos((prev) => [res.data as Producto, ...prev])
        toast.success(`"${producto.nombre}" duplicado`, {
          description: 'Se creó una copia desactivada. Editala para publicarla.',
        })
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Error al duplicar el producto'
        )
      } finally {
        setDuplicatingId(null)
      }
    },
    []
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      const res = await deleteProducto({ id: confirmDelete.id })
      if (!res.ok) throw new Error(res.error)
      setProductos((prev) => prev.filter((p) => p.id !== confirmDelete.id))
      toast.success(`"${confirmDelete.nombre}" eliminado`)
      setConfirmDelete(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar el producto'
      )
    } finally {
      setDeleting(false)
    }
  }, [confirmDelete])

  const handleBulkToggle = useCallback(async (disponible: boolean) => {
    setBulkUpdating(true)
    // Optimistic
    setProductos((prev) => prev.map((p) => ({ ...p, disponible })))
    try {
      const res = await bulkUpdateDisponible({ disponible })
      if (!res.ok) throw new Error(res.error)
      toast.success(
        disponible
          ? `Todos los productos activados`
          : `Todos los productos desactivados`
      )
    } catch (error: any) {
      // Revert
      setProductos(initialProductos)
      toast.error(error.message || 'Error al actualizar')
    } finally {
      setBulkUpdating(false)
    }
  }, [initialProductos])

  return (
    <div className="space-y-4">
      <GlassCard className="p-4 flex flex-wrap items-center gap-4">
        <div className="relative w-[280px] max-sm:w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o PLU..."
            value={filtroNombre}
            onChange={(e) => {
              setFiltroNombre(e.target.value)
              setPaginaActual(1)
            }}
            className="pl-9 h-9"
          />
        </div>

        <select
          value={filtroCategoria}
          onChange={(e) => {
            setFiltroCategoria(e.target.value)
            setPaginaActual(1)
          }}
          className="h-9 w-[180px] text-sm rounded-md border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all" className="bg-background">Todas las categorías</option>
          <option value="comidas_calientes" className="bg-background">Comidas Calientes</option>
          <option value="comidas_frias" className="bg-background">Comidas Frías</option>
          <option value="cafeteria" className="bg-background">Cafetería</option>
          <option value="panaderia" className="bg-background">Panadería</option>
          <option value="combos" className="bg-background">Combos</option>
          <option value="marca_full" className="bg-background">Marca Full</option>
          <option value="sin_categoria" className="bg-background">Sin Categoría</option>
        </select>

        <select
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value as any)
            setPaginaActual(1)
          }}
          className="h-9 w-[160px] text-sm rounded-md border border-input bg-transparent px-3 py-1 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all" className="bg-background">Cualquier estado</option>
          <option value="active" className="bg-background">Activos</option>
          <option value="inactive" className="bg-background">Inactivos</option>
          <option value="noprice" className="bg-background">Sin precio</option>
        </select>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkToggle(true)}
              disabled={bulkUpdating}
              className="h-8 gap-1.5 text-xs bg-blue-600/10 border-blue-600/30 text-blue-500 hover:bg-blue-600/20 hover:text-blue-400"
            >
              {bulkUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Power className="h-3 w-3" />}
              Activar todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkToggle(false)}
              disabled={bulkUpdating}
              className="h-8 gap-1.5 text-xs"
            >
              {bulkUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <PowerOff className="h-3 w-3" />}
              Desactivar todos
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} de {productos.length}
          </span>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[70px]">Imagen</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="w-[150px]">Categoría</TableHead>
                <TableHead className="w-[140px]">Precio</TableHead>
                <TableHead className="w-[100px]">Estado</TableHead>
                <TableHead className="w-[140px]">Etiqueta</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((p) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: p.disponible ? 1 : 0.6, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key={p.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <TableCell>
                        <div className="w-12 h-12 rounded-md overflow-hidden relative flex items-center justify-center border bg-muted">
                          {p.imagen_url ? (
                            <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" sizes="48px" />
                          ) : (
                            <ImageOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium max-w-[250px] truncate" title={p.nombre}>
                          {p.nombre}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground mt-1">
                          {p.codigo_plu}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${CATEGORY_STYLES[p.categoria_slug]?.bg} ${CATEGORY_STYLES[p.categoria_slug]?.text} border-none font-medium`}
                        >
                          {CATEGORY_LABELS[p.categoria_slug] ?? p.categoria_slug}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div
                          className="inline-flex items-center gap-2 cursor-text group min-h-[32px]"
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
                            <div className="flex items-center gap-2">
                              <Input
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
                                className="w-24 h-8 text-sm font-medium focus-visible:ring-1"
                              />
                              {guardandoPrecioId === p.id && (
                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                              )}
                            </div>
                          ) : (
                            <>
                              {!p.precio || p.precio === 0 ? (
                                <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none">
                                  Sin precio
                                </Badge>
                              ) : (
                                <span className="text-sm font-semibold text-primary">
                                  {formatearPrecioARS(p.precio)}
                                </span>
                              )}
                              {guardandoPrecioId === p.id ? (
                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                              ) : (
                                <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${p.disponible ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                            {p.disponible ? 'Activo' : 'Desactivado'}
                          </span>
                          <Switch
                            checked={p.disponible}
                            onCheckedChange={() => handleToggleDisponible(p.id, p.disponible)}
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <select
                          value={p.badge || 'none'}
                          onChange={(e) => handleBadgeChange(p.id, e.target.value)}
                          className={`text-xs font-semibold rounded-md px-2 py-1 outline-none cursor-pointer border shadow-sm ${
                            p.badge === 'NUEVA' ? 'bg-yellow-200 text-yellow-900 border-yellow-300' :
                            p.badge === 'RECOMENDADO' ? 'bg-blue-500 text-white border-blue-600' :
                            p.badge === 'PROMO' ? 'bg-red-500 text-white border-red-600' :
                            'bg-transparent border-input text-muted-foreground'
                          }`}
                        >
                          <option value="none" className="bg-background text-foreground">&mdash;</option>
                          <option value="NUEVA" className="bg-background text-foreground">NUEVA</option>
                          <option value="RECOMENDADO" className="bg-background text-foreground">RECOMENDADO</option>
                          <option value="PROMO" className="bg-background text-foreground">PROMO</option>
                        </select>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Acciones de ${p.nombre}`}
                            >
                              {duplicatingId === p.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreVertical className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/productos/${p.id}`}>
                                <Pencil />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleDuplicate(p)}>
                              <Copy />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                setImageUploadModal({
                                  productoId: p.id,
                                  nombre: p.nombre,
                                  imagenActual: p.imagen_url,
                                })
                              }
                            >
                              <ImagePlus />
                              Cambiar foto
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => setConfirmDelete(p)}
                            >
                              <Trash2 />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No se encontraron productos.
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-xs text-muted-foreground">
              Página {paginaActual} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual((p) => Math.min(totalPages, p + 1))}
                disabled={paginaActual === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {imageUploadModal && (
        <ImageUploader
          productoId={imageUploadModal.productoId}
          productoNombre={imageUploadModal.nombre}
          imagenActual={imageUploadModal.imagenActual}
          onUploadSuccess={handleImageUploadSuccess}
          onClose={() => setImageUploadModal(null)}
        />
      )}

      <Dialog
        open={confirmDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setConfirmDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
            <DialogDescription>
              ¿Seguro que querés eliminar{' '}
              <span className="font-semibold text-foreground">
                {confirmDelete?.nombre}
              </span>
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={deleting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
