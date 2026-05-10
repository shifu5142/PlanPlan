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
        'group cursor-pointer shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/25',
        (isDragging || isSortableDragging) && 'opacity-50 ring-2 ring-primary shadow-md',
      )}
    >
      <CardContent className="p-3">
        {/* Labels */}
        {card.labels.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {card.labels.map((label) => (
              <span
                key={label.id}
                className="rounded-full px-2 py-0.5 text-xs font-medium text-white transition-transform duration-200 group-hover:scale-[1.02]"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <p className="text-sm leading-snug font-medium transition-colors duration-200 group-hover:text-primary">
          {card.title}
        </p>

        {/* Footer */}
        {(card.dueDate || card.assignees.length > 0) && (
          <div className="mt-3 flex items-center justify-between">
            {/* Due Date */}
            {card.dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors duration-200',
                  isOverdue && 'bg-destructive/20 text-destructive',
                  isDueToday && 'bg-warning/20 text-warning',
                  !isOverdue && !isDueToday && 'bg-secondary text-muted-foreground group-hover:bg-secondary/90',
                )}
              >
                <Calendar className="size-3" aria-hidden />
                <span>{format(new Date(card.dueDate), 'MMM d')}</span>
              </div>
            )}

            {/* Assignees */}
            {card.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {card.assignees.slice(0, 3).map((assignee) => (
                  <Avatar
                    key={assignee.id}
                    className="size-6 border-2 border-card shadow-sm transition-transform duration-200 hover:z-10 hover:scale-110"
                  >
                    <AvatarFallback className="bg-secondary text-[10px]">
                      {assignee.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {card.assignees.length > 3 && (
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-secondary text-[10px] font-medium shadow-sm">
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
