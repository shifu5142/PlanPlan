'use client'

import { Github, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    description:
      'Post board updates and AI summaries to a channel your team already uses.',
    icon: MessageSquare,
    connected: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description:
      'Link repositories to cards for automatic PR and issue references.',
    icon: Github,
    connected: false,
  },
  {
    id: 'email',
    name: 'Email ingest',
    description:
      'Turn support emails into tasks with routing rules and attachments.',
    icon: Mail,
    connected: false,
  },
]

export default function IntegrationsSettingsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Integrations"
        description="Connect TaskFlow with the tools your team already relies on."
      />

      <SettingsSection
        title="Available integrations"
        description="OAuth connections can be scoped per workspace."
      >
        <ul className="flex flex-col gap-3">
          {integrations.map((item) => {
            const Icon = item.icon
            return (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card/40 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{item.name}</p>
                      {item.connected ? (
                        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                          Connected
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Not connected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={item.connected ? 'outline' : 'default'}
                  className="shrink-0 sm:min-w-[8rem]"
                >
                  {item.connected ? 'Configure' : 'Connect'}
                </Button>
              </li>
            )
          })}
        </ul>
      </SettingsSection>
    </>
  )
}
