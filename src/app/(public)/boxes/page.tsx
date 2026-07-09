import type { Metadata } from 'next'
import { getBoxesServices } from '@/lib/supabase/queries'
import { BoxesServicesSection } from '@/components/public/BoxesServicesSection'
import { FooterSection } from '@/components/public/FooterSection'
import { Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Boxes — YPF El Puente | Río Colorado',
  description: 'Servicio de Boxes especializado en YPF El Puente. Cambio de aceite, revisión y más.',
}

export const revalidate = 60

export default async function BoxesPage() {
  const servicios = await getBoxesServices()

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
            Servicio de Boxes
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
            El cuidado experto que tu vehículo necesita.
          </p>
        </div>
      </section>

      {/* Services (from DB) */}
      <BoxesServicesSection servicios={servicios} />

      {/* Hours & Location — inline, structurally unique */}
      <section
        style={{
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border)',
        }}
        className="py-[72px] md:py-[100px] px-4"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          style={{ maxWidth: 'min(1000px, 92vw)', margin: '0 auto' }}
        >
          {/* Hours card */}
          <div
            style={{
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
              <Clock style={{ width: 24, height: 24, color: 'var(--ypf-blue-bright)' }} />
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
                Horarios de Atención
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Lunes a Viernes: 08:00 a 20:00 hs
              </p>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Sábados: 08:00 a 14:00 hs
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  marginTop: 8,
                }}
              >
                Domingos y feriados cerrado
              </p>
            </div>
          </div>

          {/* Location card */}
          <div
            style={{
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
              <MapPin style={{ width: 24, height: 24, color: 'var(--ypf-blue-bright)' }} />
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
                Ubicación
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 4 }}>
                YPF El Puente
              </p>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Río Colorado, Provincia de Río Negro
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  marginTop: 8,
                }}
              >
                Patagonia Argentina
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA — scheduling */}
      <section
        className="w-full py-20 px-4"
        style={{
          background: '#001428',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: 900,
            color: '#F8FAFC',
            marginBottom: 12,
          }}
        >
          ¿Necesitás un turno?
        </h2>
        <p
          style={{
            fontSize: 16,
            color: 'rgba(248,250,252,0.6)',
            maxWidth: 480,
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Escribinos por WhatsApp y coordinamos el horario que mejor te quede.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 hover:shadow-xl hover:bg-[#128C7E]"
          style={{
            background: '#25D366',
            color: 'white',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(37,211,102,0.25)',
          }}
        >
          Solicitar Turno por WhatsApp
        </a>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
