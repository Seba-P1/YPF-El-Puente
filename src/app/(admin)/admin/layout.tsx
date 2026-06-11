import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F1F5F9' }}>
      <AdminSidebar userEmail={user.email || 'Admin'} className="hidden lg:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader userEmail={user.email || 'Admin'} className="lg:hidden" />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 xl:p-8 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}