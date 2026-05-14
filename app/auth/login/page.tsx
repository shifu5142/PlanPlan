'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Kanban, Loader2, Lock, Mail } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup } from 'firebase/auth'
import { auth, githubProvider, googleProvider } from '@/app/services/auth/firebaseConfig'
import { useUser } from '@/components/user-provider'
import { userFromLoginResponse } from '@/lib/user-session'

function LoginPage() {
  const router = useRouter()
  const { setUser, setUserData } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [tokenChecked, setTokenChecked] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''

  useEffect(() => {
    const token = localStorage.getItem('token')?.trim()
    async function checkToken() {
      try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (data.success) {

      setSuccessMessage('you have already logged in')
      setErrorMessage('')
      setTokenChecked(true)

      const redirectTimer = window.setTimeout(() => {
        router.replace('/app/dashboard')
      }, 1500)

      return () => window.clearTimeout(redirectTimer)
    }
  } catch (error) {
    console.error(error)
  } finally {
    setIsLoading(false)
  }
  }
    setTokenChecked(true)
    void checkToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    let submittedUser: { id: unknown; name: unknown; email: unknown } | null = null
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = (await response.json()) as Record<string, unknown> & { success?: boolean }

      if (data.success) {
        const body = data.data
        let accessToken = typeof data.token === 'string' ? data.token.trim() : ''

        if (!accessToken && typeof body === 'string') {
          accessToken = body.trim()
        }

        if (!accessToken && body && typeof body === 'object' && !Array.isArray(body)) {
          const nested = (body as { token?: unknown }).token
          if (typeof nested === 'string') accessToken = nested.trim()
        }

        if (!accessToken) {
          setSuccessMessage('')
          setErrorMessage('Login failed: no token returned')
          return
        }

        localStorage.setItem('token', accessToken)
        setSuccessMessage('Login successful')

        const payload =
          body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
        submittedUser = {
          id: payload?.id,
          name: payload?.name,
          email: payload?.email,
        }

        if (submittedUser.id != null && String(submittedUser.id).length > 0) {
          setUser({
            id: String(submittedUser.id),
            name: String((submittedUser.name ?? username) || 'User'),
            email: String(submittedUser.email ?? ''),
          })
        } else {
          setUser(userFromLoginResponse(data, username))
        }

        setUserData(submittedUser as Record<string, unknown>)
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
    let submittedUser: { id: unknown; name: unknown; email: unknown } | null = null
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const u = result.user
      const displayFallback = u.displayName || u.email?.split('@')[0] || 'User'

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleuser: {
            id: u.uid,
            username: u.displayName,
            email: u.email,
          },
        }),
      })
      const data = (await response.json()) as Record<string, unknown> & { success?: boolean }

      if (data.success) {
        const body = data.data
        let accessToken = typeof data.token === 'string' ? data.token.trim() : ''

        if (!accessToken && typeof body === 'string') {
          accessToken = body.trim()
        }

        if (!accessToken && body && typeof body === 'object' && !Array.isArray(body)) {
          const nested = (body as { token?: unknown }).token
          if (typeof nested === 'string') accessToken = nested.trim()
        }

        if (!accessToken) {
          setSuccessMessage('')
          setErrorMessage('Login failed: no token returned')
          return
        }

        localStorage.setItem('token', accessToken)

        const payload =
          body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
        const gu =
          payload?.googleuser && typeof payload.googleuser === 'object' && !Array.isArray(payload.googleuser)
            ? (payload.googleuser as Record<string, unknown>)
            : null

        submittedUser = {
          id: gu?.id ?? payload?.id,
          name: gu?.username ?? gu?.name ?? payload?.name,
          email: gu?.email ?? payload?.email,
        }

        if (submittedUser.id != null && String(submittedUser.id).length > 0) {
          setUser({
            id: String(submittedUser.id),
            name: String((submittedUser.name ?? displayFallback) || 'User'),
            email: String(submittedUser.email ?? u.email ?? ''),
            ...(u.photoURL ? { avatar: u.photoURL } : {}),
          })
        } else {
          setUser(userFromLoginResponse(data, displayFallback))
        }

        setUserData(submittedUser as Record<string, unknown>)
        setSuccessMessage('Login successful')
        setTimeout(() => {
          router.push('/app/dashboard')
        }, 1500)
      } else {
        setSuccessMessage('')
        setErrorMessage('login failed')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Login failed')
    }
  }

  const hanldeGithubLogin = async () => {
    let submittedUser: { id: unknown; name: unknown; email: unknown } | null = null
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const result = await signInWithPopup(auth, githubProvider)
      const u = result.user
      const displayFallback =
        u.displayName || u.email?.split('@')[0] || u.providerData[0]?.email?.split('@')[0] || 'User'

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubuser: { id: u.uid, name: u.displayName, email: u.email },
        }),
      })
      const data = (await response.json()) as Record<string, unknown> & { success?: boolean }

      if (data.success) {
        const body = data.data
        let accessToken = typeof data.token === 'string' ? data.token.trim() : ''

        if (!accessToken && typeof body === 'string') {
          accessToken = body.trim()
        }

        if (!accessToken && body && typeof body === 'object' && !Array.isArray(body)) {
          const nested = (body as { token?: unknown }).token
          if (typeof nested === 'string') accessToken = nested.trim()
        }

        if (!accessToken) {
          setSuccessMessage('')
          setErrorMessage('Login failed: no token returned')
          return
        }

        localStorage.setItem('token', accessToken)

        const payload =
          body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
        const gh =
          payload?.githubuser && typeof payload.githubuser === 'object' && !Array.isArray(payload.githubuser)
            ? (payload.githubuser as Record<string, unknown>)
            : null

        submittedUser = {
          id: gh?.id ?? payload?.id,
          name: gh?.username ?? gh?.name ?? payload?.name,
          email: gh?.email ?? payload?.email,
        }

        const emailFallback = u.email || u.providerData[0]?.email || ''

        if (submittedUser.id != null && String(submittedUser.id).length > 0) {
          setUser({
            id: String(submittedUser.id),
            name: String((submittedUser.name ?? displayFallback) || 'User'),
            email: String(submittedUser.email ?? emailFallback),
            ...(u.photoURL ? { avatar: u.photoURL } : {}),
          })
        } else {
          setUser(userFromLoginResponse(data, displayFallback))
        }

        setUserData(submittedUser as Record<string, unknown>)
        setSuccessMessage('Login successful')
        setTimeout(() => {
          router.push('/app/dashboard')
        }, 1500)
      } else {
        setSuccessMessage('')
        setErrorMessage('login failed')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Login failed')
    }
  }

  if (!tokenChecked) {
    return null
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklch,var(--primary),transparent_70%),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-20%] bottom-[-20%] h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl transition-opacity duration-500 motion-safe:animate-pulse"
      />
      <Card className="relative w-full max-w-md shadow-lg ring-1 ring-foreground/10 transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 ring-1 ring-primary/20 transition-transform duration-200 hover:scale-[1.02]">
              <Kanban className="size-8 text-primary" aria-hidden />
              <span className="font-bold text-2xl tracking-tight">TaskFlow</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2 font-medium">
                <Mail className="size-3.5 text-muted-foreground" aria-hidden />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="transition-shadow duration-200 focus-visible:shadow-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 font-medium">
                <Lock className="size-3.5 text-muted-foreground" aria-hidden />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-shadow duration-200 focus-visible:shadow-md"
              />
            </div>
            <Button
              type="submit"
              className="w-full shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
            {successMessage ? (
              <div className="rounded-md border border-green-300 bg-green-100 px-3 py-2 font-medium text-green-800 text-sm transition-colors duration-200">
                {successMessage}
              </div>
            ) : null}
            {errorMessage ? (
              <div className="rounded-md border border-red-300 bg-red-100 px-3 py-2 font-medium text-red-800 text-sm transition-colors duration-200">
                {errorMessage}
              </div>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="w-full shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:shadow-md active:scale-[0.99]"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="mr-2 size-4" />
              Sign in with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full shadow-sm transition-all duration-200 hover:border-foreground/20 hover:bg-muted hover:shadow-md active:scale-[0.99]"
              onClick={hanldeGithubLogin}
            >
              <FaGithub className="mr-2 size-4" />
              Sign in with GitHub
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link
              href="/auth/register"
              className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default LoginPage
