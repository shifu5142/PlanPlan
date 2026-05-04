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
import { auth, googleProvider, githubProvider } from '@/app/services/auth/firebaseConfig'
import { signInWithPopup } from 'firebase/auth'
import { useUser } from '@/components/user-provider'
////////////////////////////////////////////////////////////////////////////////////////
export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (data.success) {
        setSuccessMessage('Login successful')
        localStorage.setItem("token", data.token);
        setUser(userFromLoginResponse(data as Record<string, unknown>, username))
        setTimeout(() => {
          router.push('/app/dashboard')
        }, 1500)
      } else {
        setSuccessMessage('')
        setErrorMessage('login failed')
      } 
    } catch (error) {
      console.error(error)
      setErrorMessage('login failed')
    } finally {
      setIsLoading(false)
    }
  }
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const u = result.user
      setUser({
        id: u.uid,
        name: u.displayName || u.email?.split('@')[0] || 'User',
        email: u.email || '',
      })
      setSuccessMessage('Login successful')
      setTimeout(() => {
        router.push('/app/dashboard')
      }, 1500);
    } catch (error) {
      console.error(error)
      setErrorMessage('Login failed')
    }
  }
  const hanldeGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider)
      const u = result.user
      setUser({
        id: u.uid,
        name: u.displayName || u.email?.split('@')[0] || u.providerData[0]?.email?.split('@')[0] || 'User',
        email: u.email || u.providerData[0]?.email || '',
      })
      setSuccessMessage('Login successful')
      setTimeout(() => {
        router.push('/app/dashboard')
      }, 1500);
    } catch (error) {
      console.error(error)
      setErrorMessage('Login failed')
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
             <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={hanldeGithubLogin}>
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
