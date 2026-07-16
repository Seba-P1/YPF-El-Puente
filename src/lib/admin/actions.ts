'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export const getProductosForSearch = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('productos')
    .select('id, nombre, codigo_plu, precio')
    .order('nombre')
  return data ?? []
})
