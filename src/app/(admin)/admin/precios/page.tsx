import { format } from 'date-fns'
import { getUploadsHistorial } from '@/lib/supabase/queries'
import { ExcelUploader } from '@/components/admin/ExcelUploader'
import { FileUp, FileDown, AlertTriangle } from 'lucide-react'
import { GlassCard } from '@/components/admin/ui/glass-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Actualizar Precios — Admin YPF El Puente',
}

export default async function AdminPreciosPage() {
  const historial = await getUploadsHistorial(10)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Actualización de Precios
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Subí el Excel oficial para actualizar masivamente el menú.
        </p>
      </div>

      {/* Uploaders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExcelUploader modo="actualizar" />
        <ExcelUploader modo="catalogo_completo" />
      </div>

      {/* Upload History */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-3 border-b">
          <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
            <FileUp className="w-4 h-4 text-muted-foreground" />
            Historial de Actualizaciones
          </h2>
        </div>

        {historial.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8 text-xs">Archivo</TableHead>
                  <TableHead className="h-8 text-xs text-center">Modo</TableHead>
                  <TableHead className="h-8 text-xs text-center">Total</TableHead>
                  <TableHead className="h-8 text-xs text-center text-blue-600 dark:text-blue-400">
                    Actualizados
                  </TableHead>
                  <TableHead className="h-8 text-xs text-center text-green-600 dark:text-green-400">
                    Nuevos
                  </TableHead>
                  <TableHead className="h-8 text-xs text-center text-red-600 dark:text-red-400">
                    Errores
                  </TableHead>
                  <TableHead className="h-8 text-xs text-right">Fecha y Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="py-1.5 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span
                          className="truncate max-w-[180px]"
                          title={item.nombre_archivo}
                        >
                          {item.nombre_archivo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-center">
                      {item.modo === 'actualizar' ? (
                        <Badge
                          variant="secondary"
                          className="text-[11px] px-1.5 py-0 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                        >
                          Actualización
                        </Badge>
                      ) : item.modo === 'catalogo_completo' ? (
                        <Badge
                          variant="secondary"
                          className="text-[11px] px-1.5 py-0 bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
                        >
                          Catálogo completo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px] text-muted-foreground">
                          —
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-center font-semibold text-foreground tabular-nums">
                      {item.total_filas}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-center font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      {item.productos_actualizados}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-center font-bold text-green-600 dark:text-green-400 tabular-nums">
                      {item.productos_nuevos}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-center">
                      {item.productos_error > 0 ? (
                        <Badge
                          variant="destructive"
                          className="text-[11px] px-1.5 py-0 bg-destructive/10 text-destructive border-none gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {item.productos_error}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground font-medium">0</span>
                      )}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs text-right text-muted-foreground tabular-nums whitespace-nowrap">
                      {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-muted text-muted-foreground border">
              <FileUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Aún no hay historial de actualizaciones.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Cuando subas tu primer archivo Excel, aparecerá aquí.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
