'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  getCurrentUser, 
  fetchUserAttributes, 
  signIn, 
  signUp, 
  signOut, 
  confirmSignUp,
  resendSignUpCode,
  type SignUpOutput,
} from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'

/**
 * Auth Context for AWS Cognito
 * 
 * Provides authentication state and methods throughout the app.
 */

interface User {
  userId: string
  username: string
  email?: string
  attributes?: Record<string, unknown>
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string, skipRedirect?: boolean) => Promise<void>
  signUp: (email: string, password: string, attributes?: Record<string, string>) => Promise<SignUpOutput>
  signOut: () => Promise<void>
  confirmSignUp: (email: string, code: string) => Promise<void>
  resendConfirmationCode: (email: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkUser()
  }, [])

  // Listen to auth events
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUser()
          break
        case 'signedOut':
          setUser(null)
          break
        case 'tokenRefresh':
          checkUser()
          break
        case 'tokenRefresh_failure':
          setUser(null)
          break
      }
    })

    return unsubscribe
  }, [])

  const checkUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()
      
      setUser({
        userId: currentUser.userId,
        username: currentUser.username,
        email: attributes.email,
        attributes,
      })
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string, skipRedirect = false) => {
    try {
      setLoading(true)
      setError(null)
      
      await signIn({ username: email, password })
      await checkUser()
      
      // Redirect to dashboard after successful sign in (unless skipRedirect is true)
      if (!skipRedirect && typeof window !== 'undefined') {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (
    email: string, 
    password: string, 
    attributes?: Record<string, string>
  ): Promise<SignUpOutput> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            ...attributes,
          },
        },
      })
      
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign up'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await signOut()
      setUser(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSignUp = async (email: string, code: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await confirmSignUp({ username: email, confirmationCode: code })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confirm sign up'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmationCode = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await resendSignUpCode({ username: email })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend confirmation code'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    refreshUser: checkUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use the Auth Context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
