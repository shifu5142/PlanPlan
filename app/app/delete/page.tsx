'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function DeletePage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password do not match.')
      return
    }
    setIsConfirmOpen(true)
  }

  const handleFinalDelete = (e: React.FormEvent) => {
    e.preventDefault()
    if (confirmText.trim().toLowerCase() !== 'confirm') {
      setErrorMessage('Type "confirm" to proceed.')
      return
    }

    // TODO: connect to delete account API endpoint.
    console.log({ username, password, confirmPassword, confirmation: confirmText })
    setIsConfirmOpen(false)
    setConfirmText('')
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Delete User</CardTitle>
          <CardDescription>
            This action is permanent. Enter your credentials to confirm deletion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDelete} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-username">Username</Label>
              <Input
                id="delete-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-password">Password</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-confirm-password">Confirm Password</Label>
              <Input
                id="delete-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>

            <Button type="submit" variant="destructive" className="w-full">
              Delete User
            </Button>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-[280px] p-4">
          <DialogHeader>
            <DialogTitle>Final confirmation</DialogTitle>
            <DialogDescription>
              To confirm account deletion, enter <strong>confirm</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFinalDelete} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-final-confirm">Confirmation</Label>
              <Input
                id="delete-final-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder='Type "confirm"'
                autoFocus
              />
            </div>
            <Button type="submit" variant="destructive" className="w-full">
              Confirm Delete
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeletePage