import React from 'react'
import { getProductosDestacados, getCategorias } from '@/lib/supabase/queries'
import FullClient from './FullClient'

export const revalidate = 60

export default async function FullMenuPage() {
  const [destacados, categorias] = await Promise.all([
    getProductosDestacados(),
    getCategorias(),
  ])

  return (
    <FullClient
      initialDestacados={destacados}
      initialCategorias={categorias}
    />
  )
}
