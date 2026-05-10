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
      className="shrink-0 w-72 md:w-80 bg-card rounded-lg flex flex-col max-h-full"
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-border"
        {...attributes}
        {...listeners}
      >
        {isEditingTitle ? (
          <Input
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            className="h-7 text-sm font-semibold"
            autoFocus
          />
        ) : (
          <h3 className="font-semibold text-sm flex items-center gap-2">
            {column.title}
            <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
              {column.cards.length}
            </span>
          </h3>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteColumn}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext
          items={column.cards.map(card => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <TaskCard
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>

        {/* Add Card Form */}
        {isAddingCard ? (
          <div className="bg-secondary/50 rounded-lg p-2">
            <Input
              placeholder="Enter card title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
              className="mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCard}>
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
            onClick={() => setIsAddingCard(true)}
            className="w-full p-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  )
}
