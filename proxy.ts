import { fetchAuthSession } from 'aws-amplify/auth/server'
import { NextRequest, NextResponse } from 'next/server'
import { runWithAmplifyServerContext } from '@/lib/amplify-server-utils'

/**
 * Next.js 16 Proxy for Authentication
 * 
 * This proxy function handles route protection and auth-based redirects:
 * - Protects authenticated routes (dashboard, examples)
 * - Redirects authenticated users away from auth pages (login, signup)
 */
export default async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // Check if user is authenticated
  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec)
        return (
          session.tokens?.accessToken !== undefined &&
          session.tokens?.idToken !== undefined
        )
      } catch {
        return false
      }
    },
  })

  // Define protected and auth routes
  const protectedRoutes = ['/dashboard', '/examples']
  const authRoutes = ['/login', '/signup', '/confirm-email']

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect authenticated users away from auth pages to dashboard
  if (authenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users from protected pages to login
  if (!authenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow request to continue
  return response
}

/**
 * Configure which routes the proxy should run on
 * 
 * Matches:
 * - Protected routes: /dashboard, /examples
 * - Auth routes: /login, /signup, /confirm-email
 * 
 * Does NOT match:
 * - API routes (/api/*)
 * - Static files (/_next/static/*)
 * - Image optimization (/_next/image/*)
 * - Public assets (favicon.ico, etc.)
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/examples/:path*',
    '/login',
    '/signup',
    '/confirm-email',
  ],
}
