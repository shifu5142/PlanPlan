'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'
import { Switch } from '../_components/switch'

const themes = [
  { id: 'light' as const, label: 'Light', icon: Sun },
  { id: 'dark' as const, label: 'Dark', icon: Moon },
  { id: 'system' as const, label: 'System', icon: Monitor },
]

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [compact, setCompact] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const active = mounted ? theme ?? 'system' : 'system'

  return (
    <>
      <SettingsPageHeader
        title="Appearance"
        description="Customize how TaskFlow looks and feels on this device."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Theme"
          description="Choose a color theme or sync with your operating system."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {themes.map(({ id, label, icon: Icon }) => {
              const isSelected = active === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-all duration-200',
                    isSelected
                      ? 'border-primary bg-primary/10 text-foreground shadow-sm ring-2 ring-primary/25'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-muted/40'
                  )}
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  {label}
                </button>
              )
            })}
          </div>
          {!mounted ? (
            <p className="text-xs text-muted-foreground">
              Applying theme preferences…
            </p>
          ) : null}
        </SettingsSection>

        <SettingsSection
          title="Density & type"
          description="Tune readability and information density."
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Label htmlFor="font-scale">Font size</Label>
              <Select defaultValue="100">
                <SelectTrigger id="font-scale" className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">Small (90%)</SelectItem>
                  <SelectItem value="100">Default (100%)</SelectItem>
                  <SelectItem value="110">Large (110%)</SelectItem>
                  <SelectItem value="125">Extra large (125%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/80 bg-muted/30 px-4 py-3 sm:max-w-sm sm:flex-1">
              <div>
                <p className="text-sm font-medium">Compact mode</p>
                <p className="text-xs text-muted-foreground">
                  Tighter spacing in lists and boards.
                </p>
              </div>
              <Switch checked={compact} onCheckedChange={setCompact} />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Preview
            </p>
            <p
              className={cn(
                'mt-2 text-sm leading-relaxed text-foreground',
                compact && 'leading-snug'
              )}
            >
              The quick brown fox jumps over the lazy dog. Adjust font size and
              density to match how you work best.
            </p>
          </div>
        </SettingsSection>
      </div>
    </>
  )
}
