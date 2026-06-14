import { GlassCard } from '@/components/admin/ui/glass-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingProductos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Catálogo de Productos
        </h1>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="space-y-4">
        <GlassCard className="p-4 flex flex-wrap items-center gap-4">
          <Skeleton className="h-9 w-[280px] max-sm:w-full rounded-md" />
          <Skeleton className="h-9 w-[180px] rounded-md" />
          <Skeleton className="h-9 w-[160px] rounded-md" />
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="w-12 h-12 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-11 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-md" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-16 ml-auto rounded-md" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
