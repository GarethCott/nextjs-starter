import { GraphQLClient } from 'graphql-request'
import { fetchAuthSession } from 'aws-amplify/auth'

/**
 * GraphQL Client Configuration for Hasura
 * 
 * This creates a GraphQL client that automatically includes
 * the JWT token from Cognito in requests to Hasura.
 */

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'https://tap-to-tip.hasura.app/v1/graphql'

/**
 * Create a GraphQL client with authentication
 * Call this function to get a client with the current user's token
 */
export async function getGraphQLClient(): Promise<GraphQLClient> {
  const client = new GraphQLClient(HASURA_GRAPHQL_URL)

  try {
    // Get the current session from Amplify
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.toString()

    if (token) {
      // Add the JWT token to the Authorization header
      client.setHeader('Authorization', `Bearer ${token}`)
    }
  } catch {
    // User is not authenticated, continue without token
    console.log('No auth token available')
  }

  return client
}

/**
 * Create a basic GraphQL client without authentication
 * Useful for public queries or when using admin secret
 */
export function getPublicGraphQLClient(): GraphQLClient {
  const headers: Record<string, string> = {}

  // If you want to use admin secret for server-side operations
  if (process.env.HASURA_ADMIN_SECRET) {
    headers['x-hasura-admin-secret'] = process.env.HASURA_ADMIN_SECRET
  }

  return new GraphQLClient(HASURA_GRAPHQL_URL, { headers })
}

/**
 * For Server Components or Server Actions
 * This version works in server environments
 */
export function getServerGraphQLClient(): GraphQLClient {
  const headers: Record<string, string> = {}

  // Use admin secret for server-side operations
  if (process.env.HASURA_ADMIN_SECRET) {
    headers['x-hasura-admin-secret'] = process.env.HASURA_ADMIN_SECRET
  }

  return new GraphQLClient(HASURA_GRAPHQL_URL, { headers })
}
