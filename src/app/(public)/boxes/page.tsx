import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Droplets,
  Gauge,
  Thermometer,
  Eye,
  Activity,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Boxes — YPF El Puente | Río Colorado',
  description: 'Servicio de Boxes especializado en YPF El Puente. Cambio de aceite, revisión y más.',
}

const SERVICIOS = [
  { icon: Droplets, text: 'Cambio de aceite', desc: 'Lubricantes Elaion con la mejor tecnología.' },
  { icon: Gauge, text: 'Inflado de neumáticos', desc: 'Control de presión y calibración.' },
  { icon: Thermometer, text: 'Agua y refrigerante', desc: 'Revisión y reposición de fluidos.' },
  { icon: Eye, text: 'Limpieza de parabrisas', desc: 'Para tu máxima visibilidad en la ruta.' },
  { icon: Activity, text: 'Control de presión', desc: 'Seguridad garantizada para tu viaje.' },
  { icon: CheckCircle, text: 'Revisión general', desc: 'Chequeo de 20 puntos clave de tu vehículo.' },
]

export default function BoxesPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || ''

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Hero */}
      <section className="w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-[#001428] to-[#003C6E] text-white px-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-center">
          Servicio de Boxes
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 font-medium text-center max-w-2xl">
          El cuidado experto que tu vehículo necesita.
        </p>
      </section>

      {/* Servicios */}
      <section className="w-full py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#003C6E] mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-gray-500 text-lg">
              Profesionales capacitados por YPF a tu disposición.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICIOS.map((Servicio, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-blue-100 text-[#005A9C] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Servicio.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {Servicio.text}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {Servicio.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horarios y Ubicación */}
      <section className="w-full py-16 bg-gray-50 px-4 border-t border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6">
            <Clock className="w-8 h-8 text-[#005A9C] shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Horarios de Atención</h3>
              <p className="text-gray-600 mb-1">Lunes a Viernes: 08:00 a 20:00 hs</p>
              <p className="text-gray-600 mb-1">Sábados: 08:00 a 14:00 hs</p>
              <p className="text-gray-400 text-sm mt-2 italic">Domingos y feriados cerrado</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6">
            <MapPin className="w-8 h-8 text-[#005A9C] shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600 mb-1">YPF El Puente</p>
              <p className="text-gray-600">Río Colorado, Provincia de Río Negro</p>
              <p className="text-gray-400 text-sm mt-2 italic">Patagonia Argentina</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="w-full py-20 bg-[#001428] text-white text-center px-4">
        <h2 className="text-3xl font-black mb-4">¿Necesitás un turno?</h2>
        <p className="text-blue-200 mb-10 max-w-xl mx-auto text-lg">
          Escribinos por WhatsApp y coordinamos el horario que mejor te quede para traer tu vehículo.
        </p>
        <Link
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-[#25D366]/20"
        >
          Solicitar Turno por WhatsApp
        </Link>
      </footer>
    </div>
  )
}
