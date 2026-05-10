'use client'

import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@/components/user-provider'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function ProfileSettingsPage() {
  const { user } = useUser()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [bioLen, setBioLen] = useState(0)

  const displayName = user?.name ?? 'Your name'
  const initials = initialsFromName(displayName)

  return (
    <>
      <SettingsPageHeader
        title="Profile"
        description="This information appears on your profile, mentions, and shared boards."
      />

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <SettingsSection
          title="Public profile"
          description="Choose how you appear to teammates and collaborators."
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <Avatar className="h-24 w-24 ring-2 ring-border shadow-md">
                {preview ? (
                  <AvatarImage src={preview} alt="" />
                ) : user?.avatar ? (
                  <AvatarImage src={user.avatar} alt="" />
                ) : null}
                <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setPreview(URL.createObjectURL(file))
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
              >
                Upload image
              </Button>
              <p className="max-w-[12rem] text-center text-xs text-muted-foreground sm:text-left">
                PNG, JPG or WebP. Max 2&nbsp;MB.
              </p>
            </div>

            <div className="grid flex-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input
                  id="full-name"
                  name="fullName"
                  defaultValue={displayName}
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex rounded-lg shadow-xs ring-1 ring-input focus-within:ring-2 focus-within:ring-ring">
                  <span className="flex items-center rounded-l-lg border border-r-0 border-input bg-muted/80 px-2.5 text-xs text-muted-foreground">
                    taskflow.app/
                  </span>
                  <Input
                    id="username"
                    name="username"
                    className="rounded-l-none border-0 shadow-none ring-0 focus-visible:ring-0"
                    placeholder="ada"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://"
                  autoComplete="url"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Write a short bio visible on your profile."
                  rows={4}
                  className="min-h-[100px] resize-y"
                  maxLength={280}
                  onChange={(e) => setBioLen(e.target.value.length)}
                />
                <p className="text-xs text-muted-foreground">
                  {Math.max(0, 280 - bioLen)} characters remaining
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-border/80 pt-6">
            <Button type="submit">Save changes</Button>
          </div>
        </SettingsSection>
      </form>
    </>
  )
}
