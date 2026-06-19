import { notFound } from 'next/navigation'
import { getProductoById, getAllCategorias } from '@/lib/supabase/queries'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata = {
  title: 'Editar producto — Admin YPF El Puente',
}

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [producto, categorias] = await Promise.all([
    getProductoById(id),
    getAllCategorias(),
  ])

  if (!producto) notFound()

  return (
    <ProductForm
      mode="edit"
      producto={producto}
      categorias={categorias.map((c) => ({ slug: c.slug, nombre: c.nombre }))}
    />
  )
}
