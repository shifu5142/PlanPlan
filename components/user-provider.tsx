'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import type { User } from '@/lib/types'
import { clearStoredUser, getStoredUser, setStoredUser } from '@/lib/user-session'

type UserContextValue = {
  user: User | null
  userData: Record<string, unknown> | null
  setUser: (u: User) => void
  setUserData: (data: Record<string, unknown> | null) => void
  clearUserData: () => void
  clearUser: () => void
}

const UserContext = createContext<UserContextValue | null>(null)

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [userData, setUserDataState] = useState<Record<string, unknown> | null>(null)

  // Read persisted session before paint so children (e.g. login → setUser) see consistent storage.
  useIsoLayoutEffect(() => {
    setUserState(getStoredUser())
  }, [])

  const setUser = useCallback((u: User) => {
    try {
      setStoredUser(u)
    } catch {
      // localStorage may throw (private mode / quota); still keep React state in sync.
    }
    setUserState(u)
  }, [])

  const setUserData = useCallback((data: Record<string, unknown> | null) => {
    setUserDataState(data)
  }, [])

  const clearUserData = useCallback(() => {
    setUserDataState(null)
  }, [])

  const clearUser = useCallback(() => {
    clearStoredUser()
    setUserState(null)
    setUserDataState(null)
  }, [])

  const value = useMemo(
    () => ({ user, userData, setUser, setUserData, clearUserData, clearUser }),
    [user, userData, setUser, setUserData, clearUserData, clearUser],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider')
  }
  return ctx
}
