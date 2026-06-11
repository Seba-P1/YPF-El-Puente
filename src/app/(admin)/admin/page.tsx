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
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CurrentDateTime } from './CurrentDateTime'

export const metadata = {
  title: 'Dashboard — Admin YPF El Puente',
}

export default async function AdminDashboardPage() {
  const [productos, historial, combustibles] = await Promise.all([
    getAllProductos(),
    getUploadsHistorial(5),
    getCombustibles(),
  ])

  const activos = productos.filter((p) => p.disponible).length
  const sinPrecio = productos.filter((p) => !p.precio || p.precio === 0).length

  const metricas = [
    {
      label: 'Total productos',
      valor: productos.length,
      icono: Package,
      colorBg: '#EFF6FF',
      colorIcon: '#005A9C',
    },
    {
      label: 'Productos activos',
      valor: activos,
      icono: CheckCircle2,
      colorBg: '#F0FDF4',
      colorIcon: '#059669',
    },
    {
      label: 'Sin precio',
      valor: sinPrecio,
      icono: AlertTriangle,
      colorBg: '#FFFBEB',
      colorIcon: '#D97706',
      subinfo: 'Requieren actualización',
    },
    {
      label: 'Combustibles',
      valor: combustibles.length,
      icono: Fuel,
      colorBg: '#FFF7ED',
      colorIcon: '#EA580C',
    },
  ]

  const accesos = [
    { icono: Upload, titulo: 'Actualizar precios', desc: 'Subir Excel de YPF Central', href: '/admin/precios' },
    { icono: Package, titulo: 'Productos', desc: 'Gestionar el menú', href: '/admin/productos' },
    { icono: Fuel, titulo: 'Combustibles', desc: 'Precios de nafta', href: '/admin/combustibles' },
    { icono: Settings, titulo: 'Configuración', desc: 'WhatsApp y ajustes', href: '/admin/configuracion' },
  ]

  return (
    <div>
      {/* PAGE HEADER */}
      <div
        className="pb-5 mb-6"
        style={{ borderBottom: '1px solid #E2E8F0' }}
      >
        <h1 className="text-[22px] font-bold" style={{ color: '#0F172A' }}>
          Dashboard
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: '#64748B' }}>
          Panel de control · YPF El Puente
        </p>
        <CurrentDateTime />
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {metricas.map((m) => (
          <div
            key={m.label}
            className="flex items-start justify-between p-4 rounded-xl transition-all duration-200 cursor-default bg-white border border-[#E2E8F0] hover:border-[#005A9C] hover:shadow-[0_4px_12px_rgba(0,90,156,0.08)]"
          >
            <div>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: '#64748B' }}
              >
                {m.label}
              </span>
              <div
                className="text-[28px] font-extrabold mt-1 leading-none"
                style={{ color: '#0F172A' }}
              >
                {m.valor}
              </div>
              {m.subinfo && (
                <div className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>
                  {m.subinfo}
                </div>
              )}
            </div>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: m.colorBg }}
            >
              <m.icono size={18} style={{ color: m.colorIcon }} />
            </div>
          </div>
        ))}
      </div>

      {/* DOS COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-4 mb-6">

        {/* COLUMNA 1 — ÚLTIMAS ACTUALIZACIONES */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'white', border: '1px solid #E2E8F0' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Upload size={16} style={{ color: '#005A9C' }} />
              <span className="text-[14px] font-bold" style={{ color: '#0F172A' }}>
                Últimas actualizaciones
              </span>
            </div>
            <Link
              href="/admin/precios"
              className="text-[12px] transition-colors"
              style={{ color: '#005A9C' }}
            >
              Ver todo →
            </Link>
          </div>

          {historial.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <FileX size={32} style={{ color: '#94A3B8' }} />
              <span className="text-[13px]" style={{ color: '#94A3B8' }}>
                Sin actualizaciones aún
              </span>
              <Link
                href="/admin/precios"
                className="text-[12px] font-medium mt-1"
                style={{ color: '#005A9C' }}
              >
                Subir primer archivo
              </Link>
            </div>
          ) : (
            <div>
              {historial.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-[10px]"
                  style={{
                    borderBottom: i < historial.length - 1 ? '1px solid #E2E8F0' : 'none',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F0FDF4' }}
                  >
                    <FileText size={14} style={{ color: '#059669' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-medium truncate"
                      style={{ color: '#0F172A' }}
                    >
                      {item.nombre_archivo}
                    </div>
                    <div className="text-[11px]" style={{ color: '#64748B' }}>
                      {item.productos_actualizados} actualizados
                    </div>
                  </div>
                  <div className="text-[11px] flex-shrink-0" style={{ color: '#94A3B8' }}>
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

        {/* COLUMNA 2 — ESTADO DE COMBUSTIBLES */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'white', border: '1px solid #E2E8F0' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] font-bold" style={{ color: '#0F172A' }}>
              Estado de combustibles
            </span>
            <Link
              href="/admin/combustibles"
              className="text-[12px] transition-colors"
              style={{ color: '#005A9C' }}
            >
              Actualizar
            </Link>
          </div>

          <div>
            {combustibles.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-[10px]"
                style={{
                  borderBottom: i < combustibles.length - 1 ? '1px solid #E2E8F0' : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 rounded-sm"
                    style={{
                      width: '4px',
                      height: '16px',
                      background: c.color_hex || '#005A9C',
                    }}
                  />
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: '#0F172A' }}
                  >
                    {c.nombre}
                  </span>
                </div>
                {!c.precio || c.precio === 0 ? (
                  <span
                    className="text-[11px] px-2 py-0.5 rounded"
                    style={{
                      background: '#FFFBEB',
                      color: '#D97706',
                    }}
                  >
                    Sin precio
                  </span>
                ) : (
                  <span
                    className="text-[14px] font-bold"
                    style={{ color: '#005A9C' }}
                  >
                    {formatearPrecioARS(c.precio)} /L
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div>
        <p
          className="text-[13px] font-semibold uppercase tracking-[0.06em] mb-3"
          style={{ color: '#64748B' }}
        >
          Accesos rápidos
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
          {accesos.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 p-[14px] rounded-[10px] transition-all duration-150 group bg-white border border-[#E2E8F0] hover:border-[#005A9C] hover:bg-[#EFF6FF]"
            >
              <a.icono size={18} style={{ color: '#005A9C', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate" style={{ color: '#0F172A' }}>
                  {a.titulo}
                </div>
                <div className="text-[11px] truncate" style={{ color: '#64748B' }}>
                  {a.desc}
                </div>
              </div>
              <ChevronRight size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}