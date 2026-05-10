import { PageLoadingIndicator } from '@/components/page-loading-indicator'

function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <PageLoadingIndicator />
    </main>
  )
}

export default Loading
