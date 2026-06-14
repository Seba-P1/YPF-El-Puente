import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach((c) =>
            request.cookies.set(c.name, c.value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach((c) =>
            supabaseResponse.cookies.set(c.name, c.value, c.options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect /admin routes — redirect to /login if not authenticated
  if (pathname.startsWith('/admin')) {
    if (error || !user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role check for admin
    if (user.app_metadata?.role !== 'admin') {
      const unauthorizedUrl = request.nextUrl.clone()
      unauthorizedUrl.pathname = '/'
      // Set an error cookie for the client to display a toast
      supabaseResponse = NextResponse.redirect(unauthorizedUrl)
      supabaseResponse.cookies.set('admin_error', 'No tienes permisos de administrador', { path: '/' })
      return supabaseResponse
    }
  }

  // If already logged in and visiting /login, redirect to /admin
  if (pathname === '/login' && user && !error) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}