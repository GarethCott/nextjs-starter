import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getGraphQLClient } from '@/lib/graphql-client'

/**
 * Example: GraphQL Mutation Hook
 * 
 * This demonstrates how to use TanStack Query mutations with GraphQL.
 * Replace with your actual mutations after running codegen.
 */

const CREATE_USER_MUTATION = `
  mutation CreateUser($email: String!, $name: String) {
    insert_users_one(object: { email: $email, name: $name }) {
      id
      email
      name
      created_at
    }
  }
`

interface CreateUserInput {
  email: string
  name?: string
}

interface User {
  id: string
  email: string
  name: string | null
  created_at: string
}

interface CreateUserResponse {
  insert_users_one: User
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const client = await getGraphQLClient()
      const data = await client.request<CreateUserResponse>(CREATE_USER_MUTATION, input)
      return data.insert_users_one
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
    },
  })
}

/**
 * Example: Update Mutation
 */
const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: uuid!, $name: String) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
      id
      name
    }
  }
`

interface UpdateUserInput {
  id: string
  name: string
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const client = await getGraphQLClient()
      return client.request(UPDATE_USER_MUTATION, input)
    },
    onSuccess: (_, variables) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * After running codegen, your mutations will be fully typed:
 * 
 * import { graphql } from '@/gql'
 * 
 * const CREATE_USER = graphql(`
 *   mutation CreateUser($email: String!) {
 *     insert_users_one(object: { email: $email }) {
 *       id
 *       email
 *     }
 *   }
 * `)
 * 
 * export function useCreateUser() {
 *   const queryClient = useQueryClient()
 *   
 *   return useMutation({
 *     mutationFn: async (input) => {
 *       const client = await getGraphQLClient()
 *       // input and response are fully typed!
 *       return client.request(CREATE_USER, input)
 *     },
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['users'] })
 *     }
 *   })
 * }
 */
