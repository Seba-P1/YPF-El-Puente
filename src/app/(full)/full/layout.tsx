import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menú FULL — YPF El Puente | Río Colorado',
  description: 'Hamburguesas, cafetería y productos exclusivos Full en Río Colorado, Patagonia',
}

export default function FullMenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
