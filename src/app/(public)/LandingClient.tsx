'use client'

import { LandingHero } from '@/components/public/LandingHero'
import { CombustiblesGrid } from '@/components/public/CombustiblesGrid'
import { BoxesServicesSection } from '@/components/public/BoxesServicesSection'
import { CTASection } from '@/components/public/CTASection'
import { FooterSection } from '@/components/public/FooterSection'
import type { Combustible, BoxService } from '@/lib/supabase/types'

interface LandingClientProps {
  combustibles: Combustible[]
  servicios: BoxService[]
  config: Record<string, string>
}

export function LandingClient({ combustibles, servicios, config }: LandingClientProps) {
  const showBoxes = config['seccion_boxes_visible'] !== 'false'

  return (
    <div className="flex flex-col w-full" style={{ background: 'var(--bg-base)', marginTop: -68 }}>
      <LandingHero />
      <div style={{ height: 200, background: 'linear-gradient(to bottom, #000000 0%, var(--bg-base) 100%)' }} />
      <CombustiblesGrid combustibles={combustibles} />
      {showBoxes && <BoxesServicesSection servicios={servicios} />}
      <CTASection />
      <FooterSection />
    </div>
  )
}
