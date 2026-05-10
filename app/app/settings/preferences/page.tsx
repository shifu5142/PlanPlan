'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SectionFooterActions } from '../components/section-footer-actions'
import { SettingsSwitch } from '../components/settings-switch'

function PreferenceRow({
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
    <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 pr-4 space-y-1">
        <p id={labelId} className="font-medium">
          {title}
        </p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <SettingsSwitch defaultChecked={defaultChecked} id={controlId} aria-labelledby={labelId} />
    </div>
  )
}

export default function SettingsPreferencesPage() {
  return (
    <>
      <SettingsPageHeader
        title="Preferences"
        description="Operational defaults tuned for power users juggling multiple boards."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Preferences' },
        ]}
      />

      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Board & card defaults</CardTitle>
            <CardDescription>New boards inherit these guardrails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="divide-y divide-border">
              <PreferenceRow
                controlId="default-wip"
                title="Show WIP limits on new columns"
                description="Starter templates include soft caps for review lanes."
                defaultChecked
              />
              <PreferenceRow
                controlId="subtasks-expand"
                title="Auto-expand checklist depth"
                description="Visual affordance when importing from other tools."
                defaultChecked={false}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lane-template">Lane template preset</Label>
                <Select defaultValue="minimal">
                  <SelectTrigger id="lane-template" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="minimal">Backlog · Doing · Done</SelectItem>
                    <SelectItem value="design">Research · Design · Build · Launch</SelectItem>
                    <SelectItem value="support">Queue · Investigation · Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="autosave">Autosave granularity</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger id="autosave" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="batched">Batched every 8s</SelectItem>
                    <SelectItem value="manual">Manual commit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SectionFooterActions />
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Shortcuts & power tools</CardTitle>
              <CardDescription>Preview toggles for keyboard-first operators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PreferenceRow
                controlId="hotkeys"
                title="Enable global hotkeys"
                description="Cmd/Ctrl + K palette aware of current board context."
                defaultChecked
              />
              <PreferenceRow
                controlId="multi-select"
                title="Batch card operations"
                description="Shift-drag to marquee select across swimlanes."
                defaultChecked
              />
              <PreferenceRow
                controlId="ai-inline"
                title="Inline drafting suggestions"
                description="Ghost suggestions while editing descriptions."
                defaultChecked={false}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Scheduling</CardTitle>
              <CardDescription>Sync task deadlines with calendars (mock).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PreferenceRow
                controlId="gcal-push"
                title="Push milestones to Calendar"
                description="Requires integration authorization later."
                defaultChecked={false}
              />
              <div className="space-y-2">
                <Label htmlFor="timezone-buffer">Reminder buffer before due</Label>
                <Select defaultValue="45">
                  <SelectTrigger id="timezone-buffer" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-5 text-center text-muted-foreground text-sm">
                <p className="font-medium text-foreground">No calendar connected</p>
                <p className="mt-1 text-xs">Empty state for stakeholders reviewing flows.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
