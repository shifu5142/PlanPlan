import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

export default function SettingsAccountPage() {
  return (
    <>
      <SettingsPageHeader
        title="Account"
        description="Localization, session identity, and sign-in preferences for this workspace."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Account' },
        ]}
      />

      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Localization</CardTitle>
            <CardDescription>Controls how dates, numbers, and relative times render.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="en-gb">English (UK)</SelectItem>
                  <SelectItem value="he">Hebrew</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Time zone</Label>
              <Select defaultValue="tel-aviv">
                <SelectTrigger id="timezone" className="w-full">
                  <SelectValue placeholder="Time zone" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="tel-aviv">Asia / Jerusalem (GMT+2)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="ny">America / New York</SelectItem>
                  <SelectItem value="london">Europe / London</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="week-start">Start week on</Label>
              <Select defaultValue="monday">
                <SelectTrigger id="week-start" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format">Date format</Label>
              <Select defaultValue="localized">
                <SelectTrigger id="date-format" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="localized">Locale default</SelectItem>
                  <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                  <SelectItem value="us">MM/DD/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <SectionFooterActions />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Account identifiers</CardTitle>
            <CardDescription>For support and invoicing lookups.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="acct-id">Account ID</Label>
              <Input id="acct-id" readOnly defaultValue="acct_92f41c2bde4a7" className="font-mono text-xs md:text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Workspace slug</Label>
              <Input id="workspace-slug" defaultValue="taskflow-product" className="font-mono text-xs md:text-sm" />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm">
                Copy account ID
              </Button>
              <Button type="button" variant="ghost" size="sm">
                Download profile JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Sign-in & recovery</CardTitle>
            <CardDescription>Passwordless links and backup codes will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">Primary method</p>
              <p className="text-muted-foreground">Email magic link + Google SSO (mock)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm">
                Add recovery email
              </Button>
              <Button type="button" variant="outline" size="sm">
                Manage connected accounts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
