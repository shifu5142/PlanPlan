'use client'

import { useEffect, useState } from 'react'
import { PageLoadingIndicator } from '@/components/page-loading-indicator'

export function FullPageLoadGate({ children }: { children: React.ReactNode }) {
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    const hide = () => setShowOverlay(false)
    if (document.readyState === 'complete') {
      hide()
      return
    }
    window.addEventListener('load', hide)
    return () => window.removeEventListener('load', hide)
  }, [])

  return (
    <>
      {children}
      {showOverlay ? (
        <div
          className="fade-in fixed inset-0 z-[9999] flex animate-in fade-in duration-300 items-center justify-center bg-background/92 backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading page"
        >
          <PageLoadingIndicator />
        </div>
      ) : null}
    </>
  )
}
