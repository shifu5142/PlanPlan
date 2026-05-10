'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
import { Plus, Users } from 'lucide-react'
import type { Board, User } from '@/lib/types'
import { BOARD_COLORS } from '@/lib/types'
import { useUser } from '@/components/user-provider'

async function readJsonSafely<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Unexpected response (${response.status})`)
  }
  return (await response.json()) as T
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

      const response = await fetch(`${baseUrl}/app/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await readJsonSafely<{ success?: boolean; boards?: Board[]; message?: string }>(response)
      if (!response.ok || data.success === false) {
        throw new Error(data.message || `Failed to load boards (${response.status})`)
      }
      setBoards(Array.isArray(data.boards) ? data.boards : [])
    }

    void loadBoards()
  }, [])

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
      },
      body: JSON.stringify({ title, description, color, user_id: user?.id ?? null }),
    })
    const data = await readJsonSafely<{ success?: boolean; board?: Board; message?: string }>(response)
    if (!response.ok || data.success === false) {
      throw new Error(data.message || `Failed to create board (${response.status})`)
    }

    const serverBoard = data.board
    if (serverBoard?.id) {
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
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
  )
}
