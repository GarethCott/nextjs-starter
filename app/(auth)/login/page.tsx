import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      
      <LoginForm />

      <div className="text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
