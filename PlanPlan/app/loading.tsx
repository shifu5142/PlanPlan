import { PageLoadingIndicator } from '@/components/page-loading-indicator'

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <PageLoadingIndicator />
    </main>
  )
}
