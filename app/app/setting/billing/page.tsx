'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

const invoices = [
  { id: 'INV-24089', date: 'Apr 2, 2026', amount: '$29.00', status: 'Paid' },
  { id: 'INV-23901', date: 'Mar 2, 2026', amount: '$29.00', status: 'Paid' },
  { id: 'INV-23788', date: 'Feb 2, 2026', amount: '$29.00', status: 'Paid' },
]

export default function BillingSettingsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Billing"
        description="Manage your subscription, payment method, and invoice history."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Current plan"
          description="You are on the Pro plan with priority support."
        >
          <div className="flex flex-col gap-4 rounded-xl border border-primary/25 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">Pro</p>
              <p className="text-sm text-muted-foreground">
                $29 / month · Renews May 2, 2026
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                12 seats included · 3 seats in use
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline">
                Change plan
              </Button>
              <Button type="button">Upgrade to Business</Button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Payment method"
          description="Your card is charged automatically at the start of each cycle."
        >
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-14 items-center justify-center rounded-lg bg-muted font-mono text-xs font-semibold ring-1 ring-border">
                VISA
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Visa ending in 4242
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires 08 / 2028 · Billing address on file
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" className="gap-2 sm:shrink-0">
              Update payment method
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Billing history"
          description="Download invoices for your records."
        >
          <div className="overflow-x-auto rounded-xl border border-border/80">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Invoice</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="bg-card/30 transition-colors hover:bg-muted/25"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{inv.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                    <td className="px-4 py-3 font-medium">{inv.amount}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button type="button" variant="ghost" size="sm">
                        PDF
                      </Button>
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
