import { useQuery } from '@tanstack/react-query'
import { getGraphQLClient } from '@/lib/graphql-client'

/**
 * Example: Basic GraphQL Query Hook
 * 
 * This demonstrates how to use TanStack Query with GraphQL Request.
 * Replace this with your actual Hasura queries after running codegen.
 * 
 * Steps to use with your Hasura schema:
 * 1. Add HASURA_ADMIN_SECRET to .env.local
 * 2. Run: pnpm graphql-codegen
 * 3. Import generated types: import { graphql } from '@/gql'
 * 4. Use typed queries!
 */

// Query for your users table
const GET_USERS = `
  query GetUsers {
    users(limit: 100, order_by: { created_at: desc }) {
      id
      cognito_sub
      name
      email
      total_points
      current_streak
      longest_streak
      total_tips_given
      total_amount_tipped
      created_at
      updated_at
      last_login
      is_active
    }
  }
`

interface User {
  id: string
  cognito_sub: string
  name: string | null
  email: string | null
  total_points: number | null
  current_streak: number | null
  longest_streak: number | null
  total_tips_given: number | null
  total_amount_tipped: number | null
  created_at: string | null
  updated_at: string | null
  last_login: string | null
  is_active: boolean | null
}

interface GetUsersResponse {
  users: User[]
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const client = await getGraphQLClient()
      const data = await client.request<GetUsersResponse>(GET_USERS)
      return data.users
    },
    // Optional: Only fetch when user is authenticated
    enabled: true,
  })
}

/**
 * Query current user by cognito_sub
 */
const GET_USER_BY_COGNITO_SUB = `
  query GetUserByCognitoSub($cognito_sub: String!) {
    users(where: { cognito_sub: { _eq: $cognito_sub } }, limit: 1) {
      id
      cognito_sub
      name
      email
      total_points
      current_streak
      longest_streak
      total_tips_given
      total_amount_tipped
      created_at
      is_active
    }
  }
`

interface GetUserByCognitoSubResponse {
  users: User[]
}

export function useCurrentUser(cognitoSub: string) {
  return useQuery({
    queryKey: ['user', cognitoSub],
    queryFn: async () => {
      const client = await getGraphQLClient()
      const data = await client.request<GetUserByCognitoSubResponse>(GET_USER_BY_COGNITO_SUB, { cognito_sub: cognitoSub })
      return data.users[0] || null
    },
    enabled: !!cognitoSub,
  })
}

/**
 * After running codegen, your hooks will look like this:
 * 
 * import { graphql } from '@/gql'
 * 
 * const GET_USERS = graphql(`
 *   query GetUsers {
 *     users {
 *       id
 *       email
 *     }
 *   }
 * `)
 * 
 * export function useUsers() {
 *   return useQuery({
 *     queryKey: ['users'],
 *     queryFn: async () => {
 *       const client = await getGraphQLClient()
 *       // data is now fully typed!
 *       const data = await client.request(GET_USERS)
 *       return data.users
 *     }
 *   })
 * }
 */
