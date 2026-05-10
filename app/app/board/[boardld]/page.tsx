'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR, { mutate } from 'swr'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Bot, Plus, ArrowLeft, UserPlus } from 'lucide-react'
import { getBoard, addColumn, moveCard, updateBoard } from '@/lib/store'
import type { Board, Card } from '@/lib/types'
import { BoardColumn } from '@/components/board/board-column'
import { TaskCard } from '@/components/board/task-card'
import { CardModal } from '@/components/board/card-modal'

function fetcher(key: string): Board | undefined {
  const boardId = key.split(':')[1]
  return getBoard(boardId)
}

function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = use(params)
  const router = useRouter()
  const { data: board } = useSWR(`board:${boardId}`, fetcher)
  
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)
  const [boardTitle, setBoardTitle] = useState('')
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Board not found</p>
      </div>
    )
  }

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return
    addColumn(boardId, newColumnTitle)
    mutate(`board:${boardId}`)
    setNewColumnTitle('')
    setIsAddingColumn(false)
  }

  const handleTitleSave = () => {
    if (boardTitle.trim() && boardTitle !== board.title) {
      updateBoard(boardId, { title: boardTitle })
      mutate(`board:${boardId}`)
    }
    setEditingTitle(false)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeColumn = board.columns.find(col => 
      col.cards.some(card => card.id === active.id)
    )
    if (activeColumn) {
      const card = activeColumn.cards.find(c => c.id === active.id)
      setActiveCard(card || null)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find source column
    const sourceColumn = board.columns.find(col => 
      col.cards.some(card => card.id === activeId)
    )
    
    // Find target column (either by card or column id)
    let targetColumn = board.columns.find(col => 
      col.cards.some(card => card.id === overId)
    )
    
    // If not found in cards, check if it's a column id
    if (!targetColumn) {
      targetColumn = board.columns.find(col => col.id === overId)
    }

    if (!sourceColumn || !targetColumn || sourceColumn.id === targetColumn.id) return

    // Move card to new column
    const cardIndex = sourceColumn.cards.findIndex(c => c.id === activeId)
    const overCardIndex = targetColumn.cards.findIndex(c => c.id === overId)
    const newIndex = overCardIndex >= 0 ? overCardIndex : targetColumn.cards.length

    moveCard(boardId, activeId, sourceColumn.id, targetColumn.id, newIndex)
    mutate(`board:${boardId}`)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    // Find source column
    const sourceColumn = board.columns.find(col => 
      col.cards.some(card => card.id === activeId)
    )

    if (!sourceColumn) return

    // Find target position within same column
    const activeIndex = sourceColumn.cards.findIndex(c => c.id === activeId)
    const overIndex = sourceColumn.cards.findIndex(c => c.id === overId)

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      // Reorder within same column
      const newCards = [...sourceColumn.cards]
      const [movedCard] = newCards.splice(activeIndex, 1)
      newCards.splice(overIndex, 0, movedCard)
      
      // Update cards order
      sourceColumn.cards = newCards
      mutate(`board:${boardId}`)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      {/* Board Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/app/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          {editingTitle ? (
            <Input
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="text-xl font-bold h-auto py-1 px-2 w-64"
              autoFocus
            />
          ) : (
            <h1
              className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => {
                setBoardTitle(board.title)
                setEditingTitle(true)
              }}
            >
              {board.title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Members */}
          <div className="hidden sm:flex items-center -space-x-2">
            {board.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarFallback className="text-xs bg-secondary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {board.members.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium border-2 border-background">
                +{board.members.length - 4}
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsInviteOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Invite</span>
          </Button>

          <Link href={`/app/ai?boardId=${boardId}`}>
            <Button size="sm" className="gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Columns Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full">
            <SortableContext
              items={board.columns.map(col => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {board.columns.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  boardId={boardId}
                  onCardClick={setSelectedCard}
                />
              ))}
            </SortableContext>

            {/* Add Column */}
            {isAddingColumn ? (
              <div className="shrink-0 w-72 md:w-80 bg-card rounded-lg p-3">
                <Input
                  placeholder="Enter column title"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={handleAddColumn}>
                    Add Column
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingColumn(false)
                      setNewColumnTitle('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="shrink-0 w-72 md:w-80 h-12 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-secondary/30 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add Column
              </button>
            )}
          </div>

          <DragOverlay>
            {activeCard ? <TaskCard card={activeCard} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Card Modal */}
      <CardModal
        card={selectedCard}
        boardId={boardId}
        onClose={() => setSelectedCard(null)}
      />

      {/* Invite Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input placeholder="Enter email address" type="email" />
            <Button className="w-full">Send Invitation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BoardPage
