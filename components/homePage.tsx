import React from 'react'
import {
  ArrowRight,
  Bot,
  Kanban,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { HomeTestimonialsSection } from '@/components/home-testimonials'
import { Button } from './ui/button'

function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 opacity-95">
          <div className="absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/35 blur-3xl transition-opacity duration-500" />
          <div className="absolute top-1/2 left-1/2 h-[26rem] w-[26rem] translate-x-[-42%] translate-y-[-58%] animate-pulse rounded-full bg-chart-4/35 blur-3xl [animation-delay:800ms]" />
          <div className="absolute top-1/2 left-1/2 h-[22rem] w-[22rem] translate-x-[-58%] translate-y-[-34%] animate-pulse rounded-full bg-chart-5/35 blur-3xl [animation-delay:1600ms]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),transparent_55%)] dark:bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--background),transparent_55%),transparent_55%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-32">
          {/* Nav */}
          <nav className="mb-16 flex items-center justify-between md:mb-24">
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-lg py-1 pr-2 transition-transform duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 transition-all duration-200 group-hover:bg-primary/15 group-hover:shadow-md">
                <Kanban className="size-6 transition-transform duration-200 group-hover:scale-105" aria-hidden />
              </span>
              <span className="font-bold text-xl tracking-tight transition-colors duration-200 group-hover:text-primary">
                TaskFlow
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="transition-all duration-200 hover:bg-muted">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm shadow-sm ring-1 ring-primary/15 transition-all duration-200 hover:bg-primary/[0.13] hover:shadow-md motion-safe:hover:gap-3">
              <Bot className="size-4" aria-hidden />
              AI-Powered Task Management
              <Sparkles className="size-4 opacity-80" aria-hidden />
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Manage tasks smarter with{' '}
              <span className="bg-gradient-to-br from-primary to-chart-4 bg-clip-text text-transparent">
                AI assistance
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              TaskFlow combines the power of Kanban boards with AI to help you and your team stay organized, prioritize work,
              and get more done.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="group w-full gap-2 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto active:translate-y-0 active:scale-[0.98]">
                  Start for free
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </Button>
              </Link>
              <Link href="/app/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary/25 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/12 hover:shadow-md sm:w-auto active:scale-[0.98]"
                >
                  <LayoutDashboard className="mr-2 size-4 opacity-70" aria-hidden />
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="border-border border-t py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything you need to stay productive</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features designed to help teams collaborate and deliver projects on time.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <article className="group rounded-xl border border-border bg-card p-6 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/20">
              <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner ring-2 ring-primary/20 transition-all duration-300 group-hover:bg-primary/[0.15] group-hover:ring-primary/30">
                <Kanban className="size-7 transition-transform duration-300 group-hover:scale-110" aria-hidden />
              </div>
              <h3 className="mb-2 text-xl font-semibold transition-colors duration-200 group-hover:text-primary">Kanban Boards</h3>
              <p className="leading-relaxed text-muted-foreground">
                Visualize your workflow with customizable boards. Drag and drop tasks between columns to track progress.
              </p>
            </article>

            <article className="group rounded-xl border border-border bg-card p-6 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-chart-5/35">
              <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-chart-5/15 text-chart-5 shadow-inner ring-2 ring-chart-5/30 transition-all duration-300 group-hover:bg-chart-5/20">
                <Zap className="size-7 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden />
              </div>
              <h3 className="mb-2 text-xl font-semibold transition-colors duration-200 group-hover:text-primary">AI Assistant</h3>
              <p className="leading-relaxed text-muted-foreground">
                Get intelligent suggestions for task prioritization, breakdowns, and work planning powered by AI.
              </p>
            </article>

            <article className="group rounded-xl border border-border bg-card p-6 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-chart-2/35">
              <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-chart-2/15 text-chart-2 shadow-inner ring-2 ring-chart-2/30 transition-all duration-300 group-hover:bg-chart-2/20">
                <Users className="size-7 transition-transform duration-300 group-hover:scale-110" aria-hidden />
              </div>
              <h3 className="mb-2 text-xl font-semibold transition-colors duration-200 group-hover:text-primary">Team Collaboration</h3>
              <p className="leading-relaxed text-muted-foreground">
                Invite team members, assign tasks, and work together seamlessly across all your projects.
              </p>
            </article>
          </div>
        </div>
      </section>

      <HomeTestimonialsSection />

      {/* CTA Section */}
      <section className="border-border border-t bg-card py-20 md:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background px-4 py-2 shadow-sm ring-1 ring-chart-2/30 transition-transform duration-200 hover:scale-[1.02]">
              <ShieldCheck className="size-5 text-chart-2" aria-hidden />
              <span className="font-medium text-muted-foreground text-sm">Trusted by builders worldwide</span>
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to boost your productivity?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of teams already using TaskFlow to manage their projects.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="gap-2 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]">
              Get started for free
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-muted/60">
            <Kanban className="size-5 text-primary" aria-hidden />
            <span className="font-semibold">TaskFlow</span>
          </div>
          <p className="text-muted-foreground text-sm">Kanban-first productivity for modern teams.</p>
        </div>
      </footer>
    </main>
  )
}

export default HomePage
