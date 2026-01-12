'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VenuesList } from '@/components/venues-list'
import Link from 'next/link'

export function HomeContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Next.js Starter Template
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AWS Amplify (Cognito) + TanStack Query + GraphQL Request + shadcn/ui
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>
              {user ? `Welcome, ${user.email}!` : 'Get Started'}
            </CardTitle>
            <CardDescription>
              {user 
                ? 'You are authenticated. Try the protected dashboard or sign out.'
                : 'Sign in or create an account to get started'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <>
                <Button asChild className="flex-1">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/examples">View Examples</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="flex-1">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Example: Public data query without authentication */}
      <VenuesList />
    </div>
  )
}
