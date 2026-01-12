import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AmplifyProvider } from "@/providers/amplify-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { TooltipProvider } from "@/providers/tooltip-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js + Amplify + TanStack Starter",
  description: "A starter template with Next.js, AWS Amplify (Cognito), TanStack Query, and GraphQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AmplifyProvider>
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
