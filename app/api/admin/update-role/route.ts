import { NextRequest, NextResponse } from 'next/server'
import { runWithAmplifyServerContext } from '@/lib/amplify-server-utils'
import { fetchAuthSession } from 'aws-amplify/auth/server'
import { AdminUpdateUserAttributesCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

/**
 * API Route: Update User Role
 * 
 * This endpoint allows admins to update user roles in Cognito.
 * The role will be stored in the custom:role attribute and will
 * automatically be included in the JWT via PreTokenGeneration Lambda.
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

    // 6. Update user role in Cognito
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      Username: userId, // Cognito uses sub as username internally
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: role,
        },
      ],
    })

    await cognito.send(command)

    // 7. Optionally update role in Hasura (if you have a users table)
    // This requires making a GraphQL request to your Hasura instance
    // using the admin secret
    
    // Example:
    // const hasuraResponse = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
    //   },
    //   body: JSON.stringify({
    //     query: `
    //       mutation UpdateUserRole($cognito_sub: String!, $role: String!) {
    //         update_users(
    //           where: { cognito_sub: { _eq: $cognito_sub } }
    //           _set: { role: $role }
    //         ) {
    //           affected_rows
    //         }
    //       }
    //     `,
    //     variables: { cognito_sub: userId, role },
    //   }),
    // })

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
      userId,
      role,
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
