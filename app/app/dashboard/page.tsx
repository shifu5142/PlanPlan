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
import { Bot, CircleUser, LayoutDashboard, Plus, Users } from 'lucide-react'
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

/** Builds a dashboard board locally (no API). */
function createStaticBoard(
  title: string,
  description: string,
  backgroundColor: string,
  viewer: User | null
): Board {
  const trimmed = title.trim()
  const desc = description.trim()
  const now = new Date().toISOString()
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `b-${Date.now()}-${Math.random().toString(16).slice(2)}`

  return {
    id,
    title: trimmed,
    ...(desc ? { description: desc } : {}),
    backgroundColor,
    members: viewer ? [viewer] : [],
    columns: [],
    createdAt: now,
    updatedAt: now,
  }
}

function DashboardSideNav() {
  const pathname = usePathname()
  const menu = useUserMenuControl()

  const linkClass = (href: string, exact?: boolean) => {
    const active = exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`)
    return cn(
      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      active
        ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )
  }

  return (
    <aside className="flex shrink-0 flex-row flex-wrap items-center gap-2 border-border border-b bg-sidebar px-3 py-2.5 shadow-sm md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-52 md:flex-col md:items-stretch md:gap-4 md:border-r md:px-4 md:py-5">
      <p className="hidden w-full text-muted-foreground text-xs font-medium uppercase tracking-wide md:block">
        Navigate
      </p>
      <nav className="flex min-w-0 flex-1 flex-row gap-1 md:flex-col md:flex-none">
        <Link href="/app/dashboard" className={linkClass('/app/dashboard', true)}>
          <LayoutDashboard className="size-4 shrink-0" aria-hidden />
          Dashboard
        </Link>
        <Link href="/app/ai" className={linkClass('/app/ai')}>
          <Bot className="size-4 shrink-0" aria-hidden />
          AI Assistant
        </Link>
      </nav>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 md:w-full"
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

    const board = createStaticBoard(title, description, color, user)
    setBoards((prev) => [board, ...prev])
    setNewBoardTitle('')
    setNewBoardDescription('')
    setSelectedColor(BOARD_COLORS[0])
    setIsCreateOpen(false)

    const token = localStorage.getItem('token')
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
    if (!token || !baseUrl) return

    const response = await fetch(`${baseUrl}/app/dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description: description.trim() ? description.trim() : null,
        color,
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
      }
    }>(response)
    if (!response.ok || data.success === false) {
      throw new Error(data.message || `Failed to create board (${response.status})`)
    }

    const row = data.data
    if (row != null && row.id != null && String(row.id).length > 0) {
      const serverBoard = boardFromDbRow(
        {
          id: row.id,
          title: row.title,
          description: row.description ?? null,
          color: row.color,
          user_id: row.user_id,
        },
        user,
      )
      setBoards((prev) => {
        const withoutOptimistic = prev.filter((b) => b.id !== board.id)
        return [serverBoard, ...withoutOptimistic]
      })
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your Boards</h1>
            <p className="text-muted-foreground mt-1">
              {user
                ? `Welcome back, ${user.name} — manage and organize your projects`
                : 'Manage and organize your projects'}
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
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
                        className={`w-8 h-8 rounded-md transition-all ${
                          selectedColor === c ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''
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
                <Card className="group cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 overflow-hidden">
                  <div className="h-24 md:h-28" style={{ backgroundColor: board.backgroundColor }} />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                      {board.title}
                    </h3>
                    {board.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{board.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                      <Users className="h-4 w-4" />
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
                <Card className="cursor-pointer border-dashed hover:border-primary hover:bg-secondary/50 transition-all min-h-[160px] md:min-h-[180px] flex items-center justify-center">
                  <CardContent className="flex flex-col items-center justify-center text-muted-foreground p-4">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span className="font-medium">Create new board</span>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>
        </div>

        {/* Empty State */}
        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No boards yet</h3>
            <p className="text-muted-foreground mb-4">Create your first board to get started</p>
            <Button onClick={() => setIsCreateOpen(true)}>Create Board</Button>
          </div>
        ) : null}
      </div>
      </div>
    </div>
  )
}
