'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Kanban, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      setIsLoading(false)
      return
    }
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
      if (!baseUrl) {
        setErrorMessage('Server URL missing: set NEXT_PUBLIC_BACKEND_URL in .env')
        return
      }
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await response.json()
      if (data.success) {
        setSuccessMessage('Successfully registered')
        setTimeout(() => {
          router.push('/auth/login')
        }, 1500)
      } else if (!data.success && data.message === 'The user already exists') {
        setErrorMessage('The user already exists, please select a different email/username')
      } else {
        alert(data.message)
        setErrorMessage('Failed to register')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to register')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Kanban className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">TaskFlow</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Get started with TaskFlow today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2"></div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
            {successMessage && (
              <div className="rounded-md border border-green-300 bg-green-100 px-3 py-2 text-sm font-medium text-green-800">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="rounded-md border border-red-300 bg-red-100 px-3 py-2 text-sm font-medium text-red-800">
                {errorMessage}
              </div>
            )}
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
