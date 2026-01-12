'use client'

import { useState } from 'react'
import { useUsers } from '@/hooks/use-example-query'
import { useUpdateUserRole } from '@/hooks/use-update-user-role'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const ROLES = [
  { value: 'free', label: 'Free', variant: 'secondary' as const },
  { value: 'premium', label: 'Premium', variant: 'default' as const },
  { value: 'admin', label: 'Admin', variant: 'destructive' as const },
]

export function UserRoleManager() {
  const { data: users, isLoading, error } = useUsers()
  const updateRole = useUpdateUserRole()
  
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; currentRole: string } | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [showDialog, setShowDialog] = useState(false)
  const [updatingKey, setUpdatingKey] = useState<string | null>(null) // Format: "userId-role"

  const handleRoleChange = (userId: string, userName: string, currentRole: string, newRole: string) => {
    setSelectedUser({ id: userId, name: userName, currentRole })
    setSelectedRole(newRole)
    setShowDialog(true)
  }

  const confirmRoleChange = async () => {
    if (!selectedUser || !selectedRole) return

    const updateKey = `${selectedUser.id}-${selectedRole}`
    setUpdatingKey(updateKey)
    
    try {
      await updateRole.mutateAsync({
        userId: selectedUser.id,
        role: selectedRole as 'free' | 'premium' | 'admin',
      })
      
      setShowDialog(false)
      setSelectedUser(null)
      setSelectedRole('')
    } catch (error) {
      console.error('Failed to update role:', error)
    } finally {
      setUpdatingKey(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-48 bg-muted rounded"></div>
                  <div className="h-2 w-64 bg-muted rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-muted rounded"></div>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                  <div className="h-8 w-16 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>Failed to load users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>
            Update user roles to control access levels in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{user.name || user.email || 'Unknown User'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">ID: {user.cognito_sub}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ROLES.map((role) => {
                      const isCurrentRole = user.cognito_sub === role.value // You'd need to add role to user type
                      const buttonKey = `${user.cognito_sub}-${role.value}`
                      const isThisButtonUpdating = updatingKey === buttonKey
                      const isAnyButtonUpdating = updatingKey !== null && updatingKey.startsWith(user.cognito_sub)
                      
                      return (
                        <Button
                          key={role.value}
                          variant={isCurrentRole ? role.variant : 'outline'}
                          size="sm"
                          onClick={() => handleRoleChange(
                            user.cognito_sub,
                            user.name || user.email || 'Unknown',
                            'free', // Current role - you'd get this from user data
                            role.value
                          )}
                          disabled={isAnyButtonUpdating}
                        >
                          {isThisButtonUpdating ? (
                            <span className="flex items-center gap-2">
                              <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                              {role.label}
                            </span>
                          ) : (
                            role.label
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No users found
            </div>
          )}

          {updateRole.isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-700 font-medium">
                ❌ Error: {updateRole.error instanceof Error ? updateRole.error.message : 'Failed to update role'}
              </div>
            </div>
          )}

          {updateRole.isSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-700 font-medium">
                ✅ Role updated successfully! The user will see the new role on their next login.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the role of <strong>{selectedUser?.name}</strong> from{' '}
              <strong>{selectedUser?.currentRole}</strong> to <strong>{selectedRole}</strong>?
              <br /><br />
              This will take effect on their next login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
