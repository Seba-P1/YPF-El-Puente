import { format } from 'date-fns'
import { getUploadsHistorial } from '@/lib/supabase/queries'
import { ExcelUploader } from '@/components/admin/ExcelUploader'
import { FileUp, FileDown, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Actualizar Precios — Admin YPF El Puente',
}

export default async function AdminPreciosPage() {
  const historial = await getUploadsHistorial(10)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Actualización de Precios
        </h1>
        <p className="text-gray-500 mt-1 text-lg">
          Subí el Excel oficial para actualizar masivamente el menú.
        </p>
      </div>

      {/* Main Uploader Feature */}
      <ExcelUploader />

      {/* Upload History */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-gray-400" />
            Historial de Actualizaciones
          </h2>
        </div>

        {historial.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Archivo</th>
                  <th className="px-6 py-4 text-center">Total Filas</th>
                  <th className="px-6 py-4 text-center text-blue-600">Actualizados</th>
                  <th className="px-6 py-4 text-center text-green-600">Nuevos</th>
                  <th className="px-6 py-4 text-center text-red-600">Errores</th>
                  <th className="px-6 py-4 text-right">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historial.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <FileDown className="w-4 h-4 text-gray-400" />
                        <span className="truncate max-w-[200px]" title={item.nombre_archivo}>
                          {item.nombre_archivo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-700">
                      {item.total_filas}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">
                      {item.productos_actualizados}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-green-600">
                      {item.productos_nuevos}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.productos_error > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3" />
                          {item.productos_error}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <FileUp className="w-8 h-8" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Aún no hay historial de actualizaciones.
            </p>
            <p className="text-gray-400">
              Cuando subas tu primer archivo Excel, aparecerá aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
