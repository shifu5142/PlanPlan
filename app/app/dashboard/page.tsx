'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotFound from '@/app/not-found'
import { PageLoadingIndicator } from '@/components/page-loading-indicator'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Bot, CircleUser, Kanban, LayoutDashboard, Plus, Sparkles, Users } from 'lucide-react'
import type { Board, User } from '@/lib/types'
import { BOARD_COLORS } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useUserMenuControl } from '@/components/user-menu-control'


async function readJsonSafely<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Unexpected response (${response.status})`)
  }
  return (await response.json()) as T
}

/** MySQL row from `SELECT * FROM boards` → app `Board` shape. */
function boardFromDbRow(row: Record<string, unknown>, viewer: User | null): Board {
  const id = row.id != null ? String(row.id) : ''
  const title = typeof row.title === 'string' ? row.title : ''
  const rawDesc = row.description
  const description =
    typeof rawDesc === 'string' && rawDesc.trim() ? rawDesc.trim() : undefined
  const color =
    (typeof row.color === 'string' && row.color) ||
    (typeof row.backgroundColor === 'string' && row.backgroundColor) ||
    BOARD_COLORS[0]
  const createdAt =
    typeof row.created_at === 'string'
      ? row.created_at
      : typeof row.createdAt === 'string'
        ? row.createdAt
        : new Date().toISOString()
  const updatedAt =
    typeof row.updated_at === 'string'
      ? row.updated_at
      : typeof row.updatedAt === 'string'
        ? row.updatedAt
        : createdAt

  return {
    id,
    title,
    ...(description ? { description } : {}),
    backgroundColor: color,
    members: viewer ? [viewer] : [],
    columns: [],
    createdAt,
    updatedAt,
  }
}

/** Creates a board via backend and maps response to app `Board` shape. */
async function createBoard(
  title: string,
  description: string,
  backgroundColor: string,
  viewer: User | null,
  token: string,
  baseUrl: string
): Promise<Board> {
  const trimmed = title.trim()
  const desc = description.trim()
  const response = await fetch(`${baseUrl}/app/dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: trimmed,
      description: desc ? desc : null,
      color: backgroundColor,
    }),
  })
  const data = await readJsonSafely<{
    success?: boolean
    message?: string
    data?: {
      id: number | string
      title: string
      description?: string | null
      color: string
      user_id?: number | string
      created_at?: string
      updated_at?: string
    }
  }>(response)
  if (!response.ok || data.success === false || !data.data) {
    throw new Error(data.message || `Failed to create board (${response.status})`)
  }

  return boardFromDbRow(data.data as unknown as Record<string, unknown>, viewer)
}

function DashboardSideNav() {
  const pathname = usePathname()
  const menu = useUserMenuControl()

  const linkClass = (href: string, exact?: boolean) => {
    const active = exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`)
    return cn(
      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
      active
        ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25'
        : 'text-muted-foreground hover:translate-x-0.5 hover:bg-muted/90 hover:text-foreground'
    )
  }

  return (
    <aside className="flex shrink-0 flex-row flex-wrap items-center gap-2 border-border border-b bg-sidebar/95 bg-gradient-to-b from-sidebar to-muted/30 px-3 py-2.5 shadow-sm ring-1 ring-foreground/[0.06] md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-52 md:flex-col md:items-stretch md:gap-4 md:border-r md:px-4 md:py-5">
      <p className="hidden w-full text-muted-foreground text-xs font-semibold uppercase tracking-wider md:flex md:items-center md:gap-2">
        <Sparkles className="size-3.5 text-primary/80" aria-hidden />
        Navigate
      </p>
      <nav className="flex min-w-0 flex-1 flex-row gap-1 md:flex-col md:flex-none">
        <Link href="/app/dashboard" className={cn(linkClass('/app/dashboard', true), 'group')}>
          <LayoutDashboard className="size-4 shrink-0 opacity-90 transition-transform duration-200 group-hover:scale-110" aria-hidden />
          Dashboard
        </Link>
        <Link href="/app/ai" className={cn(linkClass('/app/ai'), 'group')}>
          <Bot className="size-4 shrink-0 opacity-90 transition-transform duration-200 group-hover:scale-110" aria-hidden />
          AI Assistant
        </Link>
      </nav>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 border-primary/15 shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md md:w-full"
        aria-haspopup="menu"
        aria-label="Open account menu"
        onClick={() => menu?.openUserMenu()}
      >
        <CircleUser className="size-4 shrink-0" aria-hidden />
        Account
      </Button>
    </aside>
  )
}

export default function DashboardPage() {
  const { user } = useUser()
  const [tokenChecked, setTokenChecked] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [boards, setBoards] = useState<Board[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [newBoardDescription, setNewBoardDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0])
  useEffect(() => {
    const loadBoards = async () => {
      const token = localStorage.getItem('token')
      setHasToken(Boolean(token))
      setTokenChecked(true)
      if (!token) return

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
      if (!baseUrl) return

      try {
        const response = await fetch(`${baseUrl}/app/dashboard`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await readJsonSafely<{
          success?: boolean
          boards?: Record<string, unknown>[]
          message?: string
        }>(response)
        if (!response.ok || data.success === false) {
          throw new Error(data.message || `Failed to load boards (${response.status})`)
        }
        const rows = Array.isArray(data.boards) ? data.boards : []
        setBoards(rows.map((row) => boardFromDbRow(row, user)))
      } catch (err) {
        console.error(err)
        setBoards([])
      }
    }

    void loadBoards()
  }, [user?.id])

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return

    const title = newBoardTitle.trim()
    const description = newBoardDescription
    const color = selectedColor

    const token = localStorage.getItem('token')
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
    if (!token || !baseUrl) return

    try {
      const createdBoard = await createBoard(title, description, color, user, token, baseUrl)
      setBoards((prev) => [createdBoard, ...prev])
      setNewBoardTitle('')
      setNewBoardDescription('')
      setSelectedColor(BOARD_COLORS[0])
      setIsCreateOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (!tokenChecked) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <PageLoadingIndicator />
      </div>
    )
  }

  if (!hasToken) {
    return <NotFound />
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      <DashboardSideNav />
      <div className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight md:text-3xl">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20 transition-all duration-200 hover:bg-primary/[0.14] hover:shadow-md md:size-12">
                <Kanban className="size-6 md:size-7" aria-hidden />
              </span>
              Your Boards
            </h1>
            <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-sm md:text-base">
              <Sparkles className="hidden size-4 text-primary/70 sm:inline" aria-hidden />
              {user
                ? `Welcome back, ${user.name} — manage and organize your projects`
                : 'Manage and organize your projects'}
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]">
                <Plus className="size-4" />
                <span className="hidden sm:inline">New Board</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="board-title">Board Title</Label>
                  <Input
                    id="board-title"
                    placeholder="Enter board title"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Board Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {BOARD_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`h-8 w-8 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 ${
                          selectedColor === c ? 'ring-2 ring-offset-2 ring-offset-background ring-primary shadow-sm' : ''
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => setSelectedColor(c)}
                        aria-label={`Select ${c} color`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="board-description">Description</Label>
                  <Textarea
                    id="board-description"
                    placeholder="What is this board for?"
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <Button onClick={handleCreateBoard} className="w-full">
                  Create Board
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board) => (
              <Link key={board.id} href={`/app/board/${board.id}`}>
                <Card className="group cursor-pointer overflow-hidden shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/35">
                  <div
                    className="h-24 transition-transform duration-300 group-hover:scale-[1.02] md:h-28"
                    style={{ backgroundColor: board.backgroundColor }}
                  />
                  <CardContent className="p-4 transition-colors duration-200 group-hover:bg-muted/40">
                    <h3 className="truncate font-semibold text-lg transition-colors duration-200 group-hover:text-primary">
                      {board.title}
                    </h3>
                    {board.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{board.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground text-sm transition-colors duration-200 group-hover:text-foreground">
                      <Users className="size-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>
                        {board.members.length} member{board.members.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Create New Board Card */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Card className="group/card flex min-h-[160px] cursor-pointer flex-col items-center justify-center border-dashed transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-secondary/70 hover:shadow-md md:min-h-[180px]">
                  <CardContent className="flex flex-col items-center justify-center p-4 text-muted-foreground transition-colors duration-300 group-hover/card:text-foreground">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-secondary shadow-inner ring-2 ring-transparent transition-all duration-300 group-hover/card:scale-105 group-hover/card:bg-primary/10 group-hover/card:ring-primary/20">
                      <Plus className="size-6 text-primary transition-transform duration-300 group-hover/card:rotate-90" />
                    </div>
                    <span className="font-medium">Create new board</span>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>
        </div>

        {/* Empty State */}
        {boards.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/30 py-14 text-center shadow-inner transition-colors duration-300 hover:bg-muted/40">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-background shadow-md ring-2 ring-primary/10 transition-transform duration-300 hover:scale-105">
              <Plus className="size-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No boards yet</h3>
            <p className="mb-6 text-muted-foreground">Create your first board to get started</p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              Create Board
            </Button>
          </div>
        ) : null}
      </div>
      </div>
    </div>
  )
}
