'use client'

import { useState, useMemo, Fragment } from 'react'
import { Activity, Search, ChevronDown, ChevronUp, Eye, Calendar, User, Database, Settings } from 'lucide-react'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

interface AuditLogsClientProps {
  initialLogs: any[]
}

const ACTION_BADGES: Record<string, string> = {
  INSERT: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  UPDATE: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
  DELETE: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  LOGIN: 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
  UPLOAD: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  BULK: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
}

export function AuditLogsClient({ initialLogs }: AuditLogsClientProps) {
  const [logs] = useState<any[]>(initialLogs)
  const [filterSearch, setFilterSearch] = useState('')
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchLower = filterSearch.toLowerCase()
      const matchesEmail = log.user_email?.toLowerCase().includes(searchLower)
      const matchesAction = log.action?.toLowerCase().includes(searchLower)
      const matchesEntity = log.entity_type?.toLowerCase().includes(searchLower)
      const matchesId = log.entity_id?.toLowerCase().includes(searchLower)
      return matchesEmail || matchesAction || matchesEntity || matchesId
    })
  }, [logs, filterSearch])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          <Activity className="w-8 h-8 text-primary" />
          Logs de Auditoría
        </h1>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {filteredLogs.length} logs
        </span>
      </div>
      <p className="text-sm text-muted-foreground -mt-2">
        Historial inmutable de operaciones sensibles realizadas por administradores sobre el catálogo y combustibles.
      </p>

      <GlassCard className="p-4 flex items-center gap-4">
        <div className="relative w-[320px] max-sm:w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuario, acción, tabla..."
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
                <TableHead className="w-[180px]">Fecha</TableHead>
                <TableHead className="w-[200px]">Usuario</TableHead>
                <TableHead className="w-[120px]">Acción</TableHead>
                <TableHead className="w-[150px]">Tabla / Módulo</TableHead>
                <TableHead className="w-[120px]">ID Registro</TableHead>
                <TableHead className="text-right">Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const isSelected = selectedLogId === log.id
                return (
                  <Fragment key={log.id}>
                    <TableRow
                      className={`hover:bg-muted/30 cursor-pointer ${
                        isSelected ? 'bg-muted/50 border-b border-border/20' : ''
                      }`}
                      onClick={() => setSelectedLogId(isSelected ? null : log.id)}
                    >
                      <TableCell className="font-semibold text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                      </TableCell>
                      <TableCell className="font-medium text-sm text-foreground truncate max-w-[200px]">
                        {log.user_email || 'Sistema (Trigger)'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs font-bold ${ACTION_BADGES[log.action] || 'bg-muted text-muted-foreground'}`}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-sm text-foreground">
                        {log.entity_type}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.entity_id ? log.entity_id.slice(0, 8) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLogId(isSelected ? null : log.id)
                          }}
                        >
                          {isSelected ? (
                            <>
                              Ocultar <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Ver detalle <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </TableCell>
                    </TableRow>

                    {isSelected && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={6} className="p-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {log.before_data && (
                                <div className="space-y-2">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    <Database className="w-3.5 h-3.5" /> Estado Anterior
                                  </h4>
                                  <pre className="p-4 rounded-xl bg-black/20 dark:bg-black/40 border border-border/10 text-[11px] font-mono overflow-auto max-h-60 text-muted-foreground max-w-full">
                                    {JSON.stringify(log.before_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.after_data && (
                                <div className="space-y-2">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                                    <Database className="w-3.5 h-3.5 text-emerald-500" /> Estado Posterior
                                  </h4>
                                  <pre className="p-4 rounded-xl bg-black/20 dark:bg-black/40 border border-border/10 text-[11px] font-mono overflow-auto max-h-60 text-emerald-500 max-w-full">
                                    {JSON.stringify(log.after_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                            {!log.before_data && !log.after_data && (
                              <p className="text-xs italic text-muted-foreground text-center py-4">
                                No hay metadatos adicionales de antes/después para esta acción.
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}

              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No se encontraron registros de auditoría.
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
