import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query'

/**
 * Query Client Factory
 * 
 * Creates a new QueryClient instance with sensible defaults
 * for server rendering and client-side data fetching.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: true,
        retry: 1,
      },
      dehydrate: {
        // Include pending queries in dehydration for streaming
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * Get Query Client
 * 
 * Returns a QueryClient instance. On the server, always creates a new one.
 * On the client, reuses the same instance to avoid recreating on every render.
 */
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}
