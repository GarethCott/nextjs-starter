import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateRoleInput {
  userId: string
  role: 'free' | 'premium' | 'admin'
}

interface UpdateRoleResponse {
  success: boolean
  message: string
  userId: string
  role: string
}

/**
 * Hook to update user role (admin only)
 * 
 * This mutation calls the /api/admin/update-role endpoint
 * to change a user's role in Cognito.
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateRoleInput): Promise<UpdateRoleResponse> => {
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update user role')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate users query to refetch with updated roles
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
