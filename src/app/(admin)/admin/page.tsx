import Link from 'next/link'
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  Upload,
  Settings,
  FileText,
  FileX,
  ChevronRight,
} from 'lucide-react'
import { getAllProductos, getUploadsHistorial, getCombustibles } from '@/lib/supabase/queries'
import { formatearPrecioARS } from '@/lib/excel/parser'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { CurrentDateTime } from './CurrentDateTime'
import { GlassCard } from '@/components/admin/ui/glass-card'

export const metadata = {
  title: 'Dashboard — Admin YPF El Puente',
}

export default async function AdminDashboardPage() {
  const [result, historial, combustibles] = await Promise.all([
    getAllProductos(),
    getUploadsHistorial(5),
    getCombustibles(),
  ])

  const productos = result.data

  const activos = productos.filter((p) => p.disponible).length
  const sinPrecio = productos.filter((p) => !p.precio || p.precio === 0).length

  const metricas = [
    {
      label: 'Total productos',
      valor: productos.length,
      icono: Package,
      colorBg: 'rgba(59, 130, 246, 0.1)',
      colorIcon: '#3b82f6',
    },
    {
      label: 'Productos activos',
      valor: activos,
      icono: CheckCircle2,
      colorBg: 'rgba(16, 185, 129, 0.1)',
      colorIcon: '#10b981',
    },
    {
      label: 'Sin precio',
      valor: sinPrecio,
      icono: AlertTriangle,
      colorBg: 'rgba(245, 158, 11, 0.1)',
      colorIcon: '#f59e0b',
      subinfo: 'Requieren actualización',
    },
    {
      label: 'Combustibles',
      valor: combustibles.length,
      icono: Fuel,
      colorBg: 'rgba(249, 115, 22, 0.1)',
      colorIcon: '#f97316',
    },
  ]

  const accesos = [
    { icono: Upload, titulo: 'Actualizar precios', desc: 'Subir Excel de YPF Central', href: '/admin/precios' },
    { icono: Package, titulo: 'Productos', desc: 'Gestionar el menú', href: '/admin/productos' },
    { icono: Fuel, titulo: 'Combustibles', desc: 'Precios de nafta', href: '/admin/combustibles' },
    { icono: Settings, titulo: 'Configuración', desc: 'WhatsApp y ajustes', href: '/admin/configuracion' },
  ]

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Panel de control · YPF El Puente
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3.5 py-2 rounded-xl border border-border/30 w-fit">
          <CurrentDateTime />
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((m) => (
          <GlassCard
            key={m.label}
            className="flex items-start justify-between p-6 transition-all duration-300"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {m.label}
              </span>
              <div className="text-3xl font-extrabold mt-2 leading-none text-foreground">
                {m.valor}
              </div>
              {m.subinfo && (
                <div className="text-xs mt-2 text-amber-500 font-medium">
                  {m.subinfo}
                </div>
              )}
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: m.colorBg }}
            >
              <m.icono size={20} style={{ color: m.colorIcon }} />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* DOS COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMNA 1 — ÚLTIMAS ACTUALIZACIONES */}
        <GlassCard className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/20">
            <div className="flex items-center gap-2.5">
              <Upload size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Últimas actualizaciones
              </h2>
            </div>
            <Link
              href="/admin/precios"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ver todo →
            </Link>
          </div>

          <div className="flex-1">
            {historial.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <FileX size={40} className="text-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">
                  Sin actualizaciones aún
                </span>
                <Link
                  href="/admin/precios"
                  className="text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20"
                >
                  Subir primer archivo
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {historial.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 border border-primary/20">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {item.nombre_archivo}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          +{item.productos_nuevos} nuevos
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                          {item.productos_actualizados} actualizados
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* COLUMNA 2 — ESTADO DE COMBUSTIBLES */}
        <GlassCard className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/20">
            <div className="flex items-center gap-2.5">
              <Fuel size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Estado de combustibles
              </h2>
            </div>
            <Link
              href="/admin/combustibles"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ver combustibles →
            </Link>
          </div>

          <div className="flex-1">
            <div className="divide-y divide-border/20">
              {combustibles.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="shrink-0 rounded-full"
                      style={{
                        width: '10px',
                        height: '10px',
                        background: c.color_hex || 'var(--ypf-blue)',
                        boxShadow: `0 0 8px ${c.color_hex || 'var(--ypf-blue)'}60`,
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {c.nombre}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        {c.octanaje || 'Combustible'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.disponible ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                      {c.disponible ? 'Activo' : 'Desactivado'}
                    </span>
                    {!c.precio || c.precio === 0 ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        Sin precio
                      </span>
                    ) : (
                      <span className="text-sm font-extrabold text-foreground">
                        {formatearPrecioARS(c.precio)}/L
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {accesos.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300 glass-card hover:border-primary/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary border border-primary/20 transition-colors group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                  <a.icono size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {a.titulo}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {a.desc}
                  </div>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}