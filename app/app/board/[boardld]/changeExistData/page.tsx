'use client'

import { useState } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useParams } from 'next/navigation'

function SettingsCard({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-6">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-4">{children}</div>
      </div>
      {footer && (
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3">
          {footer}
        </div>
      )}
    </div>
  )
}

function ChangeExistDataPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
  const boardId = useParams<{ boardld: string }>().boardld
  const token = localStorage.getItem('token')
  const [successMessage, setSuccessMessage] = useState('')
  const handleSave = async () => {
    const response = await fetch(`${baseUrl}/app/board/${boardId}/changeExistData`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: title.trim(), description: description.trim() }),
    })
    if (!response.ok) throw new Error('fetch failed')
    const data = await response.json()
    if (data.success === true) {
      setTitle('')
      setDescription('')
      setSuccessMessage('Board updated successfully!')
      window.setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    }
  }
  return (
    <div className="min-h-screen bg-background">
      {successMessage ? (
        <div
          role="status"
          className="fixed top-20 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-md border border-green-300 bg-green-100 px-4 py-3 text-center text-sm font-medium text-green-800 shadow-lg"
        >
          {successMessage}
        </div>
      ) : null}

      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <Button variant="ghost" asChild className="h-auto gap-2 px-2 text-muted-foreground hover:text-foreground">
            <Link href={`/app/board/${boardId}`}>
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Back to board
            </Link>
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Board Settings</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Board Settings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your board configuration and preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Board Name */}
          <SettingsCard
            title="Board Name"
            description="Used to identify your board across the workspace."
            footer={
              <>
                <p className="text-xs text-muted-foreground">
                  Please use 48 characters at maximum.
                </p>
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={!title.trim() && !description.trim()}
                >
                  Save
                </Button>
              </>
            }
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board name"
              className="max-w-md bg-input"
              maxLength={48}
            />
          </SettingsCard>

         
          {/* Description */}
          <SettingsCard
            title="Description"
            description="A brief summary of what this board is for."
            footer={
              <>
                <p className="text-xs text-muted-foreground">
                  Markdown is supported.
                </p>
                <Button
                  size="sm"
                  disabled={!title.trim() && !description.trim()}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </>
            }
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full max-w-xl resize-none rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </SettingsCard>

          {/* AI Summary */}
          <SettingsCard
            title="AI Summary"
            description="Enable AI-generated summaries for board activity."
          >
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Smart Summaries
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get weekly AI-powered insights on board progress
                  </p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="peer h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-foreground after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:bg-white peer-focus:ring-2 peer-focus:ring-ring" />
              </label>
            </div>
          </SettingsCard>

          {/* Danger Zone */}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="p-6">
              <h3 className="text-base font-medium text-foreground">
                Danger Zone
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Irreversible and destructive actions.
              </p>
              <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Delete this board
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Once deleted, this board cannot be recovered.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ChangeExistDataPage