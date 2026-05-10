'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

export default function PasswordSettingsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Password"
        description="Use a unique password that you do not reuse on other services."
      />

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <SettingsSection
          title="Change password"
          description="After saving, you will stay signed in on this device."
        >
          <div className="grid max-w-md gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">
                At least 12 characters including a number and symbol.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-6">
            <p className="text-sm text-muted-foreground">
              Add another layer of protection in{' '}
              <Link
                href="/app/setting/two-factor"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Two-factor authentication
              </Link>
              .
            </p>
            <Button type="submit">Update password</Button>
          </div>
        </SettingsSection>
      </form>
    </>
  )
}
