'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export type BoardDetails = {
  title: string
  description: string
  color: string
}

function normalizeBoard(data: unknown): BoardDetails | null {
  if (!data || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  if (
    typeof o.title !== 'string' ||
    typeof o.description !== 'string' ||
    typeof o.color !== 'string'
  ) {
    return null
  }
  return { title: o.title, description: o.description, color: o.color }
}

function Header({
  board,
  boardId,
}: {
  board: BoardDetails
  boardId: string
}) {
  const router = useRouter()

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:border-muted-foreground/25 hover:shadow-md active:scale-[0.98]"
      >
        <span aria-hidden className="text-lg leading-none">
          ←
        </span>
        Back
      </button>
      <Link
        href={`/app/board/${boardId}/edit`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 hover:shadow-lg active:scale-[0.98] sm:w-auto"
        style={{
          backgroundColor: board.color,
          boxShadow: `0 4px 14px ${board.color}55`,
        }}
      >
        Edit
      </Link>
    </header>
  )
}

function ColorBanner({ board }: { board: BoardDetails }) {
  return (
    <div
      aria-hidden
      style={{ backgroundColor: board.color }}
      className="h-3 w-full rounded-full shadow-sm ring-1 ring-black/5 transition hover:opacity-95 dark:ring-white/10"
    />
  )
}

function DescriptionCard({ board }: { board: BoardDetails }) {
  return (
    <article
      className="rounded-2xl border-2 bg-card p-6 shadow-md transition hover:shadow-lg sm:p-8"
      style={{
        borderColor: `${board.color}55`,
        boxShadow: `0 12px 40px -12px ${board.color}35`,
      }}
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Description
      </h2>
      <p className="whitespace-pre-wrap text-base leading-relaxed text-card-foreground">
        {board.description}
      </p>
    </article>
  )
}

function ActionButtons({ board }: { board: BoardDetails }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        disabled
        title="Coming soon"
        className="inline-flex cursor-not-allowed items-center rounded-xl border-2 bg-muted/40 px-5 py-2.5 text-sm font-medium text-muted-foreground opacity-70 transition"
        style={{ borderColor: `${board.color}40` }}
      >
        Share board
      </button>
    </div>
  )
}

function BoardPage() {
  const params = useParams<{ boardld: string }>()
  const boardId = params.boardld
  const [board, setBoard] = useState<BoardDetails | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
  useEffect(() => {
    let cancelled = false

    const loadBoard = async () => {
      setLoadState('loading')
      try {
        const res = await fetch(`${baseUrl}/api/board/${boardId}`)
        if (!res.ok) throw new Error('fetch failed')
        const data: unknown = await res.json()
        const normalized = normalizeBoard(data)
        if (cancelled) return
        if (!normalized) {
          setBoard(null)
          setLoadState('error')
          return
        }
        setBoard(normalized)
        setLoadState('ready')
      } catch {
        if (!cancelled) {
          setBoard(null)
          setLoadState('error')
        }
      }
    }

    void loadBoard()
    return () => {
      cancelled = true
    }
  }, [boardId])

  if (loadState === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between gap-4">
            <div className="h-11 w-28 rounded-xl bg-muted" />
            <div className="h-11 w-24 rounded-xl bg-muted" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 h-3 w-full rounded-full bg-muted" />
            <div className="mb-3 h-9 max-w-md rounded-lg bg-muted sm:w-3/4" />
            <div className="h-6 w-24 rounded-full bg-muted" />
          </div>
          <div className="h-40 rounded-2xl bg-muted" />
        </div>
      </div>
    )
  }

  if (loadState === 'error' || !board) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Board not found</p>
        <Link
          href="/app/dashboard"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Return to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8 pb-16 sm:px-6 sm:py-10">
      <Header board={board} boardId={boardId} />

      <section
        className="mb-8 overflow-hidden rounded-2xl border-2 bg-card shadow-lg transition hover:shadow-xl"
        style={{
          borderColor: `${board.color}66`,
          boxShadow: `0 16px 48px -16px ${board.color}40`,
        }}
      >
        <div className="p-6 sm:p-8">
          <ColorBanner board={board} />
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {board.title}
            </h1>
            <span
              className="inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm transition hover:brightness-95"
              style={{
                backgroundColor: `${board.color}22`,
                color: board.color,
                borderColor: `${board.color}55`,
              }}
            >
              Active
            </span>
          </div>
        </div>
      </section>

      <DescriptionCard board={board} />
      <ActionButtons board={board} />
    </div>
  )
}

export default BoardPage
