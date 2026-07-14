import React from 'react'
import type { Metadata } from 'next'
import { getCatalogoCompleto } from '@/lib/supabase/queries'
import MenuClient from './MenuClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Menú Completo — YPF FULL El Puente',
  description:
    'Todos los productos de YPF FULL El Puente: hamburguesas, cafetería, panadería, combos y más. Río Colorado, Patagonia Argentina.',
  alternates: { canonical: '/full/menu' },
  openGraph: {
    title: 'Menú Completo — YPF FULL El Puente',
    description:
      'Todos los productos de YPF FULL El Puente: hamburguesas, cafetería, panadería, combos y más. Río Colorado, Patagonia Argentina.',
    locale: 'es_AR',
    type: 'website',
    siteName: 'YPF El Puente',
  },
}

export default async function MenuPage() {
  const productos = await getCatalogoCompleto()

  return <MenuClient initialProductos={productos} />
}
