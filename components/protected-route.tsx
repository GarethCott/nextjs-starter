'use client'

import { useAuth } from '@/contexts/auth-context'

/**
 * Protected Route Component
 * 
 * Wraps client components that require authentication.
 * Note: Route-level protection is handled by middleware.ts for better performance.
 * This component is useful for:
 * - Client-side components that need auth state
 * - Showing loading states during auth checks
 * - Additional auth checks for nested components
 * 
 * For full page protection, middleware.ts handles redirects at the edge.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
