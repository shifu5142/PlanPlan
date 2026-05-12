'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Pencil,
  Share2,
  Copy,
  Download,
  Plus,
  StickyNote,
  UserPlus,
  Settings,
  FileText,
  Pin,
} from 'lucide-react'

export type BoardDetails = {
  title: string
  description: string
  color: string
}

const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''

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

  return {
    title: o.title,
    description: o.description,
    color: o.color,
  }
}

/* ================= HEADER ================= */
function Header({
  board,
  boardId,
}: {
  board: BoardDetails
  boardId: string
}) {
  const router = useRouter()

  return (
    <header className="mb-8 flex items-center justify-between">
      <button
        type="button"
        onClick={() => router.back()}
        className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back
      </button>

      <Link
        href={`/app/board/${boardId}/edit`}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg"
        style={{ backgroundColor: board.color }}
      >
        <Pencil className="h-4 w-4" />
        Edit Board
      </Link>
    </header>
  )
}

/* ================= HERO SECTION ================= */
function HeroSection({ board }: { board: BoardDetails }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
      {/* Color accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: board.color }}
      />
      
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ 
          background: `linear-gradient(135deg, ${board.color} 0%, transparent 50%)` 
        }}
      />
      
      <div className="relative p-8">
        <div className="flex items-start gap-4">
          <div 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white text-lg font-bold"
            style={{ backgroundColor: board.color }}
          >
            {board.title.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {board.title}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <span 
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ 
                  backgroundColor: `${board.color}15`,
                  color: board.color 
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: board.color }} />
                Active
              </span>
              <span className="text-sm text-muted-foreground">Private board</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================= DESCRIPTION ================= */
function DescriptionCard({ board }: { board: BoardDetails }) {
  return (
    <article className="rounded-xl border border-border/50 bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground">
          Description
        </h2>
      </div>
      <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
        {board.description}
      </p>
    </article>
  )
}

/* ================= ACTION BUTTONS ================= */
function ActionButtons({ board }: { board: BoardDetails }) {
  const actions = [
    { icon: Share2, label: 'Share board', primary: true },
    { icon: Copy, label: 'Duplicate', primary: false },
    { icon: Download, label: 'Export', primary: false },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {actions.map(({ icon: Icon, label, primary }) => (
        <button
          key={label}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            primary
              ? 'text-white hover:opacity-90 hover:shadow-lg'
              : 'border border-border bg-card text-foreground hover:bg-secondary'
          }`}
          style={primary ? { backgroundColor: board.color } : undefined}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}

/* ================= EXTRA UI (NEW) ================= */
function BoardExtras({ board }: { board: BoardDetails }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Notes */}
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Quick Notes
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 shrink-0" />
            Add your first note
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
            <Pin className="h-4 w-4 shrink-0" />
            Drag items here later
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Board Info
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span 
              className="font-medium"
              style={{ color: board.color }}
            >
              Active
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Visibility</span>
            <span className="text-foreground">Private</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span className="text-foreground">Today</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sm:col-span-2 rounded-xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Quick Actions
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: board.color }}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary">
            <StickyNote className="h-4 w-4" />
            Add Note
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary">
            <UserPlus className="h-4 w-4" />
            Invite User
          </button>
          <Link href={`/app/settings`}>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ================= LOADING STATE ================= */
function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading board...</p>
      </div>
    </div>
  )
}

/* ================= ERROR STATE ================= */
function ErrorState() {
  const router = useRouter()
  
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <span className="text-xl">!</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Board not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The board you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      </div>
    </div>
  )
}

/* ================= MAIN PAGE ================= */
function BoardPage() {
  const router = useRouter()
  const params = useParams<{ boardld: string }>()
  const boardId = params.boardld

  const [board, setBoard] = useState<BoardDetails | null>(null)
  const [loadState, setLoadState] = useState<
    'loading' | 'ready' | 'error'
  >('loading')

  useEffect(() => {
    async function loadBoard() {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          router.replace('/auth/login')
          return
        }

        const response = await fetch(
          `${baseUrl}/app/board/${boardId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) throw new Error('fetch failed')

        const data: unknown = await response.json()
        const normalizedBoard = normalizeBoard(data)

        if (!normalizedBoard)
          throw new Error('invalid board response')

        setBoard(normalizedBoard)
        setLoadState('ready')
      } catch (error) {
        console.error(error)
        setLoadState('error')
      }
    }

    loadBoard()
  }, [boardId, router])

  if (loadState === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState />
      </div>
    )
  }

  if (loadState === 'error' || !board) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Header board={board} boardId={boardId} />
      
      <div className="space-y-6">
        <HeroSection board={board} />
        <DescriptionCard board={board} />
        <ActionButtons board={board} />
        <BoardExtras board={board} />
      </div>
    </div>
  )
}

export default BoardPage
