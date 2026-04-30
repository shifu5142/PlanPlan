'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR, { mutate } from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Users } from 'lucide-react'
import { getBoards, createBoard } from '@/lib/store'
import type { Board } from '@/lib/types'
import { BOARD_COLORS } from '@/lib/types'

function fetcher(): Board[] {
  return getBoards()
}

export default function DashboardPage() {
  const { data: boards = [] } = useSWR('boards', fetcher)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0])

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) return
    createBoard(newBoardTitle, selectedColor)
    mutate('boards')
    setNewBoardTitle('')
    setSelectedColor(BOARD_COLORS[0])
    setIsCreateOpen(false)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your Boards</h1>
            <p className="text-muted-foreground mt-1">Manage and organize your projects</p>
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
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Board Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {BOARD_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-md transition-all ${
                          selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
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
                <div
                  className="h-24 md:h-28"
                  style={{ backgroundColor: board.backgroundColor }}
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                    {board.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                    <Users className="h-4 w-4" />
                    <span>{board.members.length} member{board.members.length !== 1 ? 's' : ''}</span>
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
        {boards.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No boards yet</h3>
            <p className="text-muted-foreground mb-4">Create your first board to get started</p>
            <Button onClick={() => setIsCreateOpen(true)}>Create Board</Button>
          </div>
        )}
      </div>
    </div>
  )
}
