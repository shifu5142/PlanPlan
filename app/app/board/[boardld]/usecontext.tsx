'use client'

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

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'

/** Labels shown in Side Tasks Checklist — filled from HeroSection’s `tasks` after each fetch. */
let sideMissionDisplayRows: string[] = []
const sideMissionListeners = new Set<() => void>()

function notifySideMissionListeners() {
  for (const l of sideMissionListeners) l()
}

function subscribeSideMissionTasks(cb: () => void) {
  sideMissionListeners.add(cb)
  return () => sideMissionListeners.delete(cb)
}

function getSideMissionTasksSnapshot() {
  return sideMissionDisplayRows
}

/** One task row from API: text lives on `side_mission` (plus common fallbacks). */
export function sideMissionLabelFromTaskItem(item: unknown): string {
  if (typeof item === 'string') return item
  if (typeof item === 'number' || typeof item === 'boolean') return String(item)
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const o = item as Record<string, unknown>
    const sm = o.side_mission ?? o.sideMission
    if (typeof sm === 'string') return sm
    if (typeof sm === 'number' || typeof sm === 'boolean') return String(sm)
    for (const k of ['title', 'task', 'name', 'text', 'label', 'content'] as const) {
      const v = o[k]
      if (typeof v === 'string') return v
    }
  }
  return ''
}

export function labelsFromTasksPayload(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(sideMissionLabelFromTaskItem)
    .map((s) => s.trim())
    .filter(Boolean)
}

export type BoardDetails = {
  title: string
  description: string
  color: string
  active: boolean
  tasks: string[]
}

export function normalizeBoard(data: unknown): BoardDetails | null {
  if (!data || typeof data !== 'object') return null;

  const o = data as Record<string, any>;

  if (!o.board || typeof o.board !== 'object') return null;

  const board = o.board;

  if (
    typeof board.title !== 'string' ||
    typeof board.description !== 'string' ||
    typeof board.color !== 'string'
  ) {
    return null;
  }

  return {
    title: board.title,
    description: board.description,
    color: board.color,
    active: typeof board.active === 'boolean' ? board.active : true,

    // optional but recommended
    tasks: Array.isArray(board.tasks) ? board.tasks : [],
  };
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
        href={`/app/board/${boardId}/changeExistData`}
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
  const [tasks, setTasks] = useState<unknown[]>([])
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''

  useEffect(() => {
    async function fetchBoard() {
      try {
        const token = localStorage.getItem('token')
        console.log("boardId in frontend:", boardId)
        console.log("URL:", `${baseUrl}/app/board/${boardId}`)
        const response = await fetch(`${baseUrl}/app/board/${boardId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) throw new Error('fetch failed')
        const data = await response.json()
        console.log(data)
        setIsActive(data.board.active)
        setTasks(data.tasks)
        console.log(data.tasks)

      } catch (error) {
        console.error(error)
      }
    }

    void fetchBoard()
  }, [boardId, baseUrl])

  useEffect(() => {
    sideMissionDisplayRows = labelsFromTasksPayload(tasks)
    notifySideMissionListeners()
  }, [tasks])

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
  const fromApi = useSyncExternalStore(
    subscribeSideMissionTasks,
    getSideMissionTasksSnapshot,
    getSideMissionTasksSnapshot,
  )
  const [sideTaskExtras, setSideTaskExtras] = useState<string[]>([])
  const [checkedSideTasks, setCheckedSideTasks] = useState<boolean[]>([])
  const [newSideTask, setNewSideTask] = useState('')

  useEffect(() => {
    setSideTaskExtras([])
  }, [boardId])

  const displayTasks = useMemo(() => [...fromApi, ...sideTaskExtras], [fromApi, sideTaskExtras])

  useEffect(() => {
    setCheckedSideTasks(displayTasks.map(() => false))
  }, [displayTasks])
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
  const handleAddSideTask = async () => {
    const trimmed = newSideTask.trim()
    if (!trimmed) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${baseUrl}/app/board/${boardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: trimmed }),
      })
      if (!response.ok) throw new Error('fetch failed')
      const data = (await response.json()) as { success?: boolean }
      if (data.success === true) {
        setSideTaskExtras((prev) => [...prev, trimmed])
        setNewSideTask('')
      }
    } catch (error) {
      console.error(error)
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
          <StickyNote className="h-4 w-4" style={{ color: board.color }} />
          <h3 className="text-sm font-medium" style={{ color: board.color }}>Side Tasks Checklist</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
          <div
            className={`side_mission min-h-0 space-y-2 ${
              displayTasks.length > 5
                ? 'max-h-72 overflow-y-auto overscroll-contain pr-1'
                : ''
            }`}
          >
            {displayTasks.map((task, index) => {
              const checked = checkedSideTasks[index] ?? false
              return (
                <button
                  key={`${index}-${task}`}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-secondary/20 p-3 text-left text-sm transition hover:bg-secondary/40"
                  onClick={() => {
                    setCheckedSideTasks((current) =>
                      current.map((c, i) => (i === index ? !c : c)),
                    )
                  }}
                >
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border bg-background transition"
                    style={{
                      backgroundColor: checked ? board.color : undefined,
                      borderColor: checked ? board.color : undefined,
                    }}
                    aria-hidden
                  >
                    {checked ? <Check className="h-3 w-3 text-white" /> : null}
                  </span>
                  <span className="side_mission min-w-0 flex-1 text-foreground">{task}</span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-secondary/20 p-3">
            <input
              type="text"
              placeholder="Add side task"
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2"
              style={{ borderColor: `${board.color}66` }}
              value={newSideTask}
              onChange={(e) => setNewSideTask(e.target.value)}
            />
            <button onClick={handleAddSideTask}
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: board.color }}
            >
              <Plus className="h-4 w-4" />
              Add Side Task
            </button>
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
