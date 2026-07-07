import React from 'react'
import { getCatalogoCompleto, getCategorias, getProductosByCategoria, getInstagramPostsPublicos } from '@/lib/supabase/queries'
import FullClient from './FullClient'

export const revalidate = 60

export default async function FullMenuPage() {
  const [productos, categorias, fullHamburguesas, fullCafeteria, fullMarca, fullSinTacc, fullMundial, instagramPosts] = await Promise.all([
    getCatalogoCompleto(),
    getCategorias(),
    getProductosByCategoria('full_hamburguesas'),
    getProductosByCategoria('full_cafeteria'),
    getProductosByCategoria('marca_full'),
    getProductosByCategoria('full_sin_tacc'),
    getProductosByCategoria('full_mundial'),
    getInstagramPostsPublicos(),
  ])

  return (
    <FullClient
      initialDestacados={productos}
      initialCategorias={categorias}
      initialFullHamburguesas={fullHamburguesas}
      initialFullCafeteria={fullCafeteria}
      initialFullMarca={fullMarca}
      initialFullSinTacc={fullSinTacc}
      initialFullMundial={fullMundial}
      initialInstagramPosts={instagramPosts}
    />
  )
}
