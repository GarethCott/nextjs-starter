'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function UserMenu() {
  const { user, signOut, loading } = useAuth()

  if (!user) {
    return null
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome!</CardTitle>
        <CardDescription>You are signed in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Email:</span>{' '}
            <span className="text-muted-foreground">{user.email}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">User ID:</span>{' '}
            <span className="text-muted-foreground font-mono text-xs">{user.userId}</span>
          </div>
        </div>
        
        <Button 
          onClick={signOut} 
          variant="outline" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </CardContent>
    </Card>
  )
}
