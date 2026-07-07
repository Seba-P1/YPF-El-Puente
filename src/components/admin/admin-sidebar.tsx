'use client'

import { Package, Tags, Settings, Activity, Fuel, History, LogOut, LayoutDashboard, LayoutTemplate } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const navMain = [
  {
    title: 'General',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { title: 'Full Principal', url: '/admin/full-principal', icon: LayoutTemplate },
      { title: 'Productos', url: '/admin/productos', icon: Package },
      { title: 'Categorías', url: '/admin/categorias', icon: Tags },
      { title: 'Combustibles', url: '/admin/combustibles', icon: Fuel },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { title: 'Configuración', url: '/admin/configuracion', icon: Settings },
      { title: 'Historial', url: '/admin/historial', icon: History },
      { title: 'Audit Logs', url: '/admin/logs', icon: Activity },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/">
          <Image
            src="/assets/ypf imagenes/logo-modoclaro.png"
            alt="YPF El Puente"
            width={160}
            height={48}
            className="h-10 w-auto object-contain dark:hidden"
            priority
          />
          <Image
            src="/assets/ypf imagenes/logo-modooscuro.png"
            alt="YPF El Puente"
            width={160}
            height={48}
            className="h-10 w-auto object-contain hidden dark:block"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === '/admin'
                      ? pathname === '/admin'
                      : pathname === item.url || pathname.startsWith(item.url + '/')
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión">
              <LogOut className="h-4 w-4 text-red-500" />
              <span className="text-red-500">Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
