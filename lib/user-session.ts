import type { User } from './types'

const USER_KEY = 'planplan_user'

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<User>
    if (typeof parsed.name === 'string' && parsed.name.length > 0) {
      return {
        id: typeof parsed.id === 'string' && parsed.id ? parsed.id : 'user',
        name: parsed.name,
        email: typeof parsed.email === 'string' ? parsed.email : '',
        ...(typeof parsed.avatar === 'string' ? { avatar: parsed.avatar } : {}),
      }
    }
    return null
  } catch {
    return null
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_KEY)
}

function asNonEmptyString(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  return t.length > 0 ? t : undefined
}

function idFromUnknown(u: Record<string, unknown> | undefined, data: Record<string, unknown>): string {
  const raw = u?.id ?? u?._id ?? data.userId ?? data.id
  if (typeof raw === 'string' && raw.length > 0) return raw
  if (typeof raw === 'number' && Number.isFinite(raw)) return String(raw)
  return 'user'
}

function nameFromUserObject(u: Record<string, unknown> | undefined): string | undefined {
  if (!u) return undefined
  const first = asNonEmptyString(u.firstName)
  const last = asNonEmptyString(u.lastName)
  if (first && last) return `${first} ${last}`
  return (
    asNonEmptyString(u.name) ||
    asNonEmptyString(u.displayName) ||
    asNonEmptyString(u.fullName) ||
    asNonEmptyString(u.full_name) ||
    asNonEmptyString(u.username) ||
    asNonEmptyString(u.userName) ||
    asNonEmptyString(u.email)?.split('@')[0]
  )
}

export function userFromLoginResponse(data: Record<string, unknown>, formUsername: string): User {
  const u = data.user as Record<string, unknown> | undefined
  const id = idFromUnknown(u, data)

  const name =
    nameFromUserObject(u) ||
    asNonEmptyString(data.name) ||
    asNonEmptyString(data.username) ||
    asNonEmptyString(formUsername) ||
    'User'

  const email = asNonEmptyString(u?.email) || asNonEmptyString(data.email) || ''
  const avatar =
    asNonEmptyString(u?.avatar) ??
    asNonEmptyString(u?.photoURL) ??
    asNonEmptyString(data.avatar)

  return avatar ? { id, name, email, avatar } : { id, name, email }
}
