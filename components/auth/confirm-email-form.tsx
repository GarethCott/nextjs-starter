'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export function ConfirmEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { confirmSignUp, resendConfirmationCode, loading } = useAuth()
  
  const [email, setEmail] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Get email from URL params
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      // Initialize email from URL param on mount
      setEmail(decodeURIComponent(emailParam))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setResendMessage(null)

    if (!email || email.trim() === '') {
      setLocalError('Email is required')
      return
    }

    if (!confirmationCode || confirmationCode.trim() === '') {
      setLocalError('Please enter the confirmation code')
      return
    }

    try {
      await confirmSignUp(email, confirmationCode)
      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login?confirmed=true')
      }, 2000)
    } catch (err) {
      // Handle specific confirmation errors
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase()
        
        if (errorMessage.includes('code mismatch') || errorMessage.includes('invalid code')) {
          setLocalError('Invalid confirmation code. Please check the code and try again.')
        } else if (errorMessage.includes('expired') || errorMessage.includes('expiredcode')) {
          setLocalError('Confirmation code has expired. Please request a new code.')
        } else if (errorMessage.includes('attempts') || errorMessage.includes('limit')) {
          setLocalError('Too many incorrect attempts. Please request a new code.')
        } else if (errorMessage.includes('cannot confirm') || errorMessage.includes('already confirmed')) {
          setLocalError('This account is already confirmed. Please go to the login page.')
        } else {
          setLocalError(err.message)
        }
      } else {
        setLocalError('Failed to confirm sign up. Please try again.')
      }
    }
  }
  
  const handleResendCode = async () => {
    if (!email || email.trim() === '') {
      setLocalError('Email is required to resend confirmation code')
      return
    }

    setLocalError(null)
    setResendMessage(null)
    
    try {
      await resendConfirmationCode(email)
      setResendMessage('A new confirmation code has been sent to your email!')
      setConfirmationCode('')
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase()
        
        if (errorMessage.includes('limit') || errorMessage.includes('attempt')) {
          setLocalError('Too many requests. Please wait a moment before requesting another code.')
        } else if (errorMessage.includes('already confirmed')) {
          setLocalError('This account is already confirmed. Please go to the login page.')
        } else {
          setLocalError(err.message)
        }
      } else {
        setLocalError('Failed to resend code. Please try again.')
      }
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Confirmed!</CardTitle>
          <CardDescription>Your account has been successfully verified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-4 rounded-md text-center">
            <p className="font-medium mb-2">Your email has been verified successfully!</p>
            <p className="text-xs">You can now sign in with your credentials.</p>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Redirecting to sign in page in 2 seconds...
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/login')} className="w-full">
            Go to Sign In Now
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Confirm Your Email</CardTitle>
        <CardDescription>
          Enter the confirmation code sent to your email
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleConfirmSignUp}>
        <CardContent className="space-y-4">
          {localError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {localError}
              {localError.includes('already confirmed') && (
                <div className="mt-2">
                  <Link href="/login">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-destructive underline"
                    >
                      Go to Sign In →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {resendMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-md">
              {resendMessage}
            </div>
          )}
          
          <div className="bg-muted/50 p-3 rounded-md text-sm space-y-1">
            <p className="text-muted-foreground">
              📧 Check your email inbox for a confirmation code
            </p>
            <p className="text-xs text-muted-foreground">
              The code is 6 digits and may take a few minutes to arrive. Check your spam folder if you don&apos;t see it.
            </p>
          </div>
          
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
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Confirmation Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value.trim())}
              required
              disabled={loading}
              maxLength={6}
              autoComplete="off"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={loading || !confirmationCode || !email}>
            {loading ? 'Confirming...' : 'Confirm Email'}
          </Button>
          
          <div className="flex gap-2 w-full">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={handleResendCode}
              disabled={loading || !email}
            >
              Resend Code
            </Button>
            <Link href="/login" className="flex-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="w-full"
                disabled={loading}
              >
                Back to Login
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2">
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
