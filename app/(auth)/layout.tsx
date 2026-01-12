import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Auth',
    default: 'Authentication',
  },
}

/**
 * Auth Layout
 * 
 * Simple centered layout for authentication pages (login, signup, confirm-email)
 * No navigation or extra UI elements
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {children}
    </div>
  )
}
