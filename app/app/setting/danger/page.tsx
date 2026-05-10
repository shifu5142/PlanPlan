'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

export default function DangerZoneSettingsPage() {
  const router = useRouter()

  return (
    <>
      <SettingsPageHeader
        title="Danger zone"
        description="Irreversible actions that affect your workspace or personal account."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Workspace"
          description="Deleting a workspace removes boards, automations, and billing."
        >
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
            <p className="text-sm font-medium text-destructive">Delete workspace</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Permanently delete this workspace and all of its data. This cannot be
              undone.
            </p>
            <div className="mt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Delete workspace…
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                    <AlertDialogDescription>
                      All boards, tasks, and integrations in this workspace will be
                      permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive">
                      Delete workspace
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Personal account"
          description="Closing your account removes your profile across every workspace."
        >
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
            <p className="text-sm font-medium text-destructive">Delete account</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You will lose access to TaskFlow immediately. Some content may remain
              visible to workspace owners.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Delete account…
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is permanent. Consider exporting your data first.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => router.push('/app/delete')}
                    >
                      Continue to delete flow
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="button" variant="outline" asChild>
                <Link href="/app/delete">Open full delete page</Link>
              </Button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </>
  )
}
