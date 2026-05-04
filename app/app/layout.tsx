'use client'

import Link from 'next/link'
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
import { useUser } from '@/components/user-provider'

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, clearUser } = useUser()
  const initials = user ? initialsFromName(user.name) : '?'

  const navItems = [
    { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/ai', label: 'AI Assistant', icon: Bot },
  ]
  console.log(user)
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <Kanban className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">TaskFlow</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt="" />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              {user ? (
                <div className="flex items-start gap-3 p-3">
                  <Avatar className="h-11 w-11 shrink-0">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt="" />
                    ) : null}
                    <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
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
                    <p
                      className="truncate font-mono text-xs text-muted-foreground/90"
                      title={user.id}
                    >
                      ID: {user.id}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 text-sm text-muted-foreground">Loading account…</div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app/dashboard" className="flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/ai" className="flex items-center gap-2 cursor-pointer">
                  <Bot className="h-4 w-4" />
                  AI Assistant
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/app/delete"
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 cursor-pointer text-destructive"
                  onClick={() => {
                    localStorage.removeItem('token')
                    clearUser()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <nav className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="flex-col h-auto py-2 px-4 gap-1"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
