import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * GraphQL Code Generator Configuration
 * 
 * This generates TypeScript types from your Hasura GraphQL schema.
 * 
 * Setup:
 * 1. Add your Hasura endpoint URL below
 * 2. Add your Hasura admin secret to .env.local as HASURA_ADMIN_SECRET
 * 3. Run: pnpm graphql-codegen
 * 
 * This will generate types in the `gql` folder that you can import in your code.
 */

const config: CodegenConfig = {
  // Your Hasura GraphQL endpoint
  schema: [
    {
      'https://cfca-lms.hasura.app/v1/graphql': {
        headers: {
          // Use admin secret for introspection
          'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || '',
        },
      },
    },
  ],
  
  // Where to look for GraphQL queries/mutations in your code
  documents: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'hooks/**/*.{ts,tsx}'],
  
  // Output directory for generated types
  generates: {
    './gql/': {
      preset: 'client',
      plugins: [],
      config: {
        // Use lowercase for scalars (string instead of String)
        scalars: {
          uuid: 'string',
          timestamptz: 'string',
          jsonb: 'Record<string, any>',
        },
      },
    },
  },
  
  // Generate types when files change in watch mode
  ignoreNoDocuments: true,
}

export default config
