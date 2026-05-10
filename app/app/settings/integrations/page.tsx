'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Clipboard, Puzzle, Zap } from 'lucide-react'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SectionFooterActions } from '../components/section-footer-actions'

const apps = [
  { name: 'Slack', vendor: '#platform', status: 'Connected', accent: 'from-indigo-500/15 to-purple-500/15' },
  { name: 'GitHub', vendor: 'Code sync', status: 'Connected', accent: 'from-slate-500/15 to-slate-900/10' },
  { name: 'Linear', vendor: 'Issue bridge', status: 'Paused', accent: 'from-indigo-500/10 to-cyan-500/15' },
  { name: 'Jira Cloud', vendor: 'Waiting setup', status: 'Available', accent: 'from-blue-600/15 to-teal-500/10' },
]

const webhookRows = [
  { url: 'https://hooks.plan.example/v1/card.events', topics: 'card.created · card.updated', status: 'Healthy' },
  { url: 'https://staging.internal/hooks/tf', topics: 'board.archived', status: 'Failing • mock' },
]

export default function SettingsIntegrationsPage() {
  const [tab, setTab] = React.useState<'apps' | 'api' | 'webhooks'>('apps')

  return (
    <>
      <SettingsPageHeader
        title="Integrations"
        description="Orchestration panel for SaaS connectors, programmable tokens, and outbound webhooks."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Integrations' },
        ]}
      />

      <div className="mb-8 flex gap-2 rounded-xl bg-muted/60 p-1 ring-1 ring-foreground/5">
        {(
          [
            { id: 'apps' as const, label: 'Connected apps', icon: Puzzle },
            { id: 'api' as const, label: 'API & tokens', icon: Zap },
            { id: 'webhooks' as const, label: 'Webhooks', icon: Clipboard },
          ] satisfies { id: 'apps' | 'api' | 'webhooks'; label: string; icon: typeof Puzzle }[]
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium text-sm transition',
              tab === id ? 'bg-card text-foreground shadow-sm ring-1 ring-foreground/10' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {tab === 'apps' ? (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {apps.map((app) => (
              <Card key={app.name} className="overflow-hidden shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/40">
                <div className={cn('h-24 bg-gradient-to-br', app.accent)} />
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription>{app.vendor}</CardDescription>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1',
                        app.status === 'Connected'
                          ? 'bg-success/15 text-success ring-success/30'
                          : app.status === 'Paused'
                            ? 'bg-amber-500/15 text-amber-900 ring-amber-600/40 dark:text-amber-300'
                            : 'bg-muted text-muted-foreground ring-border'
                      )}
                    >
                      {app.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 pb-6">
                  <Button type="button" variant="outline" size="sm">
                    Configure scopes
                  </Button>
                  <Button type="button" variant="ghost" size="sm">
                    View docs
                  </Button>
                  {app.status !== 'Waiting setup' ? (
                    <Button type="button" variant="destructive" size="sm">
                      Disconnect (mock)
                    </Button>
                  ) : (
                    <Button type="button" size="sm">
                      Connect staging
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed bg-muted/30">
            <CardContent className="flex flex-col gap-4 py-10 text-center text-muted-foreground text-sm md:flex-row md:items-center md:justify-between md:text-left">
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-base">Explore catalog</p>
                <p className="max-w-xl">
                  Showcase empty-but-actionable prompts for marketing reviews without wiring OAuth yet.
                </p>
              </div>
              <Button type="button" variant="secondary">
                Browse directory
              </Button>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {tab === 'api' ? (
        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Personal API token</CardTitle>
                  <CardDescription>Scoped to sandbox boards • rotate weekly in production tales.</CardDescription>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs">
                  Sandbox label
                </span>
              </div>
              <div className="rounded-lg bg-muted px-4 py-3 font-mono text-muted-foreground text-xs tracking-tight md:text-sm">
                tf_live_••••••••••••••••••••••••••••••••••••••••••••••••••••••••71f8
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="gap-1">
                  <Clipboard className="size-3.5" />
                  Copy snippet
                </Button>
                <Button type="button" variant="secondary" size="sm">
                  Rotate secret
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scopes">Scopes</Label>
                  <Input id="scopes" readOnly defaultValue="boards.read, boards.write, webhooks.manage" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Burst rate limit</Label>
                  <Input id="rate" readOnly defaultValue="420 req/min · bursts to 840" />
                </div>
              </div>
              <SectionFooterActions />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Service accounts</CardTitle>
              <CardDescription>For automation runners with limited humans-in-the-loop.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-col gap-2 rounded-lg border px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">ci-release-bot</p>
                  <p className="text-muted-foreground text-xs">Expires Aug 2040 • read-only backlog lane</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Open policies
                </Button>
              </div>
              <Button type="button" variant="ghost" size="sm" className="text-primary">
                + Create service credential
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {tab === 'webhooks' ? (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Outbound webhooks</CardTitle>
              <CardDescription>Pipe board intelligence into your SOC or data lake.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm">
              Launch replay console
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto space-y-4 p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide [&_th]:py-4 [&_th]:font-medium">
                <tr>
                  <th className="px-6">Endpoint</th>
                  <th className="px-6 hidden lg:table-cell">Topics</th>
                  <th className="px-6">Health</th>
                  <th className="px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {webhookRows.map((row, index) => (
                  <tr key={row.url} className={index === 1 ? 'bg-destructive/15' : 'hover:bg-muted/40'}>
                    <td className="break-all px-6 py-4 font-mono text-xs">{row.url}</td>
                    <td className="hidden px-6 py-4 text-muted-foreground lg:table-cell">{row.topics}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 font-medium text-xs uppercase ring-1',
                          row.status.startsWith('Healthy')
                            ? 'bg-success/15 text-success ring-success/30'
                            : 'bg-destructive/15 text-destructive ring-destructive/30'
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button type="button" variant="ghost" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t bg-muted/40 px-6 py-4 text-center text-muted-foreground text-sm">
              <Button type="button" variant="secondary" className="gap-2">
                <Zap className="size-4" />
                Create webhook (mock)
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  )
}
