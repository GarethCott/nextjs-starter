import { ResourcesConfig } from 'aws-amplify'

/**
 * Amplify Configuration for existing Cognito User Pool
 * 
 * This connects to your existing AWS Cognito setup.
 * Update these values with your own Cognito User Pool details.
 * 
 * Note: Password requirements and user attribute settings are configured
 * in your AWS Cognito User Pool settings, not here.
 */
export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      // Your Cognito User Pool ID
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_8ZIamqiYT',
      
      // Your Cognito User Pool Client ID
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'llvhetg72plpj0mt5umsuqgpa',
      
      // Sign in with email
      loginWith: {
        email: true,
      },
      
      // Email verification method
      signUpVerificationMethod: 'code',
    },
  },
}
