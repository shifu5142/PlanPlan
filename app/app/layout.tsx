'use client'

import Link from 'next/link'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Kanban, LayoutDashboard, Bot, Settings, LogOut, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { UserMenuControlProvider } from '@/components/user-menu-control'

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, clearUser } = useUser()
  const initials = user ? initialsFromName(user.name) : '?'
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const openUserMenu = React.useCallback(() => setUserMenuOpen(true), [])

  const navItems = [
    { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/ai', label: 'AI Assistant', icon: Bot },
  ]

  return (
    <UserMenuControlProvider openUserMenu={openUserMenu}>
      <div className="flex min-h-screen flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 border-border border-b bg-background/90 shadow-sm backdrop-blur-md transition-shadow duration-300 supports-[backdrop-filter]:bg-background/75 hover:shadow-md">
          <div className="flex h-14 items-center justify-between px-4 md:px-6">
            {/* Logo */}
            <Link
              href="/app/dashboard"
              className="group flex items-center gap-2 rounded-lg outline-none ring-offset-2 ring-offset-background transition-transform duration-200 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15 transition-all duration-200 group-hover:bg-primary/15 group-hover:shadow-md group-hover:ring-primary/25">
                <Kanban className="size-[1.35rem] transition-transform duration-200 group-hover:scale-105" />
              </span>
              <span className="font-bold text-lg tracking-tight transition-colors duration-200 group-hover:text-primary">
                TaskFlow
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href} className="group">
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'gap-2 transition-all duration-200 hover:-translate-y-px',
                        isActive && 'shadow-sm ring-1 ring-foreground/10'
                      )}
                    >
                      <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-9 rounded-full p-0 ring-offset-2 ring-offset-background transition-all duration-200 hover:ring-2 hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar className="size-9 border-2 border-transparent shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md">
                    {user?.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                    <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 duration-200 animate-in fade-in-0 zoom-in-95"
                align="end"
                forceMount
              >
                {user ? (
                  <div className="flex items-start gap-3 p-3">
                    <Avatar className="size-11 shrink-0 ring-2 ring-primary/10">
                      {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                      <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Signed in
                      </p>
                      <p className="truncate font-semibold leading-tight" title={user.name}>
                        {user.name}
                      </p>
                      <p
                        className="truncate text-sm text-muted-foreground"
                        title={user.email || undefined}
                      >
                        {user.email || 'No email on file'}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground/90" title={user.id}>
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-sm text-muted-foreground">Loading account…</div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/app/dashboard"
                    className="flex cursor-pointer items-center gap-2 transition-colors duration-150"
                  >
                    <LayoutDashboard className="size-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/app/ai"
                    className="flex cursor-pointer items-center gap-2 transition-colors duration-150"
                  >
                    <Bot className="size-4 text-muted-foreground" />
                    AI Assistant
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings" className="flex cursor-pointer items-center gap-2 transition-colors duration-150">
                    <Settings className="size-4 text-muted-foreground" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/app/delete"
                    className="flex cursor-pointer items-center gap-2 text-destructive transition-colors duration-150"
                  >
                    <Trash2 className="size-4" />
                    Delete account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/login"
                    className="flex cursor-pointer items-center gap-2 text-destructive transition-colors duration-150"
                    onClick={() => {
                      localStorage.removeItem('token')
                      clearUser()
                    }}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="border-border border-t md:hidden">
            <nav className="flex items-center justify-around py-2" aria-label="Mobile main">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href} className="min-w-0 flex-1 px-1">
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-auto w-full flex-col gap-1 py-2 transition-all duration-200 active:scale-[0.98]"
                    >
                      <Icon className={`size-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                      <span className="truncate text-xs">{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </UserMenuControlProvider>
  )
}

export default AppLayout
