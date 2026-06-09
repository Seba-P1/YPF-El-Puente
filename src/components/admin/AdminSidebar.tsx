'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  Upload,
  Fuel,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdminSidebarProps {
  userEmail: string
}

const NAV_LINKS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/productos', icon: Package, label: 'Productos' },
  { href: '/admin/precios', icon: Upload, label: 'Actualizar Precios', highlight: true },
  { href: '/admin/combustibles', icon: Fuel, label: 'Combustibles' },
  { href: '/admin/configuracion', icon: Settings, label: 'Configuración' },
]

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col items-center justify-center">
        <div className="w-24 h-10 relative mb-4">
          <Image
            src="/assets/logo/logo-white-wide.png"
            alt="YPF El Puente"
            fill
            className="object-contain filter invert"
            priority
          />
        </div>
        <span className="text-xs font-bold tracking-widest text-[#005A9C] uppercase">
          Admin Panel
        </span>
        <span className="text-xs text-gray-400 mt-1 truncate w-full text-center" title={userEmail}>
          {userEmail}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? 'bg-[#005A9C] text-white shadow-md'
                  : link.highlight
                  ? 'bg-blue-50 text-[#005A9C] hover:bg-blue-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          Ver sitio web
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-700"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 lg:w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
