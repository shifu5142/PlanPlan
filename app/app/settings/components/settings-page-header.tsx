import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type BreadcrumbItem = { label: string; href?: string }

export function SettingsPageHeader({
  title,
  description,
  breadcrumbs,
}: {
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
}) {
  return (
    <header className="mb-8 space-y-1">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1
          return (
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {i > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />
              ) : null}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-foreground font-medium' : undefined}>{crumb.label}</span>
              )}
            </span>
          )
        })}
      </nav>
      <div className="flex flex-col gap-1 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description ? <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p> : null}
        </div>
      </div>
    </header>
  )
}
