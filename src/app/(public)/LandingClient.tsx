'use client'

import { LandingHero } from '@/components/public/LandingHero'
import { TickerMarquee } from '@/components/public/TickerMarquee'
import { CombustiblesGrid } from '@/components/public/CombustiblesGrid'
import { BoxesServicesSection } from '@/components/public/BoxesServicesSection'
import { CTASection } from '@/components/public/CTASection'
import { FooterSection } from '@/components/public/FooterSection'
import type { Combustible, BoxService } from '@/lib/supabase/types'

interface LandingClientProps {
  combustibles: Combustible[]
  servicios: BoxService[]
}

export function LandingClient({ combustibles, servicios }: LandingClientProps) {
  return (
    <div className="flex flex-col w-full" style={{ background: 'var(--bg-base)', marginTop: -68 }}>
      <LandingHero />
      <TickerMarquee />
      <CombustiblesGrid combustibles={combustibles} />
      <BoxesServicesSection servicios={servicios} />
      <CTASection />
      <FooterSection />
    </div>
  )
}
