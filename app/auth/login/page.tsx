'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Kanban, Loader2 } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success) {
        router.push('/app/dashboard')
      } else {
        setErrorMessage('login failed')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('login failed')
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
            {errorMessage && (
              <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
             <Button variant="outline" className="w-full">
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Button variant="outline" className="w-full">
            <FaGithub className="mr-2 h-4 w-4" />
       
            Sign in with github
          </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{"Don't have an account? "}</span>
            <Link href="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
