'use client'

import { Amplify } from 'aws-amplify'
import { amplifyConfig } from '@/lib/amplify-config'
import { ReactNode } from 'react'

/**
 * Amplify Provider
 * 
 * Configures AWS Amplify for the application.
 * Must be a client component to use Amplify.
 */

// Configure Amplify outside the component to avoid re-configuration
Amplify.configure(amplifyConfig, { ssr: true })

export function AmplifyProvider({ children }: { children: ReactNode }) {
  // Amplify is already configured at module level
  return <>{children}</>
}
