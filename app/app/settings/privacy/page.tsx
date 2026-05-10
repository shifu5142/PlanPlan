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

function PrivacyRow({
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

export default function SettingsPrivacyPage() {
  return (
    <>
      <SettingsPageHeader
        title="Privacy"
        description="Visibility, analytics, and data handling policies for this workspace shell."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Privacy' },
        ]}
      />

      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Discovery & sharing</CardTitle>
            <CardDescription>Control how boards surface inside and outside the org.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="divide-y divide-border">
              <PrivacyRow
                controlId="link-public"
                title="Allow workspace gallery links"
                description="Guests with the URL can peek at sanitized snapshots."
                defaultChecked={false}
              />
              <PrivacyRow
                controlId="search-discovery"
                title="Include archived boards in search"
                description="Helpful during audits • may surface sensitive summaries."
                defaultChecked
              />
              <PrivacyRow
                controlId="member-directory"
                title="Expose member roster to teammates"
                description="Names + roles inside settings pickers."
                defaultChecked
              />
            </div>
            <div className="pt-6">
              <SectionFooterActions />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Product analytics</CardTitle>
              <CardDescription>Govern optional telemetry scaffolding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PrivacyRow
                controlId="usage-anon"
                title="Share coarse usage metrics"
                description="Counters only — aggregated within region."
                defaultChecked={false}
              />
              <PrivacyRow
                controlId="crash-symbols"
                title="Symbolic crash breadcrumbs"
                description="Assists QA without collecting card bodies."
                defaultChecked
              />
              <div className="rounded-lg bg-muted px-4 py-3 space-y-1 text-muted-foreground text-xs">
                <p>
                  DPIA appendix placeholder — regulators love seeing conscientious UX even when backend is mocked.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Data residency</CardTitle>
              <CardDescription>Set expectations for infra conversations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="region-pref">Preferred region</Label>
                <Select defaultValue="eu">
                  <SelectTrigger id="region-pref" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="us">United States (multi-region)</SelectItem>
                    <SelectItem value="eu">EU-West (Belgium footprint)</SelectItem>
                    <SelectItem value="il">Tel Aviv sovereign cluster (mock)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <PrivacyRow
                controlId="model-processing"
                title="Allow model augmentation on EU boards"
                description="Keeps payloads within regional inference boundaries."
                defaultChecked
              />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-dashed">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Consent ledger</CardTitle>
            <CardDescription>Demonstrate chronological audit UI without fetching records.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card px-4 py-8 text-center text-muted-foreground text-sm">
              <p className="font-medium text-foreground">Nothing recorded yet</p>
              <p className="mx-auto mt-2 max-w-md">
                After launch, consents for AI training, marketing, and partner sharing will appear here with export
                affordances.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
