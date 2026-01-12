import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import { amplifyConfig } from './amplify-config'

/**
 * Server-side Amplify utilities for Next.js
 * 
 * This creates a server context runner that allows you to use
 * Amplify APIs on the server side (SSR, API routes, middleware, etc.)
 */
export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
})
