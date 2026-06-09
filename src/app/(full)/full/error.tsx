'use client'

import Link from 'next/link'
import { RefreshCw, Home } from 'lucide-react'

export default function FullMenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">😔</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-4">
          Algo salió mal
        </h1>
        <p className="text-gray-400 mb-10 leading-relaxed">
          No pudimos cargar el menú en este momento. Esto puede deberse a un
          problema temporal de conexión. Probá de nuevo en unos segundos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#005A9C] text-white rounded-full font-bold hover:bg-[#004a80] transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
