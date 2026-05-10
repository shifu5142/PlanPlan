'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import NotFound from '@/app/not-found'
import { PageLoadingIndicator } from '@/components/page-loading-indicator'

const TOKEN_KEY = 'token'

function isPublicPath(pathname: string) {
  if (pathname === '/') return true
  if (pathname === '/auth' || pathname.startsWith('/auth/')) return true
  return false
}

export function AuthNotFoundGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const publicRoute = isPublicPath(pathname)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (publicRoute) {
    return <>{children}</>
  }

  if (!mounted) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Checking access"
      >
        <PageLoadingIndicator />
      </div>
    )
  }

  try {
    if (!localStorage.getItem(TOKEN_KEY)) {
      return <NotFound />
    }
  } catch {
    return <NotFound />
  }

  return <>{children}</>
}
