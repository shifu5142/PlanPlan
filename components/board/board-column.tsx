'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { mutate } from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react'
import { addCard, updateColumn, deleteColumn } from '@/lib/store'
import type { Column, Card } from '@/lib/types'
import { TaskCard } from './task-card'
import { cn } from '@/lib/utils'

interface BoardColumnProps {
  column: Column
  boardId: string
  onCardClick: (card: Card) => void
}

export function BoardColumn({ column, boardId, onCardClick }: BoardColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [columnTitle, setColumnTitle] = useState(column.title)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return
    addCard(boardId, column.id, newCardTitle)
    mutate(`board:${boardId}`)
    setNewCardTitle('')
    setIsAddingCard(false)
  }

  const handleTitleSave = () => {
    if (columnTitle.trim() && columnTitle !== column.title) {
      updateColumn(boardId, column.id, columnTitle)
      mutate(`board:${boardId}`)
    }
    setIsEditingTitle(false)
  }

  const handleDeleteColumn = () => {
    deleteColumn(boardId, column.id)
    mutate(`board:${boardId}`)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-card shadow-sm ring-1 ring-foreground/10 transition-[box-shadow,transform] duration-200 hover:shadow-md md:w-80',
        isDragging && 'ring-2 ring-primary/35 shadow-lg'
      )}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between border-border border-b bg-muted/20 p-3 transition-colors duration-200"
        {...attributes}
        {...listeners}
      >
        {isEditingTitle ? (
          <Input
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            className="h-7 font-semibold text-sm"
            autoFocus
          />
        ) : (
          <h3 className="flex items-center gap-2 font-semibold text-sm transition-colors hover:text-primary/90">
            {column.title}
            <span className="rounded bg-secondary px-1.5 py-0.5 text-muted-foreground text-xs tabular-nums ring-1 ring-border/80">
              {column.cards.length}
            </span>
          </h3>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 transition-colors duration-150 hover:bg-muted"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="duration-150 animate-in fade-in-0 zoom-in-95">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)} className="cursor-pointer">
              <Pencil className="mr-2 size-4" />
              Edit title
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteColumn} className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="mr-2 size-4" />
              Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards List */}
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <TaskCard key={card.id} card={card} onClick={() => onCardClick(card)} />
          ))}
        </SortableContext>

        {/* Add Card Form */}
        {isAddingCard ? (
          <div className="rounded-lg bg-secondary/60 p-2 shadow-inner ring-1 ring-border/60 transition-colors duration-200">
            <Input
              placeholder="Enter card title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
              className="mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" className="transition-all duration-150 active:scale-[0.98]" onClick={handleAddCard}>
                Add Card
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingCard(false)
                  setNewCardTitle('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCard(true)}
            className="flex w-full items-center gap-2 rounded-lg p-2 text-muted-foreground text-sm transition-all duration-200 hover:bg-secondary/70 hover:text-foreground active:scale-[0.99]"
          >
            <Plus className="size-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  )
}
