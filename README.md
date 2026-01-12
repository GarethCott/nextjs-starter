# Next.js + AWS Amplify + TanStack Query + GraphQL Starter

A production-ready starter template for building modern web applications with authentication, data fetching, and type-safe GraphQL operations.

## Features

- **Next.js 15** with App Router
- **AWS Amplify** for Cognito authentication
- **TanStack Query** for data fetching and caching
- **GraphQL Request** client for Hasura integration
- **shadcn/ui** components with Tailwind CSS
- **GraphQL Code Generator** for type-safe operations
- **TypeScript** throughout
- Fully responsive and accessible UI

## Prerequisites

- Node.js 18+ and pnpm
- AWS Account with Cognito User Pool
- Hasura GraphQL endpoint (optional)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id

# Hasura Configuration (optional)
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://your-hasura-url.com/v1/graphql
HASURA_ADMIN_SECRET=your_admin_secret
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextjs-amplify-starter/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── confirm-email/
│   ├── (authenticated)/     # Protected routes
│   │   ├── dashboard/
│   │   └── examples/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/                # Auth-related components
│   ├── ui/                  # shadcn/ui components
│   └── navigation/
├── contexts/
│   └── auth-context.tsx     # Authentication state
├── hooks/                   # Custom React hooks
├── lib/
│   ├── amplify-config.ts
│   ├── graphql-client.ts
│   └── utils.ts
└── providers/               # React context providers
```

## Authentication

The starter includes complete authentication flows:

1. **Sign Up** - User registration with email
2. **Email Confirmation** - OTP code verification
3. **Sign In** - Secure login with Cognito
4. **Protected Routes** - Automatic route protection

### Using Authentication

```typescript
'use client'

import { useAuth } from '@/contexts/auth-context'

export function MyComponent() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## GraphQL Integration

### Creating Queries

```typescript
import { useQuery } from '@tanstack/react-query'
import { getGraphQLClient } from '@/lib/graphql-client'

const GET_USERS = `
  query GetUsers {
    users {
      id
      email
    }
  }
`

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const client = await getGraphQLClient()
      return client.request(GET_USERS)
    },
  })
}
```

### Creating Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getGraphQLClient } from '@/lib/graphql-client'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input) => {
      const client = await getGraphQLClient()
      return client.request(CREATE_USER, input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

## Hasura Setup

### JWT Configuration

Configure Hasura to accept JWT tokens from AWS Cognito:

```json
{
  "jwk_url": "https://cognito-idp.<region>.amazonaws.com/<user-pool-id>/.well-known/jwks.json",
  "claims_namespace": "https://hasura.io/jwt/claims",
  "claims_format": "stringified_json",
  "audience": "<client-id>"
}
```

### Lambda Trigger (PreTokenGeneration)

Add custom claims to JWT tokens:

```javascript
exports.handler = async (event) => {
  const hasuraClaims = {
    'x-hasura-default-role': 'user',
    'x-hasura-allowed-roles': ['user'],
    'x-hasura-user-id': event.request.userAttributes.sub,
  }
  
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        'https://hasura.io/jwt/claims': JSON.stringify(hasuraClaims),
      },
    },
  }
  
  return event
}
```

## GraphQL Code Generation

Generate TypeScript types from your GraphQL schema:

```bash
pnpm graphql-codegen
```

This will:
- Introspect your Hasura schema
- Generate TypeScript types
- Enable full type-safety for GraphQL operations

## Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm graphql-codegen  # Generate GraphQL types
```

## Adding UI Components

This starter uses shadcn/ui components:

```bash
pnpm dlx shadcn@latest add [component-name]
```

Browse components at [ui.shadcn.com](https://ui.shadcn.com)

## Deployment

### Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Compatible with:
- AWS Amplify Hosting
- Netlify
- Railway
- Any Node.js hosting

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
- AWS Amplify + Cognito
- TanStack Query v5
- graphql-request
- GraphQL Code Generator

## Architecture

This starter follows Next.js 15 best practices:

- **Route Groups** for logical organization
- **Server Components** by default
- **Client Components** only when needed
- **Edge Middleware** for route protection
- **Type-safe** GraphQL operations

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws)
- [TanStack Query Documentation](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com)
- [Hasura Documentation](https://hasura.io/docs)

## License

MIT
