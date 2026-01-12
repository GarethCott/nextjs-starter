import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TestUsersQuery } from '@/components/test-users-query'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Learn how to use TanStack Query with GraphQL Request',
}

export default function ExamplesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Examples</h1>
        <p className="text-muted-foreground">
          Test your Hasura database connection
        </p>
      </div>

      <TestUsersQuery />

      <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Query Example</CardTitle>
                <CardDescription>Fetching data with TanStack Query</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Check out <code className="bg-muted px-1 py-0.5 rounded">hooks/use-example-query.ts</code> to see how to create query hooks.
                </p>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const client = await getGraphQLClient()
      return client.request(GET_USERS)
    }
  })
}`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mutation Example</CardTitle>
                <CardDescription>Creating and updating data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Check out <code className="bg-muted px-1 py-0.5 rounded">hooks/use-example-mutation.ts</code> for mutation examples.
                </p>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`export function useCreateUser() {
  return useMutation({
    mutationFn: async (input) => {
      const client = await getGraphQLClient()
      return client.request(CREATE_USER, input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    }
  })
}`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GraphQL Client</CardTitle>
                <CardDescription>Authenticated GraphQL requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  The GraphQL client automatically includes your JWT token from Cognito.
                </p>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`// lib/graphql-client.ts
const client = await getGraphQLClient()

// Automatically includes:
// Authorization: Bearer <jwt-token>

const data = await client.request(query)`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Generation</CardTitle>
                <CardDescription>Type-safe GraphQL operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Run GraphQL Code Generator to get full TypeScript types for your Hasura schema.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-mono bg-muted p-2 rounded">pnpm graphql-codegen</p>
                  <p className="text-xs text-muted-foreground">
                    This generates types in the <code>gql/</code> folder based on your Hasura schema.
                  </p>
                </div>
              </CardContent>
            </Card>
      </div>

      <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>How to use this starter with your Hasura backend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Configure Environment Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Copy <code className="bg-muted px-1 py-0.5 rounded">.env.example</code> to{' '}
                  <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> and add your Hasura admin secret
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. Generate Types</h3>
                <p className="text-sm text-muted-foreground">
                  Run <code className="bg-muted px-1 py-0.5 rounded">pnpm graphql-codegen</code> to generate TypeScript types from your schema
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">3. Write Queries</h3>
                <p className="text-sm text-muted-foreground">
                  Import <code className="bg-muted px-1 py-0.5 rounded">graphql</code> from <code className="bg-muted px-1 py-0.5 rounded">@/gql</code> and write type-safe queries
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">4. Create Hooks</h3>
                <p className="text-sm text-muted-foreground">
                  Use <code className="bg-muted px-1 py-0.5 rounded">useQuery</code> and{' '}
                  <code className="bg-muted px-1 py-0.5 rounded">useMutation</code> to create reusable data hooks
                </p>
              </div>
            </CardContent>
      </Card>
    </div>
  )
}
