import React from 'react'
import { getCatalogoCompleto, getCategorias, getProductosByCategoria, getInstagramPostsPublicos } from '@/lib/supabase/queries'
import FullClient from './FullClient'
import MenuSchema from '@/components/seo/MenuSchema'

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

  const catHamb = categorias.find((c) => c.slug === 'full_hamburguesas')
  const catCaf = categorias.find((c) => c.slug === 'full_cafeteria')
  const catFull = categorias.find((c) => c.slug === 'marca_full')
  const catSinTacc = categorias.find((c) => c.slug === 'full_sin_tacc')

  const menuSections = [
    { name: catHamb?.nombre ?? 'Hamburguesas', products: fullHamburguesas },
    { name: catCaf?.nombre ?? 'Cafetería', products: fullCafeteria },
    { name: catFull?.nombre ?? 'Marca Full', products: fullMarca },
    { name: catSinTacc?.nombre ?? 'Sin TACC', products: fullSinTacc },
  ].map((s) => ({
    name: s.name,
    products: s.products.map((p) => ({ name: p.nombre, price: p.precio })),
  }))

  return (
    <>
      <MenuSchema sections={menuSections} />
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
    </>
  )
}
