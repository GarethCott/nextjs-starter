'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export function SignupForm() {
  const router = useRouter()
  const { signUp, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [popiaConsent, setPopiaConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!name || name.trim() === '') {
      setLocalError('Name is required')
      return
    }

    if (!popiaConsent) {
      setLocalError('You must accept the Privacy Policy and Terms of Service to continue')
      return
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters')
      return
    }

    try {
      // Pass name and phone_number as custom attributes
      const attributes: Record<string, string> = {
        name,
      }
      if (phoneNumber && phoneNumber.trim() !== '') {
        attributes.phone_number = phoneNumber
      }
      const result = await signUp(email, password, attributes)
      
      // Check if confirmation is needed
      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        // Store consent data in localStorage to use after confirmation
        if (typeof window !== 'undefined') {
          localStorage.setItem('pendingConsent', JSON.stringify({
            popiaConsent,
            marketingConsent,
            consentDate: new Date().toISOString()
          }))
        }
        // Redirect to confirmation page
        router.push(`/confirm-email?email=${encodeURIComponent(email)}`)
      } else if (result.nextStep?.signUpStep === 'DONE') {
        // User is already confirmed, redirect to login
        router.push('/login?confirmed=true')
      }
      
    } catch (err) {
      // Handle specific error types
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase()
        
        if (errorMessage.includes('user already exists') || errorMessage.includes('usernameexistsexception')) {
          setLocalError('An account with this email already exists. Please sign in instead.')
        } else if (errorMessage.includes('password') && errorMessage.includes('requirements')) {
          setLocalError('Password must be at least 8 characters with uppercase, lowercase, and numbers.')
        } else if (errorMessage.includes('invalid email')) {
          setLocalError('Please enter a valid email address.')
        } else {
          setLocalError(err.message)
        }
      } else {
        setLocalError('Failed to sign up. Please try again.')
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up for a new account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSignUp}>
        <CardContent className="space-y-4">
          {localError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {localError}
              {localError.includes('already exists') && (
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
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              autoComplete="name"
            />
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
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+27 12 345 6789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
              autoComplete="tel"
            />
            <p className="text-xs text-muted-foreground">
              Optional - for notifications and account recovery
            </p>
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
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              At least 8 characters with uppercase and lowercase letters and numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="popiaConsent" 
                checked={popiaConsent}
                onCheckedChange={(checked) => setPopiaConsent(checked === true)}
                disabled={loading}
                required
              />
              <label 
                htmlFor="popiaConsent" 
                className="text-sm leading-tight cursor-pointer"
              >
                I accept the{' '}
                <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link href="/terms" className="text-primary hover:underline" target="_blank">
                  Terms of Service
                </Link>
                {' '}(required for POPIA compliance)
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="marketingConsent" 
                checked={marketingConsent}
                onCheckedChange={(checked) => setMarketingConsent(checked === true)}
                disabled={loading}
              />
              <label 
                htmlFor="marketingConsent" 
                className="text-sm leading-tight cursor-pointer text-muted-foreground"
              >
                I want to receive promotional emails and updates (optional)
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={loading || !popiaConsent}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
