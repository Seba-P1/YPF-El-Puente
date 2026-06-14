import 'server-only'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string; code?: string }

// In-memory rate limit (sliding window simple)
const rateBuckets = new Map<string, number[]>()

function checkRateLimit(key: string, max: number): boolean {
  const now = Date.now()
  const arr = (rateBuckets.get(key) ?? []).filter(t => now - t < 60_000)
  if (arr.length >= max) return false
  arr.push(now)
  rateBuckets.set(key, arr)
  return true
}

export function withAdminAction<TSchema extends z.ZodTypeAny, TResult>(
  schema: TSchema,
  handler: (input: z.infer<TSchema>, ctx: { userId: string; email: string }) => Promise<TResult>,
  opts?: { rateLimitKey?: string; maxPerMinute?: number }
) {
  return async (raw: unknown): Promise<ActionResult<TResult>> => {
    // 1. Validar
    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      return { ok: false, error: 'Datos inválidos', code: 'VALIDATION' }
    }

    // 2. Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: 'No autenticado', code: 'AUTH' }
    if (user.app_metadata?.role !== 'admin') return { ok: false, error: 'Sin permisos', code: 'FORBIDDEN' }

    // 3. Rate limit (memory store simple; reemplazar por Upstash en prod)
    const key = `${user.id}:${opts?.rateLimitKey ?? 'default'}`
    if (!checkRateLimit(key, opts?.maxPerMinute ?? 30)) {
      return { ok: false, error: 'Demasiadas peticiones', code: 'RATE_LIMITED' }
    }

    // 4. Ejecutar
    try {
      const result = await handler(parsed.data, { userId: user.id, email: user.email ?? '' })
      return { ok: true, data: result }
    } catch (err) {
      console.error('[admin action]', err)
      return { ok: false, error: err instanceof Error ? err.message : 'Error interno', code: 'INTERNAL' }
    }
  }
}
