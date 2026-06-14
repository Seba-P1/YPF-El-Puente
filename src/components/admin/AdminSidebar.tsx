'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Upload,
  Fuel,
  Settings,
  ExternalLink,
  LogOut,
  User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdminSidebarProps {
  userEmail: string
  className?: string
}

const NAV_LINKS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/productos', icon: Package, label: 'Productos' },
  { href: '/admin/precios', icon: Upload, label: 'Actualizar Precios', highlight: true },
  { href: '/admin/combustibles', icon: Fuel, label: 'Combustibles' },
  { href: '/admin/configuracion', icon: Settings, label: 'Configuración' },
]

export function AdminSidebar({ userEmail, className = '' }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [imgError, setImgError] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/login')
  }

  return (
    <aside
      className={`flex flex-col w-[224px] flex-shrink-0 h-screen overflow-y-auto overflow-x-hidden ${className}`}
      style={{
        background: 'var(--admin-drawer-bg)',
        borderRight: '1px solid var(--admin-drawer-border)',
      }}
    >
      {/* HEADER */}
      <div
        className="flex flex-col px-4 pt-5 pb-4"
        style={{ borderBottom: '1px solid var(--admin-drawer-border)' }}
      >
        <div className="w-20 h-7 relative mb-2">
          {!imgError ? (
            <Image
              src="/assets/logo/logo-white.svg"
              alt="YPF"
              fill
              className="object-contain"
              onError={() => setImgError(true)}
              priority
            />
          ) : (
            <span style={{ color: 'var(--nav-text)', fontWeight: 900, fontSize: 16 }}>YPF</span>
          )}
        </div>
        <span
          className="text-[11px] font-bold tracking-[0.08em] uppercase"
          style={{ color: 'var(--nav-text-muted)' }}
        >
          El Puente Admin
        </span>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 px-2 py-3">
        <span
          className="block text-[10px] font-bold tracking-[0.12em] uppercase px-2 pb-1 pt-2"
          style={{ color: 'var(--nav-text-muted)' }}
        >
          Menú
        </span>

        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-[10px] px-[10px] py-2 rounded-lg mb-[2px] text-[13px] font-medium transition-all duration-150"
              style={{
                background: isActive
                  ? 'var(--ypf-blue)'
                  : link.highlight && !isActive
                    ? 'var(--ypf-yellow-dim)'
                    : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--nav-text-muted)',
                fontWeight: isActive ? 600 : 500,
                borderLeft: link.highlight && !isActive ? '2px solid var(--ypf-yellow)' : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-card-hover)'
                  e.currentTarget.style.color = 'var(--nav-text)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = link.highlight ? 'var(--ypf-yellow-dim)' : 'transparent'
                  e.currentTarget.style.color = 'var(--nav-text-muted)'
                }
              }}
            >
              <link.icon
                size={16}
                className="flex-shrink-0"
                style={{ color: isActive ? '#FFFFFF' : 'var(--nav-text-muted)' }}
              />
              {link.label}
              {link.highlight && !isActive && (
                <span className="ml-auto text-[10px] font-bold" style={{ color: 'var(--ypf-yellow)' }}>⚡</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* SEPARADOR */}
      <div className="mx-2" style={{ height: '1px', background: 'var(--admin-drawer-border)' }} />

      {/* SECCIÓN INFERIOR */}
      <div className="px-2 py-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-[10px] px-[10px] py-2 rounded-lg text-[12px] transition-all duration-150"
          style={{ color: 'var(--nav-text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--nav-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--nav-text-muted)'}
        >
          <ExternalLink size={16} className="flex-shrink-0" />
          Ver sitio web
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-[10px] px-[10px] py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
          style={{ color: 'rgba(239,68,68,0.7)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(239,68,68)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239,68,68,0.7)'}
        >
          <LogOut size={16} className="flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>

      {/* EMAIL USUARIO */}
      <div
        className="flex items-center gap-2 px-[10px] py-3 mt-auto"
        style={{ borderTop: '1px solid var(--admin-drawer-border)' }}
      >
        <User size={14} style={{ color: 'var(--nav-text-muted)', flexShrink: 0 }} />
        <span
          className="text-[11px] truncate"
          style={{ color: 'var(--nav-text-muted)' }}
          title={userEmail}
        >
          {userEmail}
        </span>
      </div>
    </aside>
  )
}