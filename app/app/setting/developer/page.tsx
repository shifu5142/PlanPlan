'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'
import { Switch } from '../_components/switch'

export default function DeveloperSettingsPage() {
  const [verboseLogs, setVerboseLogs] = useState(false)

  return (
    <>
      <SettingsPageHeader
        title="Developer settings"
        description="Advanced options for building automations and debugging API behavior."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Webhooks"
          description="Receive structured events when tasks, comments, and boards change."
        >
          <div className="max-w-lg space-y-2">
            <Label htmlFor="webhook-url">Default webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://api.example.com/hooks/taskflow"
            />
            <p className="text-xs text-muted-foreground">
              We will retry failed deliveries with exponential backoff.
            </p>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Debug"
          description="Extra logging for support. May include task titles and email addresses."
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Verbose API logs</p>
              <p className="text-xs text-muted-foreground">
                Retained for 7 days when enabled.
              </p>
            </div>
            <Switch checked={verboseLogs} onCheckedChange={setVerboseLogs} />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Custom headers (optional)"
          description="Sent with outbound webhook requests from this workspace."
        >
          <Textarea
            placeholder={'Authorization: Bearer …\nX-Custom-Header: value'}
            rows={4}
            className="font-mono text-xs"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Reset
            </Button>
            <Button type="button">Save headers</Button>
          </div>
        </SettingsSection>
      </div>
    </>
  )
}
