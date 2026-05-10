'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SectionFooterActions } from '../components/section-footer-actions'
import { SettingsSwitch } from '../components/settings-switch'

function Row({
  title,
  description,
  controlId,
  defaultChecked,
}: {
  title: string
  description: string
  controlId: string
  defaultChecked?: boolean
}) {
  const labelId = `${controlId}-label`
  return (
    <div className="flex flex-col gap-3 border-b pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1 pr-4">
        <p id={labelId} className="font-medium">
          {title}
        </p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <SettingsSwitch defaultChecked={defaultChecked} id={controlId} aria-labelledby={labelId} />
    </div>
  )
}

export default function SettingsNotificationsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Notifications"
        description="Decide where TaskFlow nudges you — email, pushes, summaries, without wiring delivery yet."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Notifications' },
        ]}
      />

      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader className="border-b pb-6">
            <CardTitle className="text-lg">Channels</CardTitle>
            <CardDescription>Granular switches for illustrative flows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Row
              controlId="notify-email-comments"
              title="Email mentions & comments"
              description="Someone @mentions you on a card or replies in a watched thread."
              defaultChecked
            />
            <Row
              controlId="notify-email-digest"
              title="Weekly planner digest"
              description="Tuesday summary across boards where you&apos;re active."
              defaultChecked
            />
            <Row
              controlId="notify-push-assignments"
              title="Push assignments"
              description="Mobile banner when ownership changes on urgent cards."
              defaultChecked={false}
            />
            <Row
              controlId="notify-sms-critical"
              title="SMS for critical SLA breaches"
              description="Only if a timeline goes red-hot on starred boards."
              defaultChecked={false}
            />
            <SectionFooterActions />
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Task reminders</CardTitle>
              <CardDescription>Align alerts with calendar blocks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Row
                  controlId="digest-daily"
                  title="Daily runway check"
                  description="Due soon + blocked cards every weekday at 09:15."
                  defaultChecked
                />
                <Row
                  controlId="digest-weekend"
                  title="Weekend hush mode"
                  description="Defer non-critical pings until Monday 08:30."
                  defaultChecked
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-hours">Quiet hours window</Label>
                <Select defaultValue="eve">
                  <SelectTrigger id="quiet-hours" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="none">Always on</SelectItem>
                    <SelectItem value="eve">Weeknights · 20:00–07:30</SelectItem>
                    <SelectItem value="manual">Manual override (mock)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Board behavior</CardTitle>
              <CardDescription>Audience-specific noise controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Row
                controlId="weekly-summary-email"
                title="Weekly rollup email"
                description="Metrics on completion rates and drift between columns."
                defaultChecked
              />
              <Row
                controlId="ai-suggestions-email"
                title="Assistant suggestions digest"
                description="Bundles AI nudges for stale cards and overloaded lanes."
                defaultChecked={false}
              />
              <Row
                controlId="team-joins"
                title="Teammate joins & leaves"
                description="Slack-style visibility for membership changes."
                defaultChecked
              />
            </CardContent>
          </Card>
        </div>

        <Card className="border-dashed bg-muted/30 shadow-inner">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Empty channel</CardTitle>
            <CardDescription>You can gracefully handle missing integrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 rounded-lg border bg-card px-4 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div>
                <p className="font-medium">Slack alerts not configured</p>
                <p className="text-muted-foreground text-sm">
                  Pipe card updates once you authorize the Slack app in integrations.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border px-4 py-2 font-medium text-sm transition hover:bg-muted"
              >
                View integration
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
