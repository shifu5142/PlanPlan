'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ActionButtons,
  BoardExtras,
  DescriptionCard,
  ErrorState,
  Header,
  HeroSection,
  LoadingState,
  SideQuestChecklist,
  normalizeBoard,
  type BoardDetails,
} from './usecontext'

const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''

function BoardPage() {
  const router = useRouter()
  const params = useParams<{ boardld: string }>()
  const boardId = params.boardld

  const [board, setBoard] = useState<BoardDetails | null>(null)
  const [loadState, setLoadState] = useState<
    'loading' | 'ready' | 'error'
  >('loading')

  useEffect(() => {
    async function loadBoard() {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          router.replace('/auth/login')
          return
        }

        const response = await fetch(`${baseUrl}/app/board/${boardId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('fetch failed')

        const data: unknown = await response.json()
        const normalizedBoard = normalizeBoard(data)

        if (!normalizedBoard) throw new Error('invalid board response')

        setBoard(normalizedBoard)
        setLoadState('ready')
      } catch (error) {
        console.error(error)
        setLoadState('error')
      }
    }

    loadBoard()
  }, [boardId, router])

  if (loadState === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState />
      </div>
    )
  }

  if (loadState === 'error' || !board) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Header board={board} boardId={boardId} />

      <div className="space-y-6">
        <HeroSection board={board} />
        <DescriptionCard board={board} />
        <SideQuestChecklist board={board} />
        <ActionButtons board={board} />
        <BoardExtras board={board} />
      </div>
    </div>
  )
}

export default BoardPage
