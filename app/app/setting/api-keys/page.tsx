'use client'

import { useState } from 'react'
import { Copy, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

const initialKeys = [
  {
    id: 'key_8NzQ2',
    label: 'Production automation',
    prefix: 'tf_live_',
    created: 'Mar 18, 2026',
    lastUsed: '2 hours ago',
  },
  {
    id: 'key_3LmP9',
    label: 'Local development',
    prefix: 'tf_test_',
    created: 'Jan 4, 2026',
    lastUsed: 'Never',
  },
]

export default function ApiKeysSettingsPage() {
  const [keys, setKeys] = useState(initialKeys)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function copySample(id: string) {
    const sample = `${keys.find((k) => k.id === id)?.prefix ?? 'tf_'}••••••••••••`
    void navigator.clipboard.writeText(sample)
    setCopiedId(id)
    window.setTimeout(() => setCopiedId(null), 2000)
  }

  function generateKey() {
    const id = `key_${Math.random().toString(36).slice(2, 8)}`
    setKeys((prev) => [
      {
        id,
        label: 'New API key',
        prefix: 'tf_live_',
        created: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        lastUsed: 'Never',
      },
      ...prev,
    ])
  }

  return (
    <>
      <SettingsPageHeader
        title="API keys"
        description="Authenticate REST requests and automation scripts. Keys inherit your permissions."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Keys"
          description="Never commit keys to source control. Rotate keys periodically."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md space-y-2">
              <Label htmlFor="key-label">Default label (optional)</Label>
              <Input
                id="key-label"
                placeholder="e.g. CI pipeline"
                autoComplete="off"
              />
            </div>
            <Button type="button" className="gap-2 sm:shrink-0" onClick={generateKey}>
              <Plus className="h-4 w-4" />
              Generate API key
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/80">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Label</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Created
                  </th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">
                    Last used
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keys.map((k) => (
                  <tr
                    key={k.id}
                    className="bg-card/30 transition-colors hover:bg-muted/25"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{k.label}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {k.prefix}••••••••••••
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground md:hidden">
                        {k.created}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {k.created}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {k.lastUsed}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => copySample(k.id)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copiedId === k.id ? 'Copied' : 'Copy'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            setKeys((prev) => prev.filter((x) => x.id !== k.id))
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Revoke</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SettingsSection>
      </div>
    </>
  )
}
