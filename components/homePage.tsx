import React from 'react'
import { Kanban, Bot, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
function HomePage() {
  return (
    <main className="min-h-screen">
    {/* Hero Section */}
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 opacity-90">
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/35 blur-3xl animate-pulse" />
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-[42%] -translate-y-[58%] rounded-full bg-blue-400/35 blur-3xl animate-pulse [animation-delay:800ms]" />
        <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-[58%] -translate-y-[34%] rounded-full bg-violet-400/30 blur-3xl animate-pulse [animation-delay:1600ms]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),transparent_55%)]" />
 
      
      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-2">
            <Kanban className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Bot className="h-4 w-4" />
            AI-Powered Task Management
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Manage tasks smarter with{' '}
            <span className="text-primary">AI assistance</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            TaskFlow combines the power of Kanban boards with AI to help you and your team stay organized, prioritize work, and get more done.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/app/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <section className="py-20 md:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to stay productive</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to help teams collaborate and deliver projects on time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Kanban className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Kanban Boards</h3>
            <p className="text-muted-foreground">
              Visualize your workflow with customizable boards. Drag and drop tasks between columns to track progress.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-muted-foreground">
              Get intelligent suggestions for task prioritization, breakdowns, and work planning powered by AI.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground">
              Invite team members, assign tasks, and work together seamlessly across all your projects.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 md:py-32 border-t border-border bg-card">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your productivity?</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Join thousands of teams already using TaskFlow to manage their projects.
        </p>
        <Link href="/auth/register">
          <Button size="lg" className="gap-2">
            Get started for free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-8 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Kanban className="h-5 w-5 text-primary" />
          <span className="font-semibold">TaskFlow</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span>Built with Next.js</span>
        </div>
      </div>
    </footer>
  </main>
  )
}

export default HomePage