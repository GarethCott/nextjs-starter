/**
 * Server-side mutation for upserting users
 * Used by API routes with admin secret
 */

export const UPSERT_USER_MUTATION = `
  mutation UpsertUser(
    $cognito_sub: String!
    $email: String
    $name: String
    $phone_number: String
    $last_login: timestamptz
    $role: String
    $is_active: Boolean
    $notifications_enabled: Boolean
    $popia_consent: Boolean
    $popia_consent_date: timestamptz
    $marketing_consent: Boolean
  ) {
    insert_users(
      objects: {
        cognito_sub: $cognito_sub
        email: $email
        name: $name
        phone_number: $phone_number
        last_login: $last_login
        role: $role
        is_active: $is_active
        notifications_enabled: $notifications_enabled
        popia_consent: $popia_consent
        popia_consent_date: $popia_consent_date
        marketing_consent: $marketing_consent
        total_points: 0
        current_streak: 0
        longest_streak: 0
        total_tips_given: 0
        total_amount_tipped: 0.00
        feedback_given: 0
      }
      on_conflict: {
        constraint: users_cognito_sub_key
        update_columns: [email, name, phone_number, updated_at, last_login]
      }
    ) {
      affected_rows
      returning {
        id
        cognito_sub
        email
        name
        phone_number
        role
        is_active
        total_points
        current_streak
        longest_streak
        total_tips_given
        total_amount_tipped
        feedback_given
        notifications_enabled
        popia_consent
        popia_consent_date
        marketing_consent
        created_at
        updated_at
        last_login
      }
    }
  }
`

export const UPDATE_USER_ROLE_MUTATION = `
  mutation UpdateUserRole(
    $cognito_sub: String!
    $email: String
    $name: String
    $phone_number: String
    $role: String!
  ) {
    insert_users(
      objects: {
        cognito_sub: $cognito_sub
        email: $email
        name: $name
        phone_number: $phone_number
        role: $role
      }
      on_conflict: {
        constraint: users_cognito_sub_key
        update_columns: [email, name, phone_number, role, updated_at]
      }
    ) {
      affected_rows
      returning {
        id
        cognito_sub
        email
        name
        phone_number
        role
        updated_at
      }
    }
  }
`

export interface UpsertUserInput {
  cognito_sub: string
  email?: string | null
  name?: string | null
  phone_number?: string | null
  last_login?: string
  role?: string
  is_active?: boolean
  notifications_enabled?: boolean
  popia_consent?: boolean
  popia_consent_date?: string | null
  marketing_consent?: boolean
}

export interface User {
  id: string
  cognito_sub: string
  email: string | null
  name: string | null
  phone_number: string | null
  role: string | null
  is_active: boolean | null
  total_points: number | null
  current_streak: number | null
  longest_streak: number | null
  total_tips_given: number | null
  total_amount_tipped: number | null
  feedback_given: number | null
  notifications_enabled: boolean | null
  popia_consent: boolean | null
  popia_consent_date: string | null
  marketing_consent: boolean | null
  created_at: string
  updated_at: string
  last_login: string | null
}

export interface UpsertUserResponse {
  insert_users: {
    affected_rows: number
    returning: User[]
  }
}

export interface UpdateUserRoleResponse {
  insert_users: {
    affected_rows: number
    returning: Array<{
      id: string
      cognito_sub: string
      email: string | null
      name: string | null
      phone_number: string | null
      role: string
      updated_at: string
    }>
  }
}
