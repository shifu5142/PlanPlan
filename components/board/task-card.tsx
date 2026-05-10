'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import type { Card as TaskCardType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  card: TaskCardType
  onClick?: () => void
  isDragging?: boolean
}

export function TaskCard({ card, onClick, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isOverdue = card.dueDate && isPast(new Date(card.dueDate)) && !isToday(new Date(card.dueDate))
  const isDueToday = card.dueDate && isToday(new Date(card.dueDate))

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all hover:ring-2 hover:ring-primary/50',
        (isDragging || isSortableDragging) && 'opacity-50 ring-2 ring-primary',
      )}
    >
      <CardContent className="p-3">
        {/* Labels */}
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map((label) => (
              <span
                key={label.id}
                className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <p className="text-sm font-medium leading-snug">{card.title}</p>

        {/* Footer */}
        {(card.dueDate || card.assignees.length > 0) && (
          <div className="flex items-center justify-between mt-3">
            {/* Due Date */}
            {card.dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1 text-xs px-2 py-1 rounded',
                  isOverdue && 'bg-destructive/20 text-destructive',
                  isDueToday && 'bg-warning/20 text-warning',
                  !isOverdue && !isDueToday && 'bg-secondary text-muted-foreground'
                )}
              >
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(card.dueDate), 'MMM d')}</span>
              </div>
            )}

            {/* Assignees */}
            {card.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {card.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-card">
                    <AvatarFallback className="text-[10px] bg-secondary">
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {card.assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-medium border-2 border-card">
                    +{card.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
