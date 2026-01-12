import { useQuery } from '@tanstack/react-query'
import { getGraphQLClient } from '@/lib/graphql-client'

/**
 * Query for venues table (public access)
 */
const GET_VENUES = `
  query GetVenues {
    venues(where: { is_active: { _eq: true } }, order_by: { name: asc }) {
      id
      name
      venue_type
      address
      city
      province
      postal_code
      country
      phone_number
      email
      pool_enabled
      pool_distribution_method
      created_at
      is_active
    }
  }
`

const GET_VENUE_BY_ID = `
  query GetVenueById($id: uuid!) {
    venues_by_pk(id: $id) {
      id
      name
      venue_type
      address
      city
      province
      postal_code
      country
      phone_number
      email
      pool_enabled
      pool_distribution_method
      created_at
      updated_at
      is_active
    }
  }
`

export interface Venue {
  id: string
  name: string
  venue_type: string
  address: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  country: string | null
  phone_number: string | null
  email: string | null
  pool_enabled: boolean | null
  pool_distribution_method: string | null
  created_at: string | null
  updated_at?: string | null
  is_active: boolean | null
}

interface GetVenuesResponse {
  venues: Venue[]
}

interface GetVenueByIdResponse {
  venues_by_pk: Venue | null
}

/**
 * Get all active venues (public access - works without authentication)
 */
export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const client = await getGraphQLClient()
      const data = await client.request<GetVenuesResponse>(GET_VENUES)
      return data.venues
    },
    // This should work even without authentication
    retry: 1,
  })
}

/**
 * Get a single venue by ID
 */
export function useVenue(venueId: string) {
  return useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const client = await getGraphQLClient()
      const data = await client.request<GetVenueByIdResponse>(GET_VENUE_BY_ID, { id: venueId })
      return data.venues_by_pk
    },
    enabled: !!venueId,
  })
}
