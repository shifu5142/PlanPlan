'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'
import { Switch } from '../_components/switch'

export default function NotificationsSettingsPage() {
  const [email, setEmail] = useState(true)
  const [push, setPush] = useState(false)
  const [weekly, setWeekly] = useState(true)
  const [marketing, setMarketing] = useState(false)

  return (
    <>
      <SettingsPageHeader
        title="Notifications"
        description="Choose what we notify you about and where those alerts go."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Channels"
          description="Turn channels on or off. Critical security notices may still be sent."
        >
          <ul className="divide-y divide-border rounded-xl border border-border/80 bg-card/50">
            <li className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="notif-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mentions, assignments, and due date reminders.
                </p>
              </div>
              <Switch
                id="notif-email"
                checked={email}
                onCheckedChange={setEmail}
              />
            </li>
            <li className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="notif-push"
                  className="text-sm font-medium text-foreground"
                >
                  Push notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Instant alerts on devices where TaskFlow is installed.
                </p>
              </div>
              <Switch id="notif-push" checked={push} onCheckedChange={setPush} />
            </li>
            <li className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="notif-weekly"
                  className="text-sm font-medium text-foreground"
                >
                  Weekly summary
                </Label>
                <p className="text-xs text-muted-foreground">
                  Digest of activity across your workspaces every Monday.
                </p>
              </div>
              <Switch
                id="notif-weekly"
                checked={weekly}
                onCheckedChange={setWeekly}
              />
            </li>
            <li className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="notif-marketing"
                  className="text-sm font-medium text-foreground"
                >
                  Product updates & tips
                </Label>
                <p className="text-xs text-muted-foreground">
                  Occasional emails about new features and best practices.
                </p>
              </div>
              <Switch
                id="notif-marketing"
                checked={marketing}
                onCheckedChange={setMarketing}
              />
            </li>
          </ul>
        </SettingsSection>
      </div>
    </>
  )
}
