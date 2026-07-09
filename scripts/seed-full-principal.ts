/**
 * Seed — Full Principal
 *
 * Poblá las 5 secciones curadas con los productos oficiales de full.ypf.com
 * usando codigo_plu que coincide con los nombres de archivo de imagen.
 *
 * Uso: npx tsx scripts/seed-full-principal.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Leer .env.local manualmente
const envPath = path.resolve(__dirname, '..', '.env.local')
const envRaw = fs.readFileSync(envPath, 'utf-8')
function env(key: string): string {
  const m = envRaw.split('\n').find(l => l.startsWith(key + '='))
  if (!m) throw new Error(`Missing env: ${key}`)
  return m.split('=').slice(1).join('=').trim()
}

const url = env('NEXT_PUBLIC_SUPABASE_URL')
const key = env('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(url, key)

const CATEGORIAS_FULL = [
  'full_hamburguesas',
  'full_cafeteria',
  'marca_full',
  'full_sin_tacc',
  'full_mundial',
]

type ProductSeed = {
  codigo_plu: string
  nombre: string
  categoria_slug: string
  precio: number
}

const hamburguesas = [
  { codigo_plu: 'burger-14', nombre: 'Fullbo',                                               precio: 0 },
  { codigo_plu: 'burger-13', nombre: 'Full Pollo',                                           precio: 0 },
  { codigo_plu: 'burger-6',  nombre: 'Hamburguesa Max doble queso y panceta',                 precio: 0 },
  { codigo_plu: 'burger-12', nombre: 'Sandwich Keto',                                        precio: 0 },
  { codigo_plu: 'burger-7',  nombre: 'Hamburguesa Magna con palta',                          precio: 0 },
  { codigo_plu: 'burger-15', nombre: 'Doble clásica',                                        precio: 0 },
  { codigo_plu: 'burger-8',  nombre: 'Hamburguesa Max triple con queso y panceta',            precio: 0 },
  { codigo_plu: 'burger-3',  nombre: 'Gran Hamburguesa',                                     precio: 0 },
  { codigo_plu: 'burger-2',  nombre: 'Hamburguesa de Campo',                                 precio: 0 },
  { codigo_plu: 'burger-5',  nombre: 'Hamburguesa doble con queso y huevo',                   precio: 0 },
  { codigo_plu: 'burger-1',  nombre: 'Hamburguesa doble carne doble queso',                   precio: 0 },
  { codigo_plu: 'burger-9',  nombre: 'Medallón NotChicken Crispy',                            precio: 0 },
  { codigo_plu: 'burger-10', nombre: 'Medallón NotChicken Crispy con palta',                  precio: 0 },
  { codigo_plu: 'burger-11', nombre: 'Papas con Cheddar',                                    precio: 0 },
  { codigo_plu: 'burger-16', nombre: 'Novedad Full',                                         precio: 0 },
]

const cafeteria = [
  { codigo_plu: 'cafe-1',  nombre: 'Café con leche',                                        precio: 0 },
  { codigo_plu: 'cafe-3',  nombre: 'Café cortado',                                          precio: 0 },
  { codigo_plu: 'cafe-2',  nombre: 'Pocillo',                                               precio: 0 },
  { codigo_plu: 'cafe-4',  nombre: 'Café en tazón',                                         precio: 0 },
  { codigo_plu: 'cafe-7',  nombre: 'Chocolate caliente',                                    precio: 0 },
  { codigo_plu: 'cafe-5',  nombre: 'Capuccino',                                             precio: 0 },
  { codigo_plu: 'cafe-6',  nombre: 'Submarino',                                             precio: 0 },
  { codigo_plu: 'cafe-10', nombre: 'Lattes',                                                precio: 0 },
  { codigo_plu: 'cafe-11', nombre: 'Coco, vainilla, avellana, Salted caramel',               precio: 0 },
  { codigo_plu: 'cafe-8',  nombre: 'Café frappé dulce de leche tentación',                   precio: 0 },
  { codigo_plu: 'cafe-9',  nombre: 'Café frappé cookies & cream',                            precio: 0 },
]

const marcaFull = [
  { codigo_plu: 'alfajor-2',     nombre: 'Alfajor negro',                                   precio: 0 },
  { codigo_plu: 'alfajor-1',     nombre: 'Alfajor blanco',                                  precio: 0 },
  { codigo_plu: 'alfajor-3',     nombre: 'Alfajor de mousse',                               precio: 0 },
  { codigo_plu: 'alfajor-13',    nombre: 'Alfajor de pistacho',                             precio: 0 },
  { codigo_plu: 'alfajor-4',     nombre: 'Galletita de limón',                              precio: 0 },
  { codigo_plu: 'alfajor-11',    nombre: 'Bocadito DDL',                                    precio: 0 },
  { codigo_plu: 'alfajor-14',    nombre: 'Bocadito chocolate blanco',                        precio: 0 },
  { codigo_plu: 'alfajor-5',     nombre: 'Chips de papas rústicas',                          precio: 0 },
  { codigo_plu: 'alfajor-10',    nombre: 'Chips de batatas rústicas',                        precio: 0 },
  { codigo_plu: 'alfajor-6',     nombre: 'Mix balanceado',                                  precio: 0 },
  { codigo_plu: 'alfajor-7',     nombre: 'Mix energético',                                  precio: 0 },
  { codigo_plu: 'alfajor-8',     nombre: 'Mix clásico',                                     precio: 0 },
  { codigo_plu: 'alfajor-9',     nombre: 'Mix del bosque',                                  precio: 0 },
  { codigo_plu: 'alfajor-15',    nombre: 'Alfajor especial',                                precio: 0 },
  { codigo_plu: 'alfajor-negro', nombre: 'Alfajor negro premium',                            precio: 0 },
]

const mundial = [
  { codigo_plu: 'RDP7',                  nombre: 'RDP7',                                    precio: 0 },
  { codigo_plu: 'papas-chimi',           nombre: 'Papas chimi',                             precio: 0 },
  { codigo_plu: 'mundial-alfajor-negro', nombre: 'Alfajor negro',                           precio: 0 },
  { codigo_plu: 'mundial-alfajor-blanco', nombre: 'Alfajor blanco',                          precio: 0 },
  { codigo_plu: 'cafe-capi',             nombre: 'Café capitán',                            precio: 0 },
  { codigo_plu: 'dona',                  nombre: 'Dona',                                    precio: 0 },
]

async function seed() {
  console.log('🗑️  Eliminando productos existentes de las 5 secciones full...')
  const { error: delError } = await supabase
    .from('productos')
    .delete()
    .in('categoria_slug', CATEGORIAS_FULL)

  if (delError) {
    console.error('Error al limpiar:', delError.message)
    process.exit(1)
  }
  console.log('✅ Productos anteriores eliminados')

  const todos: ProductSeed[] = [
    ...hamburguesas.map(p => ({ ...p, categoria_slug: 'full_hamburguesas' })),
    ...cafeteria.map(p    => ({ ...p, categoria_slug: 'full_cafeteria' })),
    ...marcaFull.map(p    => ({ ...p, categoria_slug: 'marca_full' })),
    ...mundial.map(p      => ({ ...p, categoria_slug: 'full_mundial' })),
  ]

  console.log(`\n📦 Insertando ${todos.length} productos...\n`)

  let count = 0
  for (const p of todos) {
    const { error } = await supabase
      .from('productos')
      .insert({
        codigo_plu: p.codigo_plu,
        nombre: p.nombre,
        precio: p.precio,
        categoria_slug: p.categoria_slug,
        disponible: true,
        orden: 0,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error(`❌ ${p.categoria_slug}/${p.codigo_plu}: ${error.message}`)
    } else {
      count++
      process.stdout.write(`✅ ${p.categoria_slug.padEnd(22)} ${p.codigo_plu.padEnd(18)} → ${p.nombre}\n`)
    }
  }

  console.log(`\n🎉 ${count}/${todos.length} productos insertados`)
}

seed().catch(console.error)
