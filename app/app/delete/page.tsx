'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Kanban, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUser } from '@/components/user-provider'

const CONFIRM_PHRASE = 'confirm delete account'

export default function DeleteAccountPage() {
  const router = useRouter()
  const { clearUser } = useUser()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [stepOneLoading, setStepOneLoading] = useState(false)
  const [stepTwoLoading, setStepTwoLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const resetConfirmState = () => {
    setConfirmText('')
    setConfirmError('')
  }

  const handleFirstSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!username.trim() || !password) {
      setFormError('Username and password are required.')
      return
    }
    setStepOneLoading(true)
    try {
      // Optional: verify credentials with your API before showing confirmation.
      await new Promise((r) => setTimeout(r, 400))
      setConfirmOpen(true)
    } finally {
      setStepOneLoading(false)
    }
  }

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmError('')
    if (confirmText.trim().toLowerCase() !== CONFIRM_PHRASE) {
      setConfirmError(`You must type exactly: ${CONFIRM_PHRASE}`)
      return
    }
    setStepTwoLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
      if (baseUrl) {
        await fetch(`${baseUrl}/auth/account`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password }),
        }).catch(() => undefined)
      }
      localStorage.removeItem('token')
      clearUser()
      setConfirmOpen(false)
      router.push('/auth/login')
    } finally {
      setStepTwoLoading(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/app/dashboard" className="flex items-center gap-2">
              <Kanban className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">TaskFlow</span>
            </Link>
          </div>
          <CardTitle className="text-2xl text-destructive">Delete account</CardTitle>
          <CardDescription>
            This permanently removes your account. You will need your username and password to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFirstSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-username">Username</Label>
              <Input
                id="delete-username"
                type="text"
                autoComplete="username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-password">Password</Label>
              <Input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {formError && (
              <div className="rounded-md border border-red-300 bg-red-100 px-3 py-2 text-sm font-medium text-red-800">
                {formError}
              </div>
            )}
            <Button type="submit" variant="destructive" className="w-full" disabled={stepOneLoading}>
              {stepOneLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Continuing…
                </>
              ) : (
                'Continue to confirmation'
              )}
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/app/dashboard">Cancel</Link>
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open)
          if (!open) resetConfirmState()
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Final confirmation</DialogTitle>
            <DialogDescription>
              To confirm deletion, type the phrase below exactly as shown. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmSubmit} className="space-y-4">
            <div className="rounded-md bg-muted px-3 py-2 font-mono text-sm">{CONFIRM_PHRASE}</div>
            <div className="space-y-2">
              <Label htmlFor="confirm-delete-phrase">To confirm enter &quot;confirm delete account&quot;</Label>
              <Input
                id="confirm-delete-phrase"
                type="text"
                autoComplete="off"
                placeholder={CONFIRM_PHRASE}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
            {confirmError && (
              <div className="rounded-md border border-red-300 bg-red-100 px-3 py-2 text-sm font-medium text-red-800">
                {confirmError}
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false)
                  resetConfirmState()
                }}
              >
                Go back
              </Button>
              <Button type="submit" variant="destructive" disabled={stepTwoLoading}>
                {stepTwoLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  'Delete my account'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
