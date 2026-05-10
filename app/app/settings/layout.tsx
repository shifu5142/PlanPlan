'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SettingsSidebarNav } from './components/settings-sidebar-nav'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="mx-auto flex max-w-[1680px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-border border-r bg-card lg:block">
          <ScrollArea className="h-full">
            <SettingsSidebarNav />
          </ScrollArea>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile settings bar */}
          <div className="sticky top-14 z-20 flex items-center justify-between gap-3 border-border border-b bg-card px-4 py-3 lg:hidden">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Workspace</p>
              <p className="truncate font-semibold text-foreground">Settings</p>
            </div>
            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                  <Menu className="size-4" />
                  Sections
                </Button>
              </DialogTrigger>
              <DialogContent className="flex max-h-[min(560px,calc(100vh-6rem))] flex-col gap-0 p-0 sm:max-w-md">
                <DialogHeader className="border-border border-b px-4 py-3.5 text-left">
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 max-h-[min(480px,70vh)]">
                  <SettingsSidebarNav onNavigate={() => setMobileOpen(false)} />
                </ScrollArea>
                <div className="border-border border-t bg-muted/40 px-4 py-3 text-muted-foreground text-xs">
                  <Link href="/app/dashboard" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Back to app
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <section className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8 lg:px-8">{children}</section>
        </div>
      </div>
    </div>
  )
}
