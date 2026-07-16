import { getProductosPorCategoriaAdmin, getAllCategorias } from '@/lib/supabase/queries'
import { FullPrincipalManager } from '@/components/admin/FullPrincipalManager'
import type { Producto } from '@/lib/supabase/types'

export const metadata = {
  title: 'Full Principal — Admin YPF El Puente',
}

const SECCIONES = [
  'full_hamburguesas',
  'full_cafeteria',
  'marca_full',
  'full_sin_tacc',
  'full_mundial',
] as const

export default async function FullPrincipalPage() {
  const results = await Promise.all(
    SECCIONES.map(async (slug) => {
      try {
        return [slug, await getProductosPorCategoriaAdmin(slug)] as const
      } catch (err) {
        console.error(`Error fetching ${slug}:`, err)
        return [slug, []] as const
      }
    })
  )
  const seccionesData: Record<string, Producto[]> = Object.fromEntries(results)

  // Fetch categories to know which sections are active
  const categorias = await getAllCategorias()
  const categoriasStatus: Record<string, boolean> = {}
  for (const cat of categorias) {
    categoriasStatus[cat.slug] = cat.activa
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Full Principal</h1>
        <p className="text-muted-foreground mt-1">
          Las 5 secciones curadas que se muestran en la portada del menú FULL.
        </p>
      </div>
      <FullPrincipalManager initialData={seccionesData} categoriasStatus={categoriasStatus} />
    </div>
  )
}
