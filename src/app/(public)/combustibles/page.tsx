import type { Metadata } from 'next'
import { getCombustibles } from '@/lib/supabase/queries'
import { formatearPrecioARS } from '@/lib/excel/parser'
import Link from 'next/link'
import { Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Combustibles — YPF El Puente | Río Colorado',
  description: 'Conocé los precios de nuestros combustibles YPF.',
}

export const revalidate = 60

export default async function CombustiblesPage() {
  const combustibles = await getCombustibles()

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Hero */}
      <section className="w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-[#001428] to-[#003C6E] text-white px-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-center">
          Nuestros Combustibles
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 font-medium text-center max-w-2xl">
          La máxima tecnología de YPF para el mejor rendimiento de tu motor.
        </p>
      </section>

      {/* Grid de Combustibles */}
      <section className="w-full py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {combustibles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {combustibles.map((combustible) => (
                <div
                  key={combustible.id}
                  className="flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div
                    className="w-4"
                    style={{ backgroundColor: combustible.color_hex }}
                  />
                  <div className="flex-1 p-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-1">
                      {combustible.nombre}
                    </h3>
                    {combustible.octanaje && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full mb-4">
                        {combustible.octanaje}
                      </span>
                    )}
                    <div className="mb-4">
                      {!combustible.precio || combustible.precio === 0 ? (
                        <span className="text-lg font-medium text-gray-500 italic">
                          Consultanos
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-[#005A9C]">
                            {formatearPrecioARS(combustible.precio)}
                          </span>
                          <span className="text-gray-500 font-medium">/litro</span>
                        </div>
                      )}
                    </div>
                    {combustible.descripcion && (
                      <p className="text-sm text-gray-600 line-clamp-4">
                        {combustible.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 italic text-lg">
                Precios no disponibles temporalmente.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info extra */}
      <section className="w-full py-16 bg-white px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto bg-blue-50 rounded-3xl p-8 flex gap-6 items-start">
          <Info className="w-8 h-8 text-[#005A9C] shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-[#003C6E] mb-2">
              Tecnología Infinia
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Nuestros combustibles premium (Infinia e Infinia Diesel) cuentan
              con tecnología inteligente que limpia y protege los inyectores,
              reduciendo el desgaste del motor y optimizando el consumo.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="w-full py-16 bg-[#001428] text-white text-center px-4">
        <h2 className="text-2xl font-bold mb-6">¿Tenés alguna consulta?</h2>
        <Link
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold transition-colors"
        >
          Contactanos por WhatsApp
        </Link>
      </footer>
    </div>
  )
}
