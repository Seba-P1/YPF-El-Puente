import { getAllCategorias } from '@/lib/supabase/queries'
import { CategoriasClient } from './CategoriasClient'

export const metadata = {
  title: 'Categorías — Admin YPF El Puente',
}

export default async function AdminCategoriasPage() {
  const categorias = await getAllCategorias()

  return <CategoriasClient initialCategorias={categorias} />
}
