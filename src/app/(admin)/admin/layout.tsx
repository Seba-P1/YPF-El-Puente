import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ThemeProvider } from '@/components/theme-provider'

import { cn } from '@/lib/utils'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { CommandPalette } from '@/components/admin/command-palette'
import { AuroraBackground } from '@/components/admin/aurora-background'
import { KeyboardShortcuts } from '@/components/admin/keyboard-shortcuts'
import { Toaster } from 'sonner'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { getProductosForSearch } = await import('@/lib/admin/actions')
  const productos = await getProductosForSearch()

  if (!user) {
    redirect('/login')
  }

  // Middleware also checks role, but double check is fine.
  if (user.app_metadata?.role !== 'admin') {
    redirect('/')
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <SidebarProvider>
          <AuroraBackground>
            <div className="flex h-screen w-full overflow-hidden text-foreground">
              <AdminSidebar />
              
              <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                <AdminTopbar />
                
                <main className="flex-1 overflow-y-auto">
                  <div className="p-4 lg:p-6 xl:p-8 max-w-[1400px] mx-auto">
                    {children}
                  </div>
                </main>
              </div>
            </div>
            
            <CommandPalette productos={productos} />
            <KeyboardShortcuts />
            <Toaster richColors position="top-right" />
          </AuroraBackground>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
