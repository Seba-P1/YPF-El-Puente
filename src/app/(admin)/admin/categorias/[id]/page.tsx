import { notFound } from 'next/navigation'
import { getCategoriaById } from '@/lib/supabase/queries'
import { EditCategoriaClient } from './EditCategoriaClient'

export const metadata = {
  title: 'Editar categoría — Admin YPF El Puente',
}

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const categoria = await getCategoriaById(id)

  if (!categoria) notFound()

  return <EditCategoriaClient categoria={categoria} />
}
