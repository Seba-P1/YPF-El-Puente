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
      <CombustiblesGrid combustibles={combustibles} />

      {/* Infinia info — inline, structurally unique */}
      <section
        style={{
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border)',
        }}
        className="py-[72px] md:py-[100px] px-4"
      >
        <div
          style={{
            maxWidth: 'min(900px, 92vw)',
            margin: '0 auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 32,
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: 'rgba(0,90,156,0.15)',
              border: '1px solid rgba(0,90,156,0.25)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Info style={{ width: 24, height: 24, color: 'var(--ypf-blue-bright)' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              Tecnología Infinia
            </h3>
            <p
              style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}
            >
              Nuestros combustibles premium (Infinia e Infinia Diesel) cuentan
              con tecnología inteligente que limpia y protege los inyectores,
              reduciendo el desgaste del motor y optimizando el consumo.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
