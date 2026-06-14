'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Menu,
    X,
    User,
    LayoutDashboard,
    Package,
    Upload,
    Fuel,
    Settings,
    ExternalLink,
    LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface AdminHeaderProps {
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

export function AdminHeader({ userEmail, className = '' }: AdminHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        toast.success('Sesión cerrada')
        router.push('/login')
    }

    return (
        <div className={className}>
            {/* BARRA FLOTANTE TRANSPARENTE */}
            <div
                className="flex items-center justify-between px-4 py-2"
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    zIndex: 30,
                    pointerEvents: 'none',
                }}
            >
                <button onClick={() => setIsOpen(true)} className="lg:hidden" style={{ pointerEvents: 'auto' }}>
                    <Menu size={20} style={{ color: 'var(--nav-text)' }} />
                </button>
                <div style={{ pointerEvents: 'auto', marginLeft: 'auto' }}>
                    <ThemeToggle />
                </div>
            </div>

            {/* DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* OVERLAY */}
                        <motion.div
                            className="fixed inset-0 z-40"
                            style={{ background: 'rgba(0,0,0,0.5)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* PANEL */}
                        <motion.div
                            className="fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col overflow-y-auto"
                            style={{ background: 'var(--admin-drawer-bg)' }}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {/* HEADER DEL PANEL */}
                            <div
                                className="flex items-center justify-between px-4 h-14 flex-shrink-0"
                                style={{ borderBottom: '1px solid var(--admin-drawer-border)' }}
                            >
                                <span style={{ color: 'var(--nav-text)', fontSize: 14, fontWeight: 700 }}>YPF El Puente</span>
                                <button onClick={() => setIsOpen(false)}>
                                    <X size={20} style={{ color: 'var(--nav-text-muted)' }} />
                                </button>
                            </div>

                            {/* NAVEGACIÓN */}
                            <nav className="flex-1 px-2 py-3">
                                <span
                                    className="block text-[10px] font-bold tracking-[0.12em] uppercase px-2 pb-1 pt-2"
                                    style={{ color: 'rgba(255,255,255,0.25)' }}
                                >
                                    Menú
                                </span>

                                {NAV_LINKS.map((link) => {
                                    const isActive = pathname === link.href
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-[10px] px-[10px] py-2 rounded-lg mb-[2px] text-[13px] font-medium transition-all duration-150"
                                            style={{
                                                background: isActive
                                                    ? 'var(--ypf-blue)'
                                                    : link.highlight && !isActive
                                                        ? 'var(--ypf-yellow-dim)'
                                                        : 'transparent',
                                                color: isActive ? '#FFFFFF' : 'var(--nav-text-muted)',
                                                fontWeight: isActive ? 600 : 500,
                                                borderLeft: link.highlight && !isActive
                                                    ? '2px solid #FFD100'
                                                    : '2px solid transparent',
                                            }}
                                        >
                                            <link.icon
                                                size={16}
                                                className="flex-shrink-0"
                                                style={{ color: isActive ? '#FFFFFF' : 'var(--nav-text-muted)' }}
                                            />
                                            {link.label}
                                            {link.highlight && !isActive && (
                                                <span className="ml-auto text-[10px] font-bold text-[#FFD100]">⚡</span>
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
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-[10px] px-[10px] py-2 rounded-lg text-[12px] transition-all duration-150"
                                    style={{ color: 'var(--nav-text-muted)' }}
                                >
                                    <ExternalLink size={16} className="flex-shrink-0" />
                                    Ver sitio web
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-[10px] px-[10px] py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
                                    style={{ color: 'rgba(239,68,68,0.7)' }}
                                >
                                    <LogOut size={16} className="flex-shrink-0" />
                                    Cerrar sesión
                                </button>
                            </div>

                            {/* EMAIL */}
                            <div
                                className="flex items-center gap-2 px-[10px] py-3"
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
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}