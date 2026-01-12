'use client'

import { useEffect, useState } from 'react'
import { useUsers, useCurrentUser } from '@/hooks/use-example-query'
import { useSchemaIntrospection } from '@/hooks/use-introspection'
import { useAuth } from '@/contexts/auth-context'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TestUsersQuery() {
  const { user: authUser } = useAuth()
  const { data: schema, isLoading: schemaLoading, error: schemaError } = useSchemaIntrospection()
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers()
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser(authUser?.userId || '')
  const [tokenInfo, setTokenInfo] = useState<any>(null)

  useEffect(() => {
    async function inspectToken() {
      try {
        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString()
        
        if (token) {
          // Decode JWT (basic base64 decode - for debugging only!)
          const parts = token.split('.')
          const payload = JSON.parse(atob(parts[1]))
          
          console.log('JWT Token Payload:', payload)
          console.log('Hasura Claims:', payload['https://hasura.io/jwt/claims'])
          
          setTokenInfo({
            payload,
            hasuraClaims: payload['https://hasura.io/jwt/claims'],
            rawToken: token.substring(0, 50) + '...'
          })
        }
      } catch (error) {
        console.error('Error inspecting token:', error)
      }
    }
    
    if (authUser) {
      inspectToken()
    }
  }, [authUser])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>JWT Token Info</CardTitle>
          <CardDescription>Inspect your Cognito JWT token and Hasura claims</CardDescription>
        </CardHeader>
        <CardContent>
          {tokenInfo ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Hasura Claims</h4>
                {tokenInfo.hasuraClaims ? (
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {typeof tokenInfo.hasuraClaims === 'string' 
                      ? tokenInfo.hasuraClaims 
                      : JSON.stringify(tokenInfo.hasuraClaims, null, 2)}
                  </pre>
                ) : (
                  <div className="bg-destructive/10 p-3 rounded">
                    <p className="text-sm text-destructive font-medium">No Hasura claims found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your PreTokenGeneration Lambda may not be adding Hasura claims to the JWT.
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Full Token Payload</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto max-h-64">
                  {JSON.stringify(tokenInfo.payload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading token info...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Tables/Queries</CardTitle>
          <CardDescription>What you can query based on your role permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {schemaLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : schemaError ? (
            <div className="bg-destructive/10 p-3 rounded">
              <p className="text-sm text-destructive font-medium">Error:</p>
              <pre className="text-xs mt-2">{schemaError.message}</pre>
            </div>
          ) : schema ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-2">
                Found {schema.length} available queries:
              </p>
              <div className="bg-muted p-3 rounded max-h-64 overflow-y-auto">
                <ul className="text-xs space-y-1 font-mono">
                  {schema.map((field) => (
                    <li key={field.name} className="py-1">
                      <span className="text-primary">{field.name}</span>
                      {field.description && (
                        <span className="text-muted-foreground ml-2">- {field.description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current User (from Hasura)</CardTitle>
          <CardDescription>Query your user data by cognito_sub</CardDescription>
        </CardHeader>
        <CardContent>
          {currentUserLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : currentUser ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="font-medium">Name:</span>
                <span>{currentUser.name || 'N/A'}</span>
                
                <span className="font-medium">Email:</span>
                <span>{currentUser.email || 'N/A'}</span>
                
                <span className="font-medium">Total Points:</span>
                <span>{currentUser.total_points}</span>
                
                <span className="font-medium">Current Streak:</span>
                <span>{currentUser.current_streak} days</span>
                
                <span className="font-medium">Total Tips:</span>
                <span>{currentUser.total_tips_given}</span>
                
                <span className="font-medium">Amount Tipped:</span>
                <span>R{currentUser.total_amount_tipped}</span>
                
                <span className="font-medium">Status:</span>
                <span>
                  <Badge variant={currentUser.is_active ? 'default' : 'secondary'}>
                    {currentUser.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </span>
              </div>
              <pre className="mt-4 bg-muted p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No user found in database</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>List of all users in the database</CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : usersError ? (
            <div className="space-y-2">
              <p className="text-sm text-destructive">Error loading users:</p>
              <pre className="bg-destructive/10 p-3 rounded text-xs overflow-x-auto">
                {usersError.message}
              </pre>
            </div>
          ) : users && users.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Found {users.length} user(s)</p>
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{user.name || user.email || 'Unknown'}</span>
                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>Points: {user.total_points}</span>
                    <span>Streak: {user.current_streak} days</span>
                    <span>Tips: {user.total_tips_given}</span>
                    <span>Amount: R{user.total_amount_tipped}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No users found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
