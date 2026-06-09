import { getCombustibles } from '@/lib/supabase/queries'
import { LandingClient } from './LandingClient'

export const revalidate = 60

export default async function LandingPage() {
  const combustibles = await getCombustibles()

  return <LandingClient combustibles={combustibles} />
}
