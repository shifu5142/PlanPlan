'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUser } from '@/components/user-provider'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

export default function AccountSettingsPage() {
  const { user } = useUser()

  return (
    <>
      <SettingsPageHeader
        title="Account"
        description="Contact details, locale preferences, and account lifecycle."
      />

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <SettingsSection
          title="Contact"
          description="Used for sign-in, receipts, and security alerts."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={user?.email ?? ''}
                placeholder="you@company.com"
              />
              <p className="text-xs text-muted-foreground">
                Changing your email may require re-verification.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Regional preferences"
          description="Language and time zone affect dates across TaskFlow."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="en-gb">English (UK)</SelectItem>
                  <SelectItem value="he">עברית</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Time zone</Label>
              <Select defaultValue="utc">
                <SelectTrigger id="timezone" className="w-full">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="america-ny">
                    America / New York (UTC−5)
                  </SelectItem>
                  <SelectItem value="europe-london">
                    Europe / London (UTC+0)
                  </SelectItem>
                  <SelectItem value="asia-jerusalem">
                    Asia / Jerusalem (UTC+2)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Delete account"
          description="Permanently remove your personal account and profile data."
        >
          <p className="text-sm text-muted-foreground">
            Prefer a guided flow? Use the dedicated{' '}
            <Link
              href="/app/delete"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              delete account
            </Link>{' '}
            page.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="destructive">
              Delete account…
            </Button>
          </div>
        </SettingsSection>

        <div className="flex justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </>
  )
}
