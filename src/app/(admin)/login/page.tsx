'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, ingresá email y contraseña.')
      return
    }

    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setLoading(false)
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Credenciales incorrectas. Verificá tu email y contraseña.')
      } else {
        setError(signInError.message)
      }
      return
    }

    // Success!
    const redirectTo = searchParams.get('redirectTo') || '/admin'
    router.push(redirectTo)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <div className="w-32 h-16 relative mb-8 invert">
        <Image
          src="/assets/logo/logo-white-wide.png"
          alt="YPF El Puente"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="bg-white w-full rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-gray-500 font-medium">
            YPF El Puente — Río Colorado
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#005A9C] focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="admin@ypfelpuente.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#005A9C] focus:border-transparent outline-none transition-all text-gray-900"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#005A9C] transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-8 bg-[#005A9C] hover:bg-[#004a80] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#005A9C]/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#001428] to-[#003C6E] p-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 text-white animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
