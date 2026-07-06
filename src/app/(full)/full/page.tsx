import React from 'react'
import { getCatalogoCompleto, getCategorias } from '@/lib/supabase/queries'
import FullClient from './FullClient'

export const revalidate = 60

export default async function FullMenuPage() {
  const [productos, categorias] = await Promise.all([
    getCatalogoCompleto(),
    getCategorias(),
  ])

  return (
    <FullClient
      initialDestacados={productos}
      initialCategorias={categorias}
    />
  )
}
