import { HomeContent } from '@/components/home-content'
import { Navbar } from '@/components/navigation/navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js + Amplify + TanStack Query Starter',
  description: 'A production-ready starter template with AWS Amplify, TanStack Query, and GraphQL',
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-16 flex-1">
        <HomeContent />
      </main>
    </div>
  )
}
