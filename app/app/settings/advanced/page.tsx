import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Trash2 } from 'lucide-react'
import { SettingsPageHeader } from '../components/settings-page-header'

export default function SettingsAdvancedPage() {
  return (
    <>
      <SettingsPageHeader
        title="Advanced"
        description="Power toggles reserved for admins — exports, integrations flags, irreversible teardown."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Advanced' },
        ]}
      />

      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Exports</CardTitle>
            <CardDescription>Download historical artifacts for compliance dry runs.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="export-range">Coverage range</Label>
              <select
                id="export-range"
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm ring-offset-background outline-none ring-foreground/10 focus-visible:ring-2"
                defaultValue="90"
              >
                <option value="30">Last 30 days</option>
                <option value="90">Rolling quarter</option>
                <option value="all">All retained history</option>
              </select>
              <p className="text-muted-foreground text-xs">Native select avoids wiring Radix-only exports.</p>
            </div>
            <div className="flex flex-col justify-end gap-2">
              <Button type="button" className="gap-2 md:self-start">
                <Download className="size-4" />
                Queue board ZIP (mock)
              </Button>
              <Button type="button" variant="outline" className="gap-2 md:self-start">
                <Download className="size-4" />
                Request audit ledger CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Integration flags</CardTitle>
            <CardDescription>Flip beta toggles while backend remains unimplemented.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="webhook-signing">Webhook signing version</Label>
                <Input id="webhook-signing" readOnly defaultValue="v2025-04 — ed25519 (placeholder)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="importer">Legacy importer</Label>
                <Input id="importer" readOnly defaultValue="Trello JSON v2 · dry-run only" />
              </div>
            </div>
            <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-muted-foreground text-sm">
              Feature flags render here after you connect LaunchDarkly or similar.
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/40 bg-destructive/10 shadow-md">
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-destructive text-lg">
                  <Trash2 className="size-5" />
                  Danger zone
                </CardTitle>
                <CardDescription className="text-destructive/80">
                  Irreversible actions require typed confirmation in production.
                </CardDescription>
              </div>
              <span className="rounded-full bg-destructive/20 px-2.5 py-0.5 font-semibold text-destructive text-xs uppercase tracking-wide">
                Destructive
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border border-destructive/40 bg-card p-5 shadow-inner">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Delete workspace</p>
                  <p className="text-muted-foreground text-sm max-w-xl">
                    Removes boards, automations, and billing agreements after a grace window. This UI simulates the
                    confirmation guard rail.
                  </p>
                </div>
                <Button type="button" variant="destructive" className="shrink-0 gap-2">
                  <Trash2 className="size-4" />
                  Delete account
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="confirm-type" className="text-destructive">
                  Type DELETE to enable (mock)
                </Label>
                <Input id="confirm-type" placeholder="DELETE" className="font-mono" />
              </div>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/15 px-4 py-3 text-destructive text-sm">
              Secondary failsafe copy can highlight legal review requirements or retention policies.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
