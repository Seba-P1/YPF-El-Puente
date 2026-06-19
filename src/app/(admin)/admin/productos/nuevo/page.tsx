import { getAllCategorias } from '@/lib/supabase/queries'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata = {
  title: 'Nuevo producto — Admin YPF El Puente',
}

export default async function NuevoProductoPage() {
  const categorias = await getAllCategorias()

  return (
    <ProductForm
      mode="create"
      categorias={categorias.map((c) => ({ slug: c.slug, nombre: c.nombre }))}
    />
  )
}
