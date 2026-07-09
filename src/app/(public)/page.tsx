import { getCombustibles, getBoxesServices } from '@/lib/supabase/queries'
import { LandingClient } from './LandingClient'

export const revalidate = 60

export default async function LandingPage() {
  const [combustibles, servicios] = await Promise.all([
    getCombustibles(),
    getBoxesServices(),
  ])

  return <LandingClient combustibles={combustibles} servicios={servicios} />
}
