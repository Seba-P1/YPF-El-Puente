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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Actualización de Precios
        </h1>
        <p className="mt-1 text-lg text-muted-foreground">
          Subí el Excel oficial para actualizar masivamente el menú.
        </p>
      </div>

      {/* Main Uploader Feature */}
      <ExcelUploader />

      {/* Upload History */}
      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <FileUp className="w-5 h-5 text-muted-foreground" />
            Historial de Actualizaciones
          </h2>
        </div>

        {historial.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archivo</TableHead>
                  <TableHead className="text-center">Total Filas</TableHead>
                  <TableHead className="text-center text-blue-600 dark:text-blue-400">Actualizados</TableHead>
                  <TableHead className="text-center text-green-600 dark:text-green-400">Nuevos</TableHead>
                  <TableHead className="text-center text-red-600 dark:text-red-400">Errores</TableHead>
                  <TableHead className="text-right">Fecha y Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <FileDown className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate max-w-[200px]" title={item.nombre_archivo}>
                          {item.nombre_archivo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-foreground">
                      {item.total_filas}
                    </TableCell>
                    <TableCell className="text-center font-bold text-blue-600 dark:text-blue-400">
                      {item.productos_actualizados}
                    </TableCell>
                    <TableCell className="text-center font-bold text-green-600 dark:text-green-400">
                      {item.productos_nuevos}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.productos_error > 0 ? (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {item.productos_error}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground font-medium">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-muted text-muted-foreground border">
              <FileUp className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-foreground">
              Aún no hay historial de actualizaciones.
            </p>
            <p className="text-muted-foreground">
              Cuando subas tu primer archivo Excel, aparecerá aquí.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
