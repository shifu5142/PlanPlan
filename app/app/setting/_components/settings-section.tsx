import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SettingsSectionProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <Card
      className={cn(
        "shadow-sm ring-foreground/[0.06] transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader className="border-b border-border/80 pb-4">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription className="text-pretty">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6 pt-6">{children}</CardContent>
    </Card>
  )
}
