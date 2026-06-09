'use client'

import Link from 'next/link'
import { RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001428] to-[#003C6E] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-4">
          Ocurrió un error
        </h1>
        <p className="text-blue-200 mb-10 leading-relaxed">
          Lo sentimos, algo no funcionó como esperábamos. Intentá recargar la
          página o volvé al inicio.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#003C6E] rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
