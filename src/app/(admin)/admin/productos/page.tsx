import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllProductos } from '@/lib/supabase/queries'
import { ProductTable } from '@/components/admin/ProductTable'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Gestión de Productos — Admin YPF El Puente',
}

export default async function AdminProductosPage() {
  const productos = await getAllProductos()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Catálogo de Productos
          </h1>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {productos.length} productos
          </span>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <ProductTable productos={productos} />
    </div>
  )
}
