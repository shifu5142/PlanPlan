'use client'

import * as React from 'react'
import { Moon, Monitor, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SectionFooterActions } from '../components/section-footer-actions'

const themes = [
  { id: 'system', label: 'System', icon: Monitor, blurb: 'Follow OS light/dark schedule.' },
  { id: 'light', label: 'Light', icon: Sun, blurb: 'Bright surfaces for daylight work.' },
  { id: 'dark', label: 'Dark', icon: Moon, blurb: 'Low glare for late board reviews.' },
] as const

const accentSwatches = [
  { id: 'indigo', label: 'Indigo', color: 'oklch(0.65 0.2 250)' },
  { id: 'violet', label: 'Violet', color: 'oklch(0.58 0.22 290)' },
  { id: 'teal', label: 'Teal', color: 'oklch(0.64 0.14 195)' },
  { id: 'amber', label: 'Amber', color: 'oklch(0.78 0.16 78)' },
  { id: 'rose', label: 'Rose', color: 'oklch(0.62 0.2 15)' },
]

export default function SettingsAppearancePage() {
  const [theme, setTheme] = React.useState<(typeof themes)[number]['id']>('system')
  const [accent, setAccent] = React.useState(accentSwatches[0].id)

  return (
    <>
      <SettingsPageHeader
        title="Appearance"
        description="Tune visual density and brand accents. Theme switching is visual only in this preview."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Appearance' },
        ]}
      />

      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Theme</CardTitle>
            <CardDescription>Choose how TaskFlow responds to light and dark environments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {themes.map((t) => {
                const Icon = t.icon
                const active = theme === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      'flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                      active && 'border-primary ring-2 ring-primary/30'
                    )}
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-4 text-primary" aria-hidden />
                    </div>
                    <div>
                      <p className="font-semibold">{t.label}</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">{t.blurb}</p>
                    </div>
                  </button>
                )
              })}
            </div>
            <SectionFooterActions />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Accent color</CardTitle>
            <CardDescription>Highlights buttons, mentions, and focus rings across dashboards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {accentSwatches.map((swatch) => {
                const active = accent === swatch.id
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setAccent(swatch.id)}
                    aria-pressed={active}
                    aria-label={`${swatch.label} accent`}
                    className={cn(
                      'relative size-11 rounded-full border-4 border-background shadow-md ring-1 ring-foreground/10 transition hover:scale-105',
                      active && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                    )}
                    style={{ backgroundColor: swatch.color }}
                  />
                )
              })}
            </div>
            <div className="rounded-lg bg-muted/50 px-3 py-2 text-muted-foreground text-xs">
              Selected accent: <span className="font-semibold text-foreground">{accentSwatches.find((s) => s.id === accent)?.label}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Density</CardTitle>
              <CardDescription>Controls vertical rhythm across tables and lanes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label htmlFor="density">Workspace density</Label>
              <Select defaultValue="comfortable">
                <SelectTrigger id="density" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="cozy">Cozy · more whitespace</SelectItem>
                  <SelectItem value="comfortable">Comfortable · balanced</SelectItem>
                  <SelectItem value="compact">Compact · power-user</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="board-scroll">Board scroll behavior</Label>
              <Select defaultValue="smooth">
                <SelectTrigger id="board-scroll" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="smooth">Smooth glide</SelectItem>
                  <SelectItem value="snap">Column snap</SelectItem>
                  <SelectItem value="instant">Instant</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Typography</CardTitle>
              <CardDescription>Adjust legibility across long planning sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label htmlFor="font-base">Interface size</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="font-base" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="small">Small · 14px root</SelectItem>
                  <SelectItem value="medium">Medium · 15px root</SelectItem>
                  <SelectItem value="large">Large · 16px root</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="tabular">Numerals</Label>
              <Select defaultValue="proportional">
                <SelectTrigger id="tabular" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="proportional">Proportional</SelectItem>
                  <SelectItem value="tabular">Tabular lining (tables)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
