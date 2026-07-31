'use server'

import { getAllProductos } from '@/lib/supabase/queries'

type EstadoFiltro = 'all' | 'active' | 'inactive' | 'noprice'

export async function fetchProductosPage(params: {
  page: number
  categoria: string
  busqueda: string
  estado: EstadoFiltro
}) {
  return getAllProductos({ ...params, limit: 20 })
}