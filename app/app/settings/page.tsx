import Link from 'next/link'
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  CreditCard,
  LayoutGrid,
  Lock,
  Palette,
  Plug,
  Shield,
  Sliders,
  User,
  UserCircle,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SettingsPageHeader } from './components/settings-page-header'
import { SETTINGS_NAV } from './components/nav-config'

const quickTips = [
  { title: 'Verify your email', detail: 'Add a backup address for receipts and alerts.', done: true },
  { title: 'Enable two-factor authentication', detail: 'Add an extra layer to your workspace.', done: false },
  { title: 'Invite a teammate', detail: 'Collaborate on boards with shared visibility.', done: false },
]

const highlights = [
  {
    title: 'Profile & identity',
    description: 'Avatar, bio, role, and how others see you on boards.',
    href: '/app/settings/profile',
    icon: User,
  },
  {
    title: 'Appearance',
    description: 'Theme, density, and typography tuned to your workflow.',
    href: '/app/settings/appearance',
    icon: Palette,
  },
  {
    title: 'Notifications',
    description: 'Email, reminders, digests — without noise.',
    href: '/app/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Security',
    description: 'Password hygiene, sessions, and sign-in alerts.',
    href: '/app/settings/security',
    icon: Shield,
  },
  {
    title: 'Billing',
    description: 'Plan usage, invoices, and payment methods.',
    href: '/app/settings/billing',
    icon: CreditCard,
  },
  {
    title: 'Team',
    description: 'Members, roles, and invitations.',
    href: '/app/settings/team',
    icon: Users,
  },
]

export default function SettingsOverviewPage() {
  return (
    <>
      <SettingsPageHeader
        title="General"
        description="Manage workspace preferences and personal settings. Changes here are illustrative only."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'General' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-primary/25 bg-primary/[0.04] lg:col-span-2 shadow-sm lg:rounded-xl">
          <CardHeader className="border-none pb-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl">Workspace health</CardTitle>
                <CardDescription>
                  A lightweight checklist — connect these when you wire up the backend.
                </CardDescription>
              </div>
              <span className="rounded-full bg-primary/15 px-2.5 py-1 font-medium text-primary text-xs uppercase tracking-wide">
                Preview
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {quickTips.map((item) => (
              <div
                key={item.title}
                className="flex gap-3 rounded-lg border bg-card/80 px-3 py-3 shadow-sm ring-1 ring-foreground/5"
              >
                <div className="pt-0.5">
                  <CheckCircle2
                    className={`size-5 ${item.done ? 'text-success' : 'text-muted-foreground/40'}`}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="font-medium leading-none">{item.title}</p>
                  <p className="text-muted-foreground text-sm">{item.detail}</p>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" className="gap-1">
                Review security
              </Button>
              <Button type="button" size="sm" className="gap-1" asChild>
                <Link href="/app/settings/team">
                  Invite people
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutGrid className="size-4 text-primary" aria-hidden />
              All sections
            </CardTitle>
            <CardDescription>Jump anywhere from the sidebar on desktop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="max-h-[280px] space-y-1 overflow-auto pr-1">
              {SETTINGS_NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="size-3.5 opacity-50" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-semibold text-lg">Featured settings</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full shadow-sm ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-md lg:rounded-xl">
                  <CardHeader className="space-y-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-5 text-primary" aria-hidden />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="mt-1">{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="inline-flex items-center gap-1 font-medium text-primary text-sm">
                      Open
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
          <Link href="/app/settings/account">
            <Card className="h-full shadow-sm ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-md lg:rounded-xl">
              <CardHeader className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <UserCircle className="size-5 text-primary" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base">Account</CardTitle>
                  <CardDescription className="mt-1">
                    Email sign-in, language, timezone, connected sessions at a glance.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-flex items-center gap-1 font-medium text-primary text-sm">
                  Open
                  <ArrowUpRight className="size-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/app/settings/integrations">
            <Card className="h-full shadow-sm ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-md lg:rounded-xl">
              <CardHeader className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Plug className="size-5 text-primary" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base">Integrations</CardTitle>
                  <CardDescription className="mt-1">
                    Connect tools, automate handoffs, and manage API surfaces.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-flex items-center gap-1 font-medium text-primary text-sm">
                  Open
                  <ArrowUpRight className="size-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/app/settings/preferences">
            <Card className="h-full shadow-sm ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-md lg:rounded-xl">
              <CardHeader className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Sliders className="size-5 text-primary" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base">Preferences</CardTitle>
                  <CardDescription className="mt-1">
                    Boards defaults, shortcuts, automation nudges, and calendars.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-flex items-center gap-1 font-medium text-primary text-sm">
                  Open
                  <ArrowUpRight className="size-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/app/settings/privacy">
            <Card className="h-full shadow-sm ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-md lg:rounded-xl">
              <CardHeader className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Lock className="size-5 text-primary" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base">Privacy</CardTitle>
                  <CardDescription className="mt-1">Visibility controls and data handling preferences.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-flex items-center gap-1 font-medium text-primary text-sm">
                  Open
                  <ArrowUpRight className="size-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </>
  )
}
