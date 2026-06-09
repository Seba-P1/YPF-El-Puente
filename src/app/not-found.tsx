import Link from 'next/link'
import { Home, Utensils } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001428] to-[#003C6E] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <p className="text-[120px] font-black text-white/10 leading-none mb-0 select-none">
          404
        </p>
        <h1 className="text-3xl font-black text-white mb-4 -mt-6">
          Página no encontrada
        </h1>
        <p className="text-blue-200 mb-10 leading-relaxed">
          La página que buscás no existe o fue movida. ¿Te llevamos al menú?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#003C6E] rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </Link>
          <Link
            href="/full"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
          >
            <Utensils className="w-5 h-5" />
            Ver Menú FULL
          </Link>
        </div>
      </div>
    </div>
  )
}
