import { NextRequest, NextResponse } from 'next/server'
import { runWithAmplifyServerContext } from '@/lib/amplify-server-utils'
import { fetchAuthSession } from 'aws-amplify/auth/server'
import { 
  AdminUpdateUserAttributesCommand,
  AdminGetUserCommand,
  CognitoIdentityProviderClient 
} from '@aws-sdk/client-cognito-identity-provider'
import { getServerGraphQLClient } from '@/lib/graphql-client'
import { UPDATE_USER_ROLE_MUTATION, type UpdateUserRoleResponse } from '@/hooks/use-upsert-user'

/**
 * API Route: Update User Role
 * 
 * This endpoint allows admins to update user roles in BOTH Cognito AND Hasura.
 * 
 * Steps:
 * 1. Updates the custom:role attribute in Cognito
 * 2. Creates/updates the user in Hasura with the new role
 * 
 * The role will be automatically included in the JWT via PreTokenGeneration Lambda.
 * 
 * POST /api/admin/update-role
 * Body: { userId: string, role: string }
 */

const cognito = new CognitoIdentityProviderClient({ 
  region: process.env.AWS_REGION || 'us-east-1' 
})

// Valid roles - customize based on your needs
const VALID_ROLES = ['free', 'premium', 'admin'] as const
type Role = typeof VALID_ROLES[number]

interface UpdateRoleRequest {
  userId: string // Cognito sub (user ID)
  role: Role
}

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    
    // 1. Verify the requesting user is authenticated
    const authenticated = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec)
          return !!session.tokens
        } catch {
          return false
        }
      },
    })

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Get current user's role from their session
    const currentUserRole = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec) => {
        const session = await fetchAuthSession(contextSpec)
        const token = session.tokens?.idToken
        
        if (!token) return null
        
        // Decode JWT to get Hasura claims
        const payload = JSON.parse(
          Buffer.from(token.toString().split('.')[1], 'base64').toString()
        )
        
        const hasuraClaims = payload['https://hasura.io/jwt/claims']
        if (typeof hasuraClaims === 'string') {
          const claims = JSON.parse(hasuraClaims)
          return claims['x-hasura-default-role']
        }
        
        return null
      },
    })

    // 3. Check if user has admin role
    if (currentUserRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // 4. Parse request body
    const body: UpdateRoleRequest = await request.json()
    const { userId, role } = body

    // 5. Validate input
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and role' },
        { status: 400 }
      )
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Valid roles: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      )
    }

    // 6. Get user details from Cognito first
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      Username: userId,
    })
    
    const cognitoUser = await cognito.send(getUserCommand)
    const userEmail = cognitoUser.UserAttributes?.find(attr => attr.Name === 'email')?.Value || null
    const userName = cognitoUser.UserAttributes?.find(attr => attr.Name === 'name')?.Value || null
    const userPhone = cognitoUser.UserAttributes?.find(attr => attr.Name === 'phone_number')?.Value || null

    // 7. Update user role in Cognito
    const updateCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      Username: userId,
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: role,
        },
      ],
    })

    await cognito.send(updateCommand)

    // 8. Update user role in Hasura (creates user if doesn't exist)
    const client = getServerGraphQLClient()
    const hasuraData = await client.request<UpdateUserRoleResponse>(UPDATE_USER_ROLE_MUTATION, {
      cognito_sub: userId,
      email: userEmail,
      name: userName,
      phone_number: userPhone,
      role: role,
    })

    const updatedUser = hasuraData.insert_users.returning[0]

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role} in both Cognito and Hasura`,
      userId,
      role,
      hasuraUser: updatedUser,
    })

  } catch (error) {
    console.error('Error updating user role:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to update user role',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
