"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SwitchProps = Omit<
  React.ComponentProps<"button">,
  "role" | "type" | "onClick"
> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...props
}: SwitchProps) {
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultChecked ?? false
  )
  const isControlled = checked !== undefined
  const isOn = isControlled ? checked : uncontrolled

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      data-state={isOn ? "checked" : "unchecked"}
      disabled={disabled}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input px-0.5 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        className
      )}
      onClick={() => {
        const next = !isOn
        if (!isControlled) setUncontrolled(next)
        onCheckedChange?.(next)
      }}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm ring-1 ring-foreground/10 transition-transform duration-200 ease-out",
          isOn ? "translate-x-[1.125rem]" : "translate-x-0"
        )}
      />
    </button>
  )
}
