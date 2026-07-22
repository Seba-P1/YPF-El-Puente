import type { Metadata } from 'next'
import { getCombustibles } from '@/lib/supabase/queries'
import { CombustiblesGrid } from '@/components/public/CombustiblesGrid'
import { FooterSection } from '@/components/public/FooterSection'
import { Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Combustibles — YPF El Puente | Río Colorado',
  description: 'Conocé los precios de nuestros combustibles YPF.',
  alternates: { canonical: '/combustibles' },
  openGraph: {
    title: 'Combustibles — YPF El Puente | Río Colorado',
    description: 'Conocé los precios de nuestros combustibles YPF.',
    locale: 'es_AR',
    type: 'website',
    siteName: 'YPF El Puente',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'YPF El Puente — Río Colorado',
      },
    ],
  },
}

export const revalidate = 60

export default async function CombustiblesPage() {
  const combustibles = await getCombustibles()

  return (
    <div
      className="flex flex-col w-full"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center w-full min-h-[50vh] px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #001428, #003C6E)',
        }}
      >
        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.5,
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              color: '#F8FAFC',
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
              marginBottom: 12,
            }}
          >
            Nuestros Combustibles
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 22px)',
              color: 'rgba(248,250,252,0.65)',
              fontWeight: 500,
              maxWidth: 520,
              lineHeight: 1.5,
            }}
          >
            La máxima tecnología de YPF para el mejor rendimiento de tu motor.
          </p>
        </div>
      </section>

      {/* Grid (shared component) */}
      <h2 className="sr-only">Listado de combustibles</h2>
      <CombustiblesGrid combustibles={combustibles} />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
