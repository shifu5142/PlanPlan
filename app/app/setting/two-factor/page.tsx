'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'
import { Switch } from '../_components/switch'

export default function TwoFactorSettingsPage() {
  const [enabled, setEnabled] = useState(false)

  return (
    <>
      <SettingsPageHeader
        title="Two-factor authentication"
        description="Require a second factor when signing in from new devices."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Authenticator app"
          description="Use a time-based one-time password from apps like 1Password or Google Authenticator."
        >
          <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">Authenticator (TOTP)</p>
                <p className="text-sm text-muted-foreground">
                  Recommended for most teams. Works offline after setup.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <span className="text-xs font-medium text-muted-foreground">
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>

          {enabled ? (
            <div className="grid gap-4 rounded-xl border border-dashed border-border bg-card/50 p-5">
              <p className="text-sm text-muted-foreground">
                Scan the QR code in your authenticator app, then enter the 6-digit
                code to verify.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-muted font-mono text-xs text-muted-foreground ring-1 ring-border">
                  QR preview
                </div>
                <div className="grid min-w-[200px] flex-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="totp-code">Verification code</Label>
                    <Input
                      id="totp-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  <Button type="button">Verify and enable</Button>
                </div>
              </div>
            </div>
          ) : (
            <Button type="button" variant="outline">
              Set up authenticator
            </Button>
          )}
        </SettingsSection>

        <SettingsSection
          title="Recovery codes"
          description="Store these codes somewhere safe. Each code works once."
        >
          <div className="rounded-xl border border-border bg-muted/30 p-4 font-mono text-sm leading-relaxed text-foreground">
            <ul className="grid gap-1 sm:grid-cols-2">
              <li>XXXX-XXXX-XXXX</li>
              <li>YYYY-YYYY-YYYY</li>
              <li>ZZZZ-ZZZZ-ZZZZ</li>
              <li>WWWW-WWWW-WWWW</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm">
              Download codes
            </Button>
            <Button type="button" variant="outline" size="sm">
              Regenerate codes
            </Button>
          </div>
        </SettingsSection>
      </div>
    </>
  )
}
