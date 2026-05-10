import Link from 'next/link'
import { Kanban, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <section className="relative w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>

        {/* Content */}
        <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
          Error 404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for does not exist, was moved, or the URL is incorrect.
        </p>

        <Link href="/">
          <Button size="lg" className="h-12 px-6 shadow-sm">
            Return to Home
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

export default NotFound
