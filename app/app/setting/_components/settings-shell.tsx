'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import {
  AlertTriangle,
  Bell,
  Code2,
  CreditCard,
  KeyRound,
  LayoutGrid,
  Lock,
  Menu,
  MonitorSmartphone,
  Palette,
  Plug,
  ScrollText,
  ShieldCheck,
  User,
  UserCircle,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

type NavGroup = {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'General',
    items: [
      { href: '/app/setting/profile', label: 'Profile', icon: User },
      { href: '/app/setting/account', label: 'Account', icon: UserCircle },
      { href: '/app/setting/appearance', label: 'Appearance', icon: Palette },
      {
        href: '/app/setting/notifications',
        label: 'Notifications',
        icon: Bell,
      },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { href: '/app/setting/team', label: 'Team Members', icon: Users },
      { href: '/app/setting/billing', label: 'Billing', icon: CreditCard },
      {
        href: '/app/setting/integrations',
        label: 'Integrations',
        icon: Plug,
      },
      { href: '/app/setting/api-keys', label: 'API Keys', icon: KeyRound },
    ],
  },
  {
    title: 'Security',
    items: [
      { href: '/app/setting/password', label: 'Password', icon: Lock },
      {
        href: '/app/setting/sessions',
        label: 'Sessions',
        icon: MonitorSmartphone,
      },
      {
        href: '/app/setting/two-factor',
        label: 'Two-Factor Authentication',
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: 'Advanced',
    items: [
      {
        href: '/app/setting/developer',
        label: 'Developer Settings',
        icon: Code2,
      },
      { href: '/app/setting/logs', label: 'Logs', icon: ScrollText },
      {
        href: '/app/setting/danger',
        label: 'Danger Zone',
        icon: AlertTriangle,
      },
    ],
  },
]

function SettingsSidebarNav({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col gap-6', className)} aria-label="Settings">
      <Link
        href="/app/dashboard"
        onClick={onNavigate}
        className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <LayoutGrid className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
        Back to app
      </Link>

      {NAV_GROUPS.map((group) => (
        <div key={group.title} className="space-y-2">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">
            {group.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border'
                        : 'text-sidebar-foreground/85 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-200',
                        isActive
                          ? 'text-sidebar-primary'
                          : 'text-muted-foreground group-hover:scale-105 group-hover:text-foreground'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function SettingsShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      <div className="sticky top-14 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            Settings
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Manage your workspace and account
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-2"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="settings-mobile-nav"
        >
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] animate-in fade-in-0 lg:hidden"
            aria-label="Close settings menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            id="settings-mobile-nav"
            className="fixed inset-y-0 left-0 z-50 flex w-[min(100%,18rem)] flex-col border-r border-sidebar-border bg-sidebar shadow-xl animate-in slide-in-from-left-4 duration-200 lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Settings
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <SettingsSidebarNav onNavigate={() => setMobileOpen(false)} />
            </ScrollArea>
          </aside>
        </>
      ) : null}

      <aside className="sticky top-14 z-20 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <ScrollArea className="h-full px-3 py-6">
          <SettingsSidebarNav />
        </ScrollArea>
      </aside>

      <main className="relative flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
