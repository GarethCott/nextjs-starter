import { UserRoleManager } from '@/components/admin/user-role-manager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - User Management',
  description: 'Manage user roles and permissions',
}

export default function AdminPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>

      <UserRoleManager />

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">How Role Management Works</h3>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>Admin updates a user's role using this interface</li>
          <li>Role is stored in Cognito's <code>custom:role</code> attribute</li>
          <li>PreTokenGeneration Lambda adds role to JWT claims</li>
          <li>User must sign out and sign in again to get new JWT</li>
          <li>Hasura uses the role from JWT for permissions</li>
        </ol>
      </div>
    </div>
  )
}
