import type { Metadata } from 'next'
import { FullNavbar } from '@/components/public/FullNavbar'
import { CartSidebar } from '@/components/public/CartSidebar'
import { MobileBottomBar } from '@/components/public/MobileBottomBar'
import { Toaster } from '@/components/ui/sonner'
import { WhatsAppFloatingButton } from '@/components/public/WhatsAppFloatingButton'

export const metadata: Metadata = {
  title: 'Menú FULL — YPF El Puente | Río Colorado',
  description: 'Hamburguesas, cafetería y productos exclusivos Full. YPF El Puente, Río Colorado.',
}

export default function FullMenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FullNavbar />
      {/* Añadimos un padding-bottom en mobile para que el contenido no quede debajo del MobileBottomBar */}
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <MobileBottomBar />
      <CartSidebar />
      <WhatsAppFloatingButton />
      <Toaster position="bottom-right" />
    </>
  )
}
