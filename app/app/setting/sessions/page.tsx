'use client'

import { Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

const sessions = [
  {
    id: 's1',
    device: 'Chrome on Windows',
    detail: 'Tel Aviv, IL · Current session',
    icon: Monitor,
    current: true,
  },
  {
    id: 's2',
    device: 'Safari on iPhone',
    detail: 'Tel Aviv, IL · Last active 2 days ago',
    icon: Smartphone,
    current: false,
  },
  {
    id: 's3',
    device: 'Firefox on macOS',
    detail: 'London, UK · Last active Apr 28, 2026',
    icon: Monitor,
    current: false,
  },
]

export default function SessionsSettingsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Sessions"
        description="Devices where your TaskFlow account is signed in."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Active sessions"
          description="If something looks unfamiliar, revoke access and change your password."
        >
          <ul className="flex flex-col gap-3">
            {sessions.map((s) => {
              const Icon = s.icon
              return (
                <li
                  key={s.id}
                  className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{s.device}</p>
                        {s.current ? (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                            This device
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{s.detail}</p>
                    </div>
                  </div>
                  {!s.current ? (
                    <Button type="button" variant="outline" size="sm">
                      Revoke
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground sm:text-right">
                      Cannot revoke current session
                    </span>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex flex-col gap-3 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Signs out every device except this browser tab.
            </p>
            <Button type="button" variant="destructive">
              Log out all other devices
            </Button>
          </div>
        </SettingsSection>
      </div>
    </>
  )
}
