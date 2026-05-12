'use client'

import { useEffect, useState } from 'react'
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

} from '@dnd-kit/sortable'

import { useParams } from 'next/navigation'


function BoardPage() {
  const params = useParams<{ boardld: string }>()
  const boardId = params.boardld
  const [board, setBoard] = useState<unknown>(null)
  
  useEffect(() => {
    const loadBoard = async () => {
      const res = await fetch(`/api/board/${boardId}`)
      const data = await res.json()
      setBoard(data)
      console.log(data)
    }
    
    void loadBoard()
  }, [boardId])

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Board not found</p>
      </div>
    )
  }
  return (

    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Board</h1>
    </div>
  )
}
export default BoardPage
