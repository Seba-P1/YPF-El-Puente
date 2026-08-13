import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — FOOTER
   ═══════════════════════════════════════════════════════════════ */

export function FooterSection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5492920264433'

  return (
    <footer
      style={{
        background: '#000000',
        borderTop: '1px solid var(--border)',
        padding: '48px 0 32px',
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left w-full max-w-[1280px] mx-auto px-6"
      >
        {/* Column 1 — Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="relative w-48 h-24 sm:w-56 sm:h-28">
            <Image
              src="/assets/ypf imagenes/logo-slogan-corto.png"
              alt="YPF El Puente — Con la mejor energía desde 1930"
              fill
              sizes="224px"
              className="object-contain"
            />
          </div>
        </div>

        {/* Column 2 — Navigation */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <span
            style={{
              fontSize: 11,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            Navegación
          </span>
          {[
            { href: '#combustibles', label: 'Combustibles' },
            { href: '/boxes', label: 'Boxes' },
            { href: '/full', label: 'Menú FULL' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              className="hover:!text-[#F8FAFC]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Column 3 — Contact */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <span
            style={{
              fontSize: 11,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            Contacto
          </span>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:!text-[#F8FAFC]"
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            <MessageCircle style={{ width: 16, height: 16 }} />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="w-full max-w-[1280px] mx-auto px-6"
        style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--text-muted)',
        }}
      >
        © {new Date().getFullYear()} AXPE Soluciones Digitales
      </div>
    </footer>
  )
}
