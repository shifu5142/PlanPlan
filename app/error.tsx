'use client'

import Link from 'next/link'
import { Kanban, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ErrorPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-destructive/5 via-transparent to-transparent" />

      <section className="relative w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        {/* Content */}
        <p className="text-sm font-medium uppercase tracking-widest text-destructive mb-3">
          Unexpected Error
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
          Something Went Wrong
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground mb-8 max-w-md mx-auto">
          An unexpected error occurred while loading this page. Please return to the home
          page and try again.
        </p>

        <Link href="/">
          <Button size="lg" className="h-12 px-6 shadow-sm">
            Back to Home Page
          </Button>
        </Link>

        {/* Logo */}
        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground">
          <Kanban className="h-5 w-5" />
          <span className="font-semibold">TaskFlow</span>
        </div>
      </section>
    </main>
  )
}

export default ErrorPage
