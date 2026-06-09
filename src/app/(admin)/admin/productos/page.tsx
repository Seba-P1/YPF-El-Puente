import { getAllProductos } from '@/lib/supabase/queries'
import { ProductTable } from '@/components/admin/ProductTable'

export const metadata = {
  title: 'Gestión de Productos — Admin YPF El Puente',
}

export default async function AdminProductosPage() {
  const productos = await getAllProductos()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Gestión de Productos
        </h1>
        <p className="text-gray-500 mt-1">
          Administrá la visibilidad, imágenes y etiquetas destacadas del menú.
        </p>
      </div>

      <ProductTable productos={productos} />
    </div>
  )
}
