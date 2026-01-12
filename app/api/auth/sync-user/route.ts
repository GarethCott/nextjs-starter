import { NextRequest, NextResponse } from 'next/server'
import { runWithAmplifyServerContext } from '@/lib/amplify-server-utils'
import { fetchAuthSession } from 'aws-amplify/auth/server'
import { getServerGraphQLClient } from '@/lib/graphql-client'
import { UPSERT_USER_MUTATION, type UpsertUserResponse } from '@/hooks/use-upsert-user'

/**
 * API Route: Sync User to Hasura
 * 
 * This endpoint syncs the authenticated user's information from Cognito to Hasura.
 * Called automatically after sign-in to ensure user exists in Hasura database.
 * 
 * Why this exists:
 * - When a user signs in, their data from Cognito needs to be synced to Hasura
 * - This creates a new user record if they don't exist, or updates their info if they do
 * - Stores: cognito_sub, email, name, phone_number (all unencrypted), and last_login
 * 
 * POST /api/auth/sync-user
 */

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    
    // 1. Get consent data from request body (if provided)
    let consentData = null
    try {
      consentData = await request.json()
    } catch {
      // No body or invalid JSON - that's okay, use defaults
    }
    
    // 2. Get authenticated user's session
    const session = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec) => {
        try {
          return await fetchAuthSession(contextSpec)
        } catch {
          return null
        }
      },
    })

    if (!session?.tokens) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 3. Extract user information from JWT token
    const token = session.tokens.idToken
    
    if (!token) {
      return NextResponse.json(
        { error: 'No ID token found' },
        { status: 401 }
      )
    }
    
    const payload = JSON.parse(
      Buffer.from(token.toString().split('.')[1], 'base64').toString()
    )
    
    const cognitoSub = payload.sub
    const email = payload.email
    const name = payload.name
    const phoneNumber = payload.phone_number

    if (!cognitoSub) {
      return NextResponse.json(
        { error: 'Invalid token - missing user ID' },
        { status: 400 }
      )
    }

    // 4. Upsert user in Hasura using GraphQL client
    const client = getServerGraphQLClient()
    const data = await client.request<UpsertUserResponse>(UPSERT_USER_MUTATION, {
      cognito_sub: cognitoSub,
      email: email || null,
      name: name || null,
      phone_number: phoneNumber || null,
      last_login: new Date().toISOString(),
      role: 'free', // Default role for new users
      is_active: true,
      notifications_enabled: true,
      popia_consent: consentData?.popiaConsent || false,
      popia_consent_date: consentData?.popiaConsentDate || null,
      marketing_consent: consentData?.marketingConsent || false,
    })

    const userData = data.insert_users.returning[0]

    return NextResponse.json({
      success: true,
      message: 'User synced to Hasura',
      user: userData,
    })

  } catch (error) {
    console.error('Error syncing user:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to sync user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
