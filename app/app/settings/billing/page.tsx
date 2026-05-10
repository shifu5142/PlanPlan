import { Download, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SectionFooterActions } from '../components/section-footer-actions'

const invoices = [
  { id: 'INV-2405-1184', date: 'Apr 4, 2026', amount: '$48.00', status: 'Paid' },
  { id: 'INV-2404-1102', date: 'Mar 4, 2026', amount: '$48.00', status: 'Paid' },
  { id: 'INV-2403-1051', date: 'Feb 5, 2026', amount: '$48.00', status: 'Paid' },
]

export default function SettingsBillingPage() {
  return (
    <>
      <SettingsPageHeader
        title="Billing"
        description="Plan entitlements, invoicing, and payment methods — illustrative only."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Billing' },
        ]}
      />

      <div className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="border-primary/30 shadow-md lg:col-span-3">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-xl">Pro · Team workspaces</CardTitle>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-medium text-primary text-xs uppercase tracking-wide">
                    Current
                  </span>
                </div>
                <CardDescription>
                  Includes AI assist credits, audit trail, and granular permissions.
                </CardDescription>
                <ul className="text-muted-foreground text-sm space-y-2 pt-2">
                  <li>Unlimited boards · 150 active members</li>
                  <li>5k AI runs / month · rollover 1k</li>
                  <li>Priority inbox for support</li>
                </ul>
              </div>
              <div className="rounded-xl border bg-muted/50 p-4 text-right shadow-inner">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Next charge</p>
                <p className="font-semibold text-2xl">$48.00</p>
                <p className="text-muted-foreground text-sm">Jun 4, 2026 • USD</p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm">
                Compare plans
              </Button>
              <Button type="button" size="sm">
                Manage subscription
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed bg-muted/30 shadow-inner lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Usage snapshot</CardTitle>
              <CardDescription>Lightweight sparkline placeholders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">AI runs</span>
                  <span className="font-mono">68% of pool</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[68%] rounded-full bg-primary shadow-sm" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-mono">42% used</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[42%] rounded-full bg-chart-2 shadow-sm" />
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                Overages bill at $0.12 / GB after 500 GB included.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Payment method</CardTitle>
            <CardDescription>Stripe-style card with brand chip and metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 rounded-xl border bg-gradient-to-br from-card to-muted/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-foreground px-2 py-1 font-bold text-background text-xs uppercase tracking-widest">
                    Visa
                  </span>
                  <span className="text-muted-foreground text-sm">Debit · Business</span>
                </div>
                <p className="font-mono text-foreground text-lg tracking-[0.35em]">
                  •••• •••• •••• 8891
                </p>
                <p className="text-muted-foreground text-sm">Exp 08 / 29 · Jordan Douglas</p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-medium text-emerald-700 text-xs dark:text-emerald-400">
                  Verified
                </span>
                <Button type="button" variant="outline" size="sm">
                  Replace card
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border px-4 py-3 text-sm">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Billing email</p>
                <p className="font-medium">billing+taskflow@example.com</p>
              </div>
              <div className="rounded-lg border px-4 py-3 text-sm">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Tax profile</p>
                <p className="font-medium">VAT ID · EU mock</p>
              </div>
              <div className="rounded-lg border px-4 py-3 text-sm">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Autopay</p>
                <p className="font-medium">Enabled</p>
              </div>
            </div>
            <SectionFooterActions />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-col gap-2 border-b sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Invoice history</CardTitle>
              <CardDescription>Download PDFs once export is implemented.</CardDescription>
            </div>
            <Button type="button" variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Receipt className="size-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 font-medium">Invoice</th>
                  <th className="px-6 py-3 font-medium">Issued</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((row) => (
                  <tr key={row.id} className="transition hover:bg-muted/50">
                    <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.date}</td>
                    <td className="px-6 py-4 font-medium">{row.amount}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-success/15 px-2.5 py-0.5 font-medium text-success text-xs uppercase">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button type="button" variant="ghost" size="sm" className="gap-1">
                        <Download className="size-3.5" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t bg-muted/40 px-6 py-4 text-center text-muted-foreground text-sm">
              Need a custom contract?{' '}
              <button type="button" className="font-medium text-primary underline-offset-4 hover:underline">
                Talk to sales (mock)
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
