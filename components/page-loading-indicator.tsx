import { Kanban } from 'lucide-react'

export function PageLoadingIndicator() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Kanban className="h-6 w-6 text-primary" />
        </div>
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-xl bg-primary/20" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">Loading...</p>
    </div>
  )
}
