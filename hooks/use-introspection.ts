import { useQuery } from '@tanstack/react-query'
import { getGraphQLClient } from '@/lib/graphql-client'

/**
 * Introspection query to see what's available in the schema
 */
const INTROSPECTION_QUERY = `
  query IntrospectSchema {
    __schema {
      queryType {
        fields {
          name
          description
        }
      }
    }
  }
`

interface IntrospectionResponse {
  __schema: {
    queryType: {
      fields: Array<{
        name: string
        description: string | null
      }>
    }
  }
}

export function useSchemaIntrospection() {
  return useQuery({
    queryKey: ['schema-introspection'],
    queryFn: async () => {
      const client = await getGraphQLClient()
      const data = await client.request<IntrospectionResponse>(INTROSPECTION_QUERY)
      return data.__schema.queryType.fields
    },
    retry: false,
  })
}
