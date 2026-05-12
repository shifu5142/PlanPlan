'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  Pencil,
  Pin,
  Plus,
  Settings,
  Share2,
  StickyNote,
  Trash2,
  UserPlus,
} from 'lucide-react'

export type BoardDetails = {
  title: string
  description: string
  color: string
  active: boolean
}

type SideQuest = {
  id: number
  title: string
  completed: boolean
}

export function normalizeBoard(data: unknown): BoardDetails | null {
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
    active: typeof o.active === 'boolean' ? o.active : true,
  }
}

export function Header({
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

export function HeroSection({ board }: { board: BoardDetails }) {
  const params = useParams<{ boardld: string }>()
  const boardId = params.boardld
  const [isActive, setIsActive] = useState(board.active)
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''

  useEffect(() => {
    setIsActive(board.active)
  }, [board.active])

  const handleActiveBoard = async () => {
    const nextActive = !isActive
    setIsActive(nextActive)
    const token = localStorage.getItem('token')
    const response = await fetch(`${baseUrl}/app/board/${boardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ active: nextActive }),
    })
    if (!response.ok) throw new Error('fetch failed')
    const data = (await response.json()) as { success?: boolean }
  console.log(data.success)
    if (data.success === true) {
      setIsActive(nextActive)
    }
  }

  const statusColor = isActive ? board.color : '#6b7280'
 

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="h-1.5 w-full" style={{ backgroundColor: board.color }} />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: `linear-gradient(135deg, ${board.color} 0%, transparent 50%)`,
        }}
      />

      <div className="relative p-8">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: board.color }}
          >
            {board.title.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {board.title}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleActiveBoard}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition hover:opacity-85"
                style={{
                  backgroundColor: isActive ? `${board.color}15` : '#f3f4f6',
                  color: statusColor,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                {isActive ? 'Active' : 'not active'}
              </button>
              <span className="text-sm text-muted-foreground">Private board</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DescriptionCard({ board }: { board: BoardDetails }) {
  return (
    <article className="rounded-xl border border-border/50 bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
      </div>
      <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
        {board.description}
      </p>
    </article>
  )
}

export function SideQuestChecklist({ board }: { board: BoardDetails }) {
  const [sideQuests, setSideQuests] = useState<SideQuest[]>([])
  const [newSideQuest, setNewSideQuest] = useState('')
  const [nextSideQuestId, setNextSideQuestId] = useState(1)

  const handleAddSideQuest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = newSideQuest.trim()
    if (!title) return

    setSideQuests((current) => [
      ...current,
      {
        id: nextSideQuestId,
        title,
        completed: false,
      },
    ])
    setNextSideQuestId((current) => current + 1)
    setNewSideQuest('')
  }

  const toggleSideQuest = (sideQuestId: number) => {
    setSideQuests((current) =>
      current.map((sideQuest) =>
        sideQuest.id === sideQuestId
          ? { ...sideQuest, completed: !sideQuest.completed }
          : sideQuest,
      ),
    )
  }

  return (
    <section className="rounded-xl border border-border/50 bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Check className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground">
          Side quests
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_18rem]">
        <div className="space-y-2">
          {sideQuests.length > 0 ? (
            sideQuests.map((sideQuest) => (
              <div
                key={sideQuest.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 text-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleSideQuest(sideQuest.id)}
                  aria-label={
                    sideQuest.completed
                      ? `Mark ${sideQuest.title} as not completed`
                      : `Mark ${sideQuest.title} as completed`
                  }
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all hover:scale-105"
                  style={{
                    borderColor: board.color,
                    backgroundColor: sideQuest.completed
                      ? board.color
                      : 'transparent',
                    color: sideQuest.completed ? '#ffffff' : board.color,
                  }}
                >
                  {sideQuest.completed ? <Check className="h-4 w-4" /> : null}
                </button>
                <span
                  className={`min-w-0 flex-1 ${
                    sideQuest.completed
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {sideQuest.title}
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
              No side quests yet.
            </div>
          )}
        </div>

        <form onSubmit={handleAddSideQuest} className="space-y-2">
          <label
            htmlFor="side-quest-input"
            className="text-sm font-medium text-foreground"
          >
            Add side quest
          </label>
          <input
            id="side-quest-input"
            type="text"
            value={newSideQuest}
            onChange={(event) => setNewSideQuest(event.target.value)}
            placeholder="New side quest"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
          />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: board.color }}
          >
            Add
          </button>
        </form>
      </div>
    </section>
  )
}

export function ActionButtons({ board }: { board: BoardDetails }) {
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
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
export function BoardExtras({ board }: { board: BoardDetails }) {
  const router = useRouter()
  const params = useParams<{ boardld: string }>()
  const boardId = params.boardld
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)

  const handleDeleteBoard = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${baseUrl}/app/board/${boardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('fetch failed')
    const data = (await response.json()) as { success?: boolean }

    if (data.success === true) {
      setShowDeleteSuccess(true)
      window.setTimeout(() => {
        router.push('/app/dashboard')
      }, 1500)
    }
  }
  return (
    <>
      {showDeleteSuccess ? (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-md border border-green-300 bg-green-100 px-4 py-2 font-medium text-green-800 text-sm shadow-lg">
          board delete succecfuly
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Quick Notes</h3>
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

      <div className="rounded-xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Board Info</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium" style={{ color: board.color }}>
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

      <div className="rounded-xl border border-border/50 bg-card p-5 sm:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
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

          <Link href="/app/settings">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </Link>

          <button type="button" onClick={handleDeleteBoard} className="inline-flex items-center gap-2 rounded-lg border border-red-600 bg-red-600 px-3.5 py-2 text-sm font-medium text-white transition-all hover:border-red-700 hover:bg-red-700 hover:shadow-md">
            <Trash2 className="h-4 w-4" />
            Delete Board
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading board...</p>
      </div>
    </div>
  )
}

export function ErrorState() {
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
