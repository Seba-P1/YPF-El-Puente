import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'YPF El Puente',
    template: '%s — YPF El Puente',
  },
  description:
    'Menú digital, combustibles y boxes. YPF El Puente en Río Colorado, Patagonia.',
  keywords: [
    'YPF',
    'El Puente',
    'Río Colorado',
    'combustibles',
    'menú',
    'Patagonia',
  ],
  openGraph: {
    title: 'YPF El Puente — Río Colorado',
    description: 'Menú digital FULL, combustibles y boxes en Río Colorado',
    locale: 'es_AR',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-montserrat)]">
        {children}
      </body>
    </html>
  )
}
