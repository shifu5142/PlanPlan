'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ShieldCheck } from 'lucide-react'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SectionFooterActions } from '../components/section-footer-actions'
import { SettingsSwitch } from '../components/settings-switch'

const sessions = [
  { device: 'Chrome · Windows', location: 'Tel Aviv • IL', ip: '84.229.12.11', recent: true, session: 'Current' },
  { device: 'Safari · macOS Sonoma', location: 'Remote • VPN', ip: '10.82.94.210', recent: false, session: '2h ago' },
  { device: 'TaskFlow mobile', location: 'iOS • Tel Aviv', ip: '80.246.143.94', recent: false, session: 'Yesterday' },
]

function AlertRow({
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
    <div className="flex flex-col gap-3 border-b pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
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

export default function SettingsSecurityPage() {
  return (
    <>
      <SettingsPageHeader
        title="Security"
        description="Safeguard workspace access — password rotation, MFA, and session auditing."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Security' },
        ]}
      />

      <div className="space-y-8">
        <div className="grid gap-8 xl:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Password</CardTitle>
              <CardDescription>Last rotated · 118 days ago (placeholder).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-pass">Current password</Label>
                <Input id="current-pass" type="password" autoComplete="current-password" placeholder="••••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-pass">New password</Label>
                <Input id="new-pass" type="password" autoComplete="new-password" placeholder="Passphrase encouraged" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-pass">Confirm new password</Label>
                <Input id="confirm-pass" type="password" autoComplete="new-password" placeholder="Repeat once more" />
              </div>
              <SectionFooterActions />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="size-5 text-primary" aria-hidden />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Two-factor authentication</CardTitle>
                    <CardDescription>Protect sensitive operations with OTP + backup ladder.</CardDescription>
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-success/15 px-2.5 py-1 font-medium text-success text-xs uppercase tracking-wide">
                Enabled • mock
              </span>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-muted/50 px-4 py-3 space-y-2 text-sm">
                <p className="font-semibold text-foreground">Authenticator app</p>
                <p className="text-muted-foreground">Shows “TaskFlow (Product)” • code refreshes every 30s.</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button type="button" variant="outline" size="sm">
                    Regenerate QR
                  </Button>
                  <Button type="button" variant="ghost" size="sm">
                    Use security key instead
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border border-dashed px-4 py-3 space-y-2">
                <p className="font-medium">Backup codes</p>
                <p className="text-muted-foreground text-sm">
                  Eight single-use rescue codes • last generated 214 days ago.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="button" size="sm">
                    Rotate backup codes
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    Download CSV
                  </Button>
                </div>
              </div>
              <AlertRow
                controlId="mfa-required"
                title="Require MFA for admins"
                description="Admins cannot disable MFA while this policy stands."
                defaultChecked
              />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-col gap-3 border-b lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg">Active sessions</CardTitle>
              <CardDescription>Terminate unfamiliar devices without leaving this page.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm">
              Sign out all other sessions
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/70 text-muted-foreground text-xs uppercase tracking-wide [&_th]:py-3 [&_th]:font-medium">
                <tr>
                  <th className="px-6 py-4">Session</th>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Relative</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y [&_td]:py-4">
                {sessions.map((row) => (
                  <tr key={row.ip} className={row.recent ? 'bg-success/10' : 'hover:bg-muted/40'}>
                    <td className="space-y-1 px-6">
                      <p className="font-medium">{row.device}</p>
                      <p className="text-muted-foreground text-xs">{row.location}</p>
                    </td>
                    <td className="px-6 font-mono text-xs text-muted-foreground">{row.ip}</td>
                    <td className="px-6 text-muted-foreground">{row.session}</td>
                    <td className="px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-muted-foreground"
                            aria-label={`More actions for ${row.device}`}
                          >
                            <MoreHorizontal aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {!row.recent ? (
                            <DropdownMenuItem>Revoke session</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem disabled>This device</DropdownMenuItem>
                          )}
                          <DropdownMenuItem>Copy diagnostics</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Login alerts</CardTitle>
            <CardDescription>Adaptive notifications tied to anomalies (UI only).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 divide-y [&>*]:pb-4 last:[&>*]:pb-0">
            <div className="-mt-px">
              <AlertRow
                controlId="notify-new-city"
                title="New location sign-ins"
                description="Email heads-up when geography shifts beyond home base."
                defaultChecked
              />
            </div>
            <div>
              <AlertRow
                controlId="notify-new-device"
                title="New device fingerprints"
                description="Slack-compatible payload when an unknown UA strings appears."
                defaultChecked
              />
            </div>
            <div>
              <AlertRow
                controlId="notify-sso-switch"
                title="SSO policy changes"
                description="Administrative enforcement events on IdP rotations."
                defaultChecked={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
