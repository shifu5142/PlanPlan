'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { mutate } from 'swr'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Bot, Calendar, Tag, Users, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { updateCard, deleteCard } from '@/lib/store'
import { teamMembers } from '@/lib/store'
import { DEFAULT_LABELS, type Card, type Label as LabelType, type User } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CardModalProps {
  card: Card | null
  boardId: string
  onClose: () => void
}

export function CardModal({ card, boardId, onClose }: CardModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<User[]>([])

  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setDescription(card.description || '')
      setDueDate(card.dueDate ? new Date(card.dueDate) : undefined)
      setSelectedLabels(card.labels)
      setSelectedAssignees(card.assignees)
    }
  }, [card])

  if (!card) return null

  const handleSave = () => {
    updateCard(boardId, card.id, {
      title,
      description,
      dueDate: dueDate?.toISOString(),
      labels: selectedLabels,
      assignees: selectedAssignees,
    })
    mutate(`board:${boardId}`)
    onClose()
  }

  const handleDelete = () => {
    deleteCard(boardId, card.id)
    mutate(`board:${boardId}`)
    onClose()
  }

  const toggleLabel = (label: LabelType) => {
    setSelectedLabels(prev =>
      prev.some(l => l.id === label.id)
        ? prev.filter(l => l.id !== label.id)
        : [...prev, label]
    )
  }

  const toggleAssignee = (user: User) => {
    setSelectedAssignees(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    )
  }

  return (
    <Dialog open={!!card} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Edit Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="card-title">Title</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="card-description">Description</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              rows={4}
            />
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Label>Labels</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_LABELS.map((label) => (
                <button
                  key={label.id}
                  onClick={() => toggleLabel(label)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-medium transition-all',
                    selectedLabels.some(l => l.id === label.id)
                      ? 'ring-2 ring-offset-2 ring-offset-background ring-primary text-white'
                      : 'opacity-60 hover:opacity-100 text-white'
                  )}
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label>Due Date</Label>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {dueDate ? format(dueDate, 'PPP') : 'Select a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Label>Assignees</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => toggleAssignee(member)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all',
                    selectedAssignees.some(u => u.id === member.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] bg-secondary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex gap-2">
              <Link href={`/app/ai?boardId=${boardId}&cardId=${card.id}`}>
                <Button variant="outline" className="gap-2">
                  <Bot className="h-4 w-4" />
                  Ask AI about this task
                </Button>
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
