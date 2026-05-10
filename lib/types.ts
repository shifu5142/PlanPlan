export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Card {
  id: string
  title: string
  description?: string
  columnId: string
  boardId: string
  labels: Label[]
  assignees: User[]
  dueDate?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  title: string
  boardId: string
  cards: Card[]
  order: number
}

export interface Board {
  id: string
  title: string
  description?: string
  backgroundColor: string
  members: User[]
  columns: Column[]
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export const DEFAULT_LABELS: Label[] = [
  { id: 'l1', name: 'Bug', color: '#ef4444' },
  { id: 'l2', name: 'Feature', color: '#3b82f6' },
  { id: 'l3', name: 'Enhancement', color: '#22c55e' },
  { id: 'l4', name: 'Documentation', color: '#f59e0b' },
  { id: 'l5', name: 'High Priority', color: '#ec4899' },
]

export const BOARD_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#ef4444',
  '#84cc16',
]
