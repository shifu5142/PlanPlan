import type { ReactNode } from 'react'
import { SettingsShell } from './_components/settings-shell'

export default function SettingLayout({ children }: { children: ReactNode }) {
  return <SettingsShell>{children}</SettingsShell>
}
