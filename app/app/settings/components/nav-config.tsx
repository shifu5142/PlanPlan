import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  CreditCard,
  LayoutGrid,
  Lock,
  Palette,
  Plug,
  Shield,
  Sliders,
  User,
  UserCircle,
  Users,
  Wrench,
} from 'lucide-react'

export type SettingsNavItem = {
  href: string
  label: string
  icon: LucideIcon
  /** Match `href` exactly (for the overview route). */
  exact?: boolean
}

export const SETTINGS_NAV: SettingsNavItem[] = [
  { href: '/app/settings', label: 'General', icon: LayoutGrid, exact: true },
  { href: '/app/settings/profile', label: 'Profile', icon: User },
  { href: '/app/settings/account', label: 'Account', icon: UserCircle },
  { href: '/app/settings/appearance', label: 'Appearance', icon: Palette },
  { href: '/app/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/app/settings/security', label: 'Security', icon: Shield },
  { href: '/app/settings/billing', label: 'Billing', icon: CreditCard },
  { href: '/app/settings/team', label: 'Team', icon: Users },
  { href: '/app/settings/integrations', label: 'Integrations', icon: Plug },
  { href: '/app/settings/preferences', label: 'Preferences', icon: Sliders },
  { href: '/app/settings/privacy', label: 'Privacy', icon: Lock },
  { href: '/app/settings/advanced', label: 'Advanced', icon: Wrench },
]
