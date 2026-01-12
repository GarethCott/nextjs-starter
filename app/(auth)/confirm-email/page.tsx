import { ConfirmEmailForm } from '@/components/auth/confirm-email-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Confirm Email',
  description: 'Enter your confirmation code to verify your email address',
}

export default function ConfirmEmailPage() {
  return <ConfirmEmailForm />
}
