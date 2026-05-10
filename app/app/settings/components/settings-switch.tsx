'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export function SettingsSwitch({
  defaultChecked = false,
  className,
  id,
  'aria-labelledby': ariaLabelledBy,
}: {
  defaultChecked?: boolean
  className?: string
  id?: string
  'aria-labelledby'?: string
}) {
  const [on, setOn] = React.useState(defaultChecked)

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={ariaLabelledBy}
      onClick={() => setOn((v) => !v)}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent bg-input transition-colors',
        'focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none',
        on && 'bg-primary',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none block size-5 translate-x-0.5 rounded-full bg-background shadow-sm ring-1 ring-foreground/10 transition-transform',
          on && 'translate-x-5'
        )}
        aria-hidden
      />
      <span className="sr-only">Toggle</span>
    </button>
  )
}
