'use client'

import { useVenues } from '@/hooks/use-venues-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail } from 'lucide-react'

export function VenuesList() {
  const { data: venues, isLoading, error } = useVenues()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Unable to Load Venues</CardTitle>
          <CardDescription>
            There was a problem loading the venues list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-lg">
            <p className="text-sm font-medium text-destructive mb-2">Error Details:</p>
            <pre className="text-xs overflow-x-auto">{error.message}</pre>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Setup Required:</p>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Go to Hasura Console</li>
              <li>Navigate to Data → venues → Permissions</li>
              <li>Add <code className="bg-background px-1 rounded">unauth</code> role with select permission</li>
              <li>Set permission to: <code className="bg-background px-1 rounded">{JSON.stringify({ is_active: { _eq: true } })}</code></li>
              <li>Select all columns for read access</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!venues || venues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Venues Found</CardTitle>
          <CardDescription>There are currently no active venues available.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Venues (Public Data)</h2>
          <p className="text-muted-foreground">
            Example of querying public data without authentication - {venues.length} venue{venues.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <Card key={venue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {venue.venue_type}
                  </Badge>
                </div>
                {venue.pool_enabled && (
                  <Badge variant="outline" className="text-xs">
                    Pool Enabled
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {venue.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="text-muted-foreground">
                    <div>{venue.address}</div>
                    {venue.city && venue.province && (
                      <div>
                        {venue.city}, {venue.province}
                      </div>
                    )}
                    {venue.postal_code && <div>{venue.postal_code}</div>}
                  </div>
                </div>
              )}

              {venue.phone_number && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${venue.phone_number}`} className="hover:text-foreground">
                    {venue.phone_number}
                  </a>
                </div>
              )}

              {venue.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${venue.email}`} className="hover:text-foreground">
                    {venue.email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
