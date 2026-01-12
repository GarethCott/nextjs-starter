import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Activity, Users, CreditCard, TrendingUp, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard',
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here&apos;s what&apos;s happening with your app today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 from last hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              +4.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Quick guide to using this Next.js starter template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
                View Examples
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Check out the examples page to see how to use TanStack Query with GraphQL
              </p>
              <Button asChild variant="outline" size="sm" className="ml-8">
                <Link href="/examples">
                  Go to Examples
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
                Configure Your Backend
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Set up your AWS Amplify backend and configure the environment variables
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">3</span>
                Generate GraphQL Types
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Run <code className="bg-muted px-1 py-0.5 rounded text-xs">pnpm graphql-codegen</code> to generate TypeScript types from your schema
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Useful resources and documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">Next.js Docs</p>
                <p className="text-xs text-muted-foreground">Learn about Next.js features</p>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            
            <a
              href="https://docs.amplify.aws/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">AWS Amplify</p>
                <p className="text-xs text-muted-foreground">Authentication & backend</p>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            
            <a
              href="https://tanstack.com/query"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">TanStack Query</p>
                <p className="text-xs text-muted-foreground">Data fetching & caching</p>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">shadcn/ui</p>
                <p className="text-xs text-muted-foreground">UI component library</p>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
