import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthNotFoundGate } from '@/components/auth-not-found-gate'
import { FullPageLoadGate } from '@/components/full-page-load-gate'
import { UserProvider } from '@/components/user-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'TaskFlow - AI-Powered Task Management',
  description: 'Manage your projects with AI-powered insights and Kanban boards',
  generator: 'v0.app',
  icons: {
<<<<<<< HEAD
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/icon.svg',
=======
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
>>>>>>> 49e5b84437ee1e65fd2a0242a88d6cadd9ca176f
  },
}

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <FullPageLoadGate>
          <UserProvider>
            <AuthNotFoundGate>{children}</AuthNotFoundGate>
          </UserProvider>
        </FullPageLoadGate>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

export default RootLayout
