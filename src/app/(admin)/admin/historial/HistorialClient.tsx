'use client'

import { useState, useMemo, Fragment } from 'react'
import { History, Search, FileText, ChevronDown, ChevronUp, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface HistorialClientProps {
  initialUploads: any[]
}

export function HistorialClient({ initialUploads }: HistorialClientProps) {
  const [uploads] = useState<any[]>(initialUploads)
  const [filterSearch, setFilterSearch] = useState('')
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null)

  const filteredUploads = useMemo(() => {
    return uploads.filter((u) => {
      const searchLower = filterSearch.toLowerCase()
      const matchesFileName = u.nombre_archivo?.toLowerCase().includes(searchLower)
      const matchesUser = u.subido_por?.toLowerCase().includes(searchLower)
      return matchesFileName || matchesUser
    })
  }, [uploads, filterSearch])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <History className="w-8 h-8 text-primary" />
          Historial de Importaciones
        </h1>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {filteredUploads.length} cargas
        </span>
      </div>
      <p className="text-sm text-muted-foreground -mt-2">
        Historial de actualizaciones masivas de precios de productos subidos mediante archivos Excel de YPF Central.
      </p>

      <GlassCard className="p-4 flex items-center gap-4">
        <div className="relative w-[320px] max-sm:w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre de archivo o usuario..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Fecha de Carga</TableHead>
                <TableHead>Nombre del Archivo</TableHead>
                <TableHead className="w-[120px] text-center">Filas Totales</TableHead>
                <TableHead className="w-[120px] text-center">Nuevos</TableHead>
                <TableHead className="w-[120px] text-center">Actualizados</TableHead>
                <TableHead className="w-[120px] text-center">Errores</TableHead>
                <TableHead className="w-[120px] text-right">Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUploads.map((upload) => {
                const isSelected = selectedUploadId === upload.id
                const hasErrors = upload.productos_error > 0
                return (
                  <Fragment key={upload.id}>
                    <TableRow
                      className={`hover:bg-muted/30 cursor-pointer ${
                        isSelected ? 'bg-muted/50 border-b border-border/20' : ''
                      }`}
                      onClick={() => setSelectedUploadId(isSelected ? null : upload.id)}
                    >
                      <TableCell className="font-semibold text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(upload.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="font-semibold text-sm text-foreground truncate max-w-[300px]" title={upload.nombre_archivo}>
                            {upload.nombre_archivo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold text-sm text-foreground">
                        {upload.total_filas}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                          {upload.productos_nuevos}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold border border-blue-500/20">
                          {upload.productos_actualizados}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                          hasErrors
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : 'bg-muted text-muted-foreground border-border/20'
                        }`}>
                          {upload.productos_error}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedUploadId(isSelected ? null : upload.id)
                          }}
                        >
                          {isSelected ? (
                            <>
                              Ocultar <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Ver reporte <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </TableCell>
                    </TableRow>

                    {isSelected && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={7} className="p-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="p-4 rounded-xl border border-border/20 bg-background/50">
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Subido por</span>
                                <p className="text-sm font-semibold text-foreground mt-1 truncate">{upload.subido_por || 'Sistema / Admin'}</p>
                              </div>
                              <div className="p-4 rounded-xl border border-border/20 bg-background/50 flex items-center gap-3">
                                {hasErrors ? (
                                  <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                                ) : (
                                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                                )}
                                <div>
                                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Estado de carga</span>
                                  <p className="text-sm font-semibold text-foreground mt-0.5">
                                    {hasErrors ? 'Completado con errores' : 'Completado con éxito'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {upload.detalle_errores && Object.keys(upload.detalle_errores).length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" /> Detalle de Errores de Importación
                                </h4>
                                <pre className="p-4 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono overflow-auto max-h-60 text-rose-600 dark:text-rose-400 max-w-full">
                                  {JSON.stringify(upload.detalle_errores, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}

              {filteredUploads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No se encontraron registros de importaciones.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  )
}
