export function PageLoadingIndicator() {
  return (
    <div className="flex flex-col items-center gap-4 text-muted-foreground">
      <div
        className="size-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary shadow-sm transition-[box-shadow] duration-300"
        aria-hidden
      />
      <p className="text-sm font-medium tracking-wide">Loading page…</p>
    </div>
  )
}
