import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

const entries = [
  {
    time: '14:32:08',
    level: 'info',
    message: 'User ada@company.com updated board “Sprint 24”',
  },
  {
    time: '14:28:41',
    level: 'warn',
    message: 'Webhook delivery failed (HTTP 502) — retry scheduled',
  },
  {
    time: '14:15:02',
    level: 'info',
    message: 'API key tf_live_••• used from IP 203.0.113.10',
  },
  {
    time: '13:58:19',
    level: 'info',
    message: 'Invoice INV-24089 marked paid (Stripe)',
  },
]

export default function LogsSettingsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Logs"
        description="Recent workspace activity for audits and troubleshooting."
      />

      <SettingsSection
        title="Activity stream"
        description="Showing the latest 100 events. Export is available on Business plans."
      >
        <ul className="divide-y divide-border rounded-xl border border-border/80 bg-card/40 font-mono text-xs">
          {entries.map((e, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="shrink-0 text-muted-foreground">{e.time}</span>
              <span
                className={
                  e.level === 'warn'
                    ? 'shrink-0 font-semibold text-warning'
                    : 'shrink-0 font-semibold text-info'
                }
              >
                [{e.level}]
              </span>
              <span className="min-w-0 text-foreground">{e.message}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Timestamps use your account time zone preference.
        </p>
      </SettingsSection>
    </>
  )
}
