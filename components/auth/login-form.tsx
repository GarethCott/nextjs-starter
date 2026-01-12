'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Check for confirmation success message
  useEffect(() => {
    const confirmed = searchParams.get('confirmed')
    if (confirmed === 'true') {
      setSuccessMessage('Email confirmed successfully! You can now sign in.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)

    try {
      await signIn(email, password)
      // Success! The auth context will handle the redirect
    } catch (err) {
      // Handle specific error types
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase()
        
        if (errorMessage.includes('user does not exist') || errorMessage.includes('usernotfound')) {
          setLocalError('No account found with this email. Please sign up first.')
        } else if (errorMessage.includes('incorrect username or password') || errorMessage.includes('notauthorized')) {
          setLocalError('Incorrect email or password. Please try again.')
        } else if (errorMessage.includes('user is not confirmed') || errorMessage.includes('usernotconfirmed')) {
          // Redirect to confirmation page with email
          router.push(`/confirm-email?email=${encodeURIComponent(email)}`)
          return
        } else if (errorMessage.includes('password attempts exceeded') || errorMessage.includes('limitexceeded')) {
          setLocalError('Too many failed login attempts. Please try again later or reset your password.')
        } else {
          setLocalError(err.message)
        }
      } else {
        setLocalError('Failed to sign in. Please try again.')
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-md">
              {successMessage}
            </div>
          )}

          {(error || localError) && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error || localError}
              {(error?.includes('sign up') || localError?.includes('sign up')) && (
                <div className="mt-2">
                  <Link href="/signup">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-destructive underline"
                    >
                      Go to Sign Up →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
