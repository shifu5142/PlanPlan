import Link from 'next/link'

function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_45%)]" />

      <section className="relative w-full max-w-xl rounded-2xl border border-border/60 bg-card/80 p-10 text-center shadow-xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Error 404
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The page you are looking for does not exist, was moved, or the URL is incorrect.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Return to Home
        </Link>
      </section>
    </main>
  )
}

export default NotFound
