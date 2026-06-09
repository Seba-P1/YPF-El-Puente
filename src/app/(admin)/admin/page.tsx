import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Package, CheckCircle, AlertTriangle, Fuel } from 'lucide-react'
import {
  getAllProductos,
  getUploadsHistorial,
  getCombustibles,
} from '@/lib/supabase/queries'
import Link from 'next/link'

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. HEADER */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
          Dashboard
        </h1>
        <p className="text-gray-500 text-lg">
          Bienvenido al panel de YPF El Puente
        </p>
        <p className="text-sm font-medium text-gray-400 mt-2">
          {format(new Date(), "EEEE d 'de' MMMM, yyyy - HH:mm", { locale: es })} hs
        </p>
      </div>

      {/* 2. GRID DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Productos"
          value={productos.length}
          icon={Package}
          color="bg-blue-50 text-[#005A9C]"
        />
        <MetricCard
          title="Productos Activos"
          value={activos}
          icon={CheckCircle}
          color="bg-green-50 text-green-600"
        />
        <MetricCard
          title="Productos Sin Precio"
          value={sinPrecio}
          icon={AlertTriangle}
          color="bg-orange-50 text-orange-600"
        />
        <MetricCard
          title="Combustibles"
          value={combustibles.length}
          icon={Fuel}
          color="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* 4. ACCESOS RÁPIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/precios"
          className="flex items-center justify-between p-6 bg-[#005A9C] text-white rounded-3xl shadow-lg hover:bg-[#004a80] hover:-translate-y-1 transition-all group"
        >
          <div>
            <h3 className="text-xl font-bold mb-1">Actualizar Precios</h3>
            <p className="text-blue-100 text-sm">Subir Excel de YPF Central</p>
          </div>
          <span className="text-3xl font-light group-hover:translate-x-2 transition-transform">
            →
          </span>
        </Link>
        
        <Link
          href="/admin/productos"
          className="flex items-center justify-between p-6 bg-white text-gray-900 border border-gray-200 rounded-3xl shadow-sm hover:border-gray-300 hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div>
            <h3 className="text-xl font-bold mb-1">Gestionar Productos</h3>
            <p className="text-gray-500 text-sm">Fotos, visibilidad y destacables</p>
          </div>
          <span className="text-3xl font-light text-gray-400 group-hover:translate-x-2 transition-transform">
            →
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. ÚLTIMAS ACTUALIZACIONES */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Últimas Actualizaciones</h2>
          
          {historial.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg font-semibold">Archivo</th>
                    <th className="px-4 py-3 font-semibold text-center">Actualizados</th>
                    <th className="px-4 py-3 font-semibold text-center">Nuevos</th>
                    <th className="px-4 py-3 font-semibold text-center">Errores</th>
                    <th className="px-4 py-3 rounded-r-lg font-semibold text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {historial.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900 truncate max-w-[150px]">
                        {item.nombre_archivo}
                      </td>
                      <td className="px-4 py-4 text-center text-blue-600 font-semibold">
                        {item.productos_actualizados}
                      </td>
                      <td className="px-4 py-4 text-center text-green-600 font-semibold">
                        {item.productos_nuevos}
                      </td>
                      <td className="px-4 py-4 text-center text-red-600 font-semibold">
                        {item.productos_error}
                      </td>
                      <td className="px-4 py-4 text-right text-gray-500 whitespace-nowrap">
                        {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-500 font-medium">Aún no se han subido archivos de precios</p>
            </div>
          )}
        </div>

        {/* 5. ESTADO DE COMBUSTIBLES */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Combustibles</h2>
            <Link href="/admin/combustibles" className="text-sm font-semibold text-[#005A9C] hover:underline">
              Editar
            </Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {combustibles.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color_hex }} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{c.nombre}</p>
                    <p className="text-xs text-gray-500">{c.octanaje || 'Combustible'}</p>
                  </div>
                </div>
                <div className="text-right">
                  {!c.precio || c.precio === 0 ? (
                    <span className="text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-md uppercase tracking-wider">
                      Sin Precio
                    </span>
                  ) : (
                    <span className="font-black text-[#005A9C]">
                      ${c.precio}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  )
}
