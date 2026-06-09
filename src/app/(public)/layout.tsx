import { Navbar } from '@/components/public/Navbar'
import { CartSidebar } from '@/components/public/CartSidebar'
import { MobileBottomBar } from '@/components/public/MobileBottomBar'
import { Toaster } from '@/components/ui/sonner'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      
      {/* 
        Padding top 64px for Desktop Navbar.
        Padding bottom 64px on mobile for MobileBottomBar 
      */}
      <main className="flex-1 w-full pt-[68px] pb-16 md:pb-0 relative z-10">
        {children}
      </main>

      <MobileBottomBar />
      <CartSidebar />
      <Toaster position="bottom-center" />
    </div>
  )
}
