/**
 * Fix — Full Principal images + remove extra products
 *
 * 1. Elimina productos que no están en la página oficial
 * 2. Setea imagen_url para todos los productos restantes
 *
 * Uso: npx tsx scripts/fix-full-principal-images.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve(__dirname, '..', '.env.local')
const envRaw = fs.readFileSync(envPath, 'utf-8')
function env(key: string): string {
  const m = envRaw.split('\n').find(l => l.startsWith(key + '='))
  if (!m) throw new Error(`Missing env: ${key}`)
  return m.split('=').slice(1).join('=').trim()
}

const supabase = createClient(env('NEXT_PUBLIC_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'))

// Productos a ELIMINAR (no están en la página oficial)
const ELIMINAR = [
  'burger-16',        // Novedad Full — no existe en full.ypf.com
  'alfajor-15',       // Alfajor especial — no existe en marca_full del sitio
  'alfajor-negro',    // Alfajor negro premium — no existe en marca_full del sitio
]

// Mapeo: codigo_plu → imagen_url (ruta relativa a /public)
const IMAGENES: Record<string, string> = {
  // ── Hamburguesas ──
  'burger-14': '/assets/ypf%20imagenes/full_hamburguesas/burger-14.webp',
  'burger-13': '/assets/ypf%20imagenes/full_hamburguesas/burger-13.webp',
  'burger-6':  '/assets/ypf%20imagenes/full_hamburguesas/burger-6.webp',
  'burger-12': '/assets/ypf%20imagenes/full_hamburguesas/burger-12.webp',
  'burger-7':  '/assets/ypf%20imagenes/full_hamburguesas/burger-7.webp',
  'burger-15': '/assets/ypf%20imagenes/full_hamburguesas/burger-15.webp',
  'burger-8':  '/assets/ypf%20imagenes/full_hamburguesas/burger-8.webp',
  'burger-3':  '/assets/ypf%20imagenes/full_hamburguesas/burger-3.webp',
  'burger-2':  '/assets/ypf%20imagenes/full_hamburguesas/burger-2.webp',
  'burger-5':  '/assets/ypf%20imagenes/full_hamburguesas/burger-5.webp',
  'burger-1':  '/assets/ypf%20imagenes/full_hamburguesas/burger-1.webp',
  'burger-9':  '/assets/ypf%20imagenes/full_hamburguesas/burger-9.webp',
  'burger-10': '/assets/ypf%20imagenes/full_hamburguesas/burger-10.webp',
  'burger-11': '/assets/ypf%20imagenes/full_hamburguesas/burger-11.webp',

  // ── Cafetería ──
  'cafe-1':  '/assets/ypf%20imagenes/full_cafeteria/cafe-1.webp',
  'cafe-3':  '/assets/ypf%20imagenes/full_cafeteria/cafe-3.webp',
  'cafe-2':  '/assets/ypf%20imagenes/full_cafeteria/cafe-2.webp',
  'cafe-4':  '/assets/ypf%20imagenes/full_cafeteria/cafe-4.webp',
  'cafe-7':  '/assets/ypf%20imagenes/full_cafeteria/cafe-7.webp',
  'cafe-5':  '/assets/ypf%20imagenes/full_cafeteria/cafe-5.webp',
  'cafe-6':  '/assets/ypf%20imagenes/full_cafeteria/cafe-6.webp',
  'cafe-10': '/assets/ypf%20imagenes/full_cafeteria/cafe-10.webp',
  'cafe-11': '/assets/ypf%20imagenes/full_cafeteria/cafe-11.webp',
  'cafe-8':  '/assets/ypf%20imagenes/full_cafeteria/cafe-8.webp',
  'cafe-9':  '/assets/ypf%20imagenes/full_cafeteria/cafe-9.webp',

  // ── Productos Full (marca_full) ──
  'alfajor-2':     '/assets/ypf%20imagenes/marca_full/alfajor-2.webp',
  'alfajor-1':     '/assets/ypf%20imagenes/marca_full/alfajor-1.webp',
  'alfajor-3':     '/assets/ypf%20imagenes/marca_full/alfajor-3.webp',
  'alfajor-13':    '/assets/ypf%20imagenes/marca_full/alfajor-13.webp',
  'alfajor-4':     '/assets/ypf%20imagenes/marca_full/alfajor-4.webp',
  'alfajor-11':    '/assets/ypf%20imagenes/marca_full/alfajor-11.webp',
  'alfajor-14':    '/assets/ypf%20imagenes/marca_full/alfajor-14.webp',
  'alfajor-5':     '/assets/ypf%20imagenes/marca_full/alfajor-5.webp',
  'alfajor-10':    '/assets/ypf%20imagenes/marca_full/alfajor-10.webp',
  'alfajor-6':     '/assets/ypf%20imagenes/marca_full/alfajor-6.webp',
  'alfajor-7':     '/assets/ypf%20imagenes/marca_full/alfajor-7.webp',
  'alfajor-8':     '/assets/ypf%20imagenes/marca_full/alfajor-8.webp',
  'alfajor-9':     '/assets/ypf%20imagenes/marca_full/alfajor-9.webp',

  // ── Mundial ──
  'RDP7':                  '/assets/ypf%20imagenes/full_mundial/RDP7.webp',
  'papas-chimi':           '/assets/ypf%20imagenes/full_mundial/papas-chimi.webp',
  'mundial-alfajor-negro': '/assets/ypf%20imagenes/full_mundial/mundial-alfajor-negro.webp',
  'mundial-alfajor-blanco': '/assets/ypf%20imagenes/full_mundial/mundial-alfajor-blanco.webp',
  'cafe-capi':             '/assets/ypf%20imagenes/full_mundial/cafe-capi.webp',
  'dona':                  '/assets/ypf%20imagenes/full_mundial/dona.webp',
}

async function fix() {
  // 1. Eliminar productos extra
  console.log('🗑️  Eliminando productos extra...')
  for (const codigo of ELIMINAR) {
    const { error, count } = await supabase
      .from('productos')
      .delete()
      .eq('codigo_plu', codigo)
      .in('categoria_slug', ['full_hamburguesas', 'marca_full', 'full_mundial'])

    if (error) {
      console.error(`❌ Error eliminando ${codigo}: ${error.message}`)
    } else {
      console.log(`✅ Eliminado: ${codigo}`)
    }
  }

  // 2. Actualizar imagen_url
  console.log('\n🖼️  Actualizando imagen_url...')
  let updated = 0
  for (const [codigo, url] of Object.entries(IMAGENES)) {
    const { error } = await supabase
      .from('productos')
      .update({ imagen_url: url, updated_at: new Date().toISOString() })
      .eq('codigo_plu', codigo)

    if (error) {
      console.error(`❌ ${codigo}: ${error.message}`)
    } else {
      updated++
      process.stdout.write(`✅ ${codigo.padEnd(24)} → ${url}\n`)
    }
  }

  console.log(`\n🎉 ${updated} productos actualizados con imagen_url`)
}

fix().catch(console.error)
