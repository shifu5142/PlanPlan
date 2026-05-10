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
        'cursor-pointer transition-all border-border/60 bg-background hover:shadow-md hover:border-primary/30',
        (isDragging || isSortableDragging) && 'opacity-60 shadow-lg ring-2 ring-primary/50'
      )}
    >
      <CardContent className="p-3.5">
        {/* Labels */}
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {card.labels.map((label) => (
              <span
                key={label.id}
                className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium tracking-wide"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <p className="text-sm font-medium leading-snug text-foreground">{card.title}</p>

        {/* Footer */}
        {(card.dueDate || card.assignees.length > 0) && (
          <div className="flex items-center justify-between mt-3">
            {/* Due Date */}
            {card.dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs px-2 py-1 rounded-md font-medium',
                  isOverdue && 'bg-destructive/15 text-destructive',
                  isDueToday && 'bg-warning/15 text-warning',
                  !isOverdue && !isDueToday && 'bg-muted text-muted-foreground'
                )}
              >
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(card.dueDate), 'MMM d')}</span>
              </div>
            )}

            {/* Assignees */}
            {card.assignees.length > 0 && (
              <div className="flex -space-x-1.5">
                {card.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground font-medium">
                      {assignee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {card.assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background text-muted-foreground">
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
