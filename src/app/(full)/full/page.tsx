import React from 'react'
import { getProductosByCategoria, getCategorias } from '@/lib/supabase/queries'
import FullClient from './FullClient'

export const revalidate = 60

export default async function FullMenuPage() {
  const [hamburguesas, cafeteria, marcaFull, categorias] = await Promise.all([
    getProductosByCategoria('hamburguesas'),
    getProductosByCategoria('cafeteria'),
    getProductosByCategoria('marca_full'),
    getCategorias()
  ])

  return (
    <FullClient 
      initialHamburguesas={hamburguesas}
      initialCafeteria={cafeteria}
      initialMarcaFull={marcaFull}
      initialCategorias={categorias}
    />
  )
}
