import type { Metadata } from 'next'
import { getCombustibles, getBoxesServices } from '@/lib/supabase/queries'
import { LandingClient } from './LandingClient'
import { createPageMetadata } from '@/lib/seo/metadata'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'

export const metadata: Metadata = createPageMetadata({
  title: 'YPF El Puente — Río Colorado',
  description:
    'Menú digital FULL, combustibles y boxes. YPF El Puente en Río Colorado, Patagonia.',
  keywords: [
    'YPF',
    'El Puente',
    'Río Colorado',
    'combustibles',
    'menú FULL',
    'boxes',
    'Patagonia',
  ],
  canonical: '/',
  image: '/opengraph-image',
})

export const revalidate = 60

export default async function LandingPage() {
  const [combustibles, servicios] = await Promise.all([
    getCombustibles(),
    getBoxesServices(),
  ])

  return (
    <>
      <LocalBusinessSchema />
      <LandingClient combustibles={combustibles} servicios={servicios} />
    </>
  )
}
