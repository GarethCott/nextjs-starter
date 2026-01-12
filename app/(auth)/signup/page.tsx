import { SignupForm } from '@/components/auth/signup-form'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account to get started',
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      
      <SignupForm />

      <div className="text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
