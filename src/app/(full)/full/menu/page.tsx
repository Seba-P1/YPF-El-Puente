import React from 'react'
import { getCatalogoCompleto } from '@/lib/supabase/queries'
import MenuClient from './MenuClient'

export const revalidate = 60

export const metadata = {
  title: 'Menú Completo — YPF FULL El Puente',
  description:
    'Todos los productos de YPF FULL El Puente: hamburguesas, cafetería, panadería, combos y más. Río Colorado, Patagonia Argentina.',
}

export default async function MenuPage() {
  const productos = await getCatalogoCompleto()

  return <MenuClient initialProductos={productos} />
}
