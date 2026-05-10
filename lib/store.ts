<<<<<<< HEAD
import type { Board, Card, Column, User, ChatMessage } from './types'

// Mock current user
export const currentUser: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: undefined,
}

// Mock team members
export const teamMembers: User[] = [
  currentUser,
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'u3', name: 'Bob Wilson', email: 'bob@example.com' },
  { id: 'u4', name: 'Alice Brown', email: 'alice@example.com' },
]

// Initial boards data
const initialBoards: Board[] = [
  {
    id: 'b1',
    title: 'Product Development',
    backgroundColor: '#3b82f6',
    members: [teamMembers[0], teamMembers[1]],
    columns: [
      {
        id: 'col1',
        title: 'To Do',
        boardId: 'b1',
        order: 0,
        cards: [
          {
            id: 'c1',
            title: 'Design new landing page',
            description: 'Create a modern, responsive landing page design',
            columnId: 'col1',
            boardId: 'b1',
            labels: [{ id: 'l2', name: 'Feature', color: '#3b82f6' }],
            assignees: [teamMembers[0]],
            dueDate: '2026-05-15',
            order: 0,
            createdAt: '2026-04-20',
            updatedAt: '2026-04-20',
          },
          {
            id: 'c2',
            title: 'Set up CI/CD pipeline',
            description: 'Configure automated testing and deployment',
            columnId: 'col1',
            boardId: 'b1',
            labels: [{ id: 'l3', name: 'Enhancement', color: '#22c55e' }],
            assignees: [teamMembers[1]],
            order: 1,
            createdAt: '2026-04-21',
            updatedAt: '2026-04-21',
          },
        ],
      },
      {
        id: 'col2',
        title: 'In Progress',
        boardId: 'b1',
        order: 1,
        cards: [
          {
            id: 'c3',
            title: 'Implement user authentication',
            description: 'Add login, registration, and password reset',
            columnId: 'col2',
            boardId: 'b1',
            labels: [{ id: 'l2', name: 'Feature', color: '#3b82f6' }, { id: 'l5', name: 'High Priority', color: '#ec4899' }],
            assignees: [teamMembers[0], teamMembers[1]],
            dueDate: '2026-05-01',
            order: 0,
            createdAt: '2026-04-18',
            updatedAt: '2026-04-25',
          },
        ],
      },
      {
        id: 'col3',
        title: 'Review',
        boardId: 'b1',
        order: 2,
        cards: [],
      },
      {
        id: 'col4',
        title: 'Done',
        boardId: 'b1',
        order: 3,
        cards: [
          {
            id: 'c4',
            title: 'Project setup',
            description: 'Initialize repository and configure development environment',
            columnId: 'col4',
            boardId: 'b1',
            labels: [{ id: 'l3', name: 'Enhancement', color: '#22c55e' }],
            assignees: [teamMembers[0]],
            order: 0,
            createdAt: '2026-04-15',
            updatedAt: '2026-04-17',
          },
        ],
      },
    ],
    createdAt: '2026-04-15',
    updatedAt: '2026-04-28',
  },
  {
    id: 'b2',
    title: 'Marketing Campaign',
    backgroundColor: '#22c55e',
    members: [teamMembers[2], teamMembers[3]],
    columns: [
      {
        id: 'col5',
        title: 'Ideas',
        boardId: 'b2',
        order: 0,
        cards: [
          {
            id: 'c5',
            title: 'Social media strategy',
            description: 'Plan content calendar for Q2',
            columnId: 'col5',
            boardId: 'b2',
            labels: [{ id: 'l4', name: 'Documentation', color: '#f59e0b' }],
            assignees: [teamMembers[2]],
            order: 0,
            createdAt: '2026-04-22',
            updatedAt: '2026-04-22',
          },
        ],
      },
      {
        id: 'col6',
        title: 'In Progress',
        boardId: 'b2',
        order: 1,
        cards: [],
      },
      {
        id: 'col7',
        title: 'Completed',
        boardId: 'b2',
        order: 2,
        cards: [],
      },
    ],
    createdAt: '2026-04-20',
    updatedAt: '2026-04-28',
  },
]

// In-memory store (simulating database)
let boards: Board[] = [...initialBoards]
let chatMessages: ChatMessage[] = []

// Board operations
export function getBoards(): Board[] {
  return boards
}

export function getBoard(id: string): Board | undefined {
  return boards.find(b => b.id === id)
}

export function createBoard(
  title: string,
  backgroundColor: string,
  description?: string,
): Board {
  const newBoard: Board = {
    id: `b${Date.now()}`,
    title,
    ...(description?.trim() ? { description: description.trim() } : {}),
    backgroundColor,
    members: [currentUser],
    columns: [
      { id: `col${Date.now()}-1`, title: 'To Do', boardId: '', order: 0, cards: [] },
      { id: `col${Date.now()}-2`, title: 'In Progress', boardId: '', order: 1, cards: [] },
      { id: `col${Date.now()}-3`, title: 'Done', boardId: '', order: 2, cards: [] },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  newBoard.columns.forEach(col => col.boardId = newBoard.id)
  boards = [...boards, newBoard]
  return newBoard
}

export function updateBoard(id: string, updates: Partial<Board>): Board | undefined {
  const index = boards.findIndex(b => b.id === id)
  if (index === -1) return undefined
  boards[index] = { ...boards[index], ...updates, updatedAt: new Date().toISOString() }
  boards = [...boards]
  return boards[index]
}

export function deleteBoard(id: string): boolean {
  const initialLength = boards.length
  boards = boards.filter(b => b.id !== id)
  return boards.length < initialLength
}

// Column operations
export function addColumn(boardId: string, title: string): Column | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  const newColumn: Column = {
    id: `col${Date.now()}`,
    title,
    boardId,
    order: board.columns.length,
    cards: [],
  }
  board.columns.push(newColumn)
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return newColumn
}

export function updateColumn(boardId: string, columnId: string, title: string): Column | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  const column = board.columns.find(c => c.id === columnId)
  if (!column) return undefined
  
  column.title = title
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return column
}

export function deleteColumn(boardId: string, columnId: string): boolean {
  const board = boards.find(b => b.id === boardId)
  if (!board) return false
  
  const initialLength = board.columns.length
  board.columns = board.columns.filter(c => c.id !== columnId)
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return board.columns.length < initialLength
}

// Card operations
export function addCard(boardId: string, columnId: string, title: string): Card | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  const column = board.columns.find(c => c.id === columnId)
  if (!column) return undefined
  
  const newCard: Card = {
    id: `c${Date.now()}`,
    title,
    columnId,
    boardId,
    labels: [],
    assignees: [],
    order: column.cards.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  column.cards.push(newCard)
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return newCard
}

export function updateCard(boardId: string, cardId: string, updates: Partial<Card>): Card | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  for (const column of board.columns) {
    const cardIndex = column.cards.findIndex(c => c.id === cardId)
    if (cardIndex !== -1) {
      column.cards[cardIndex] = {
        ...column.cards[cardIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      board.updatedAt = new Date().toISOString()
      boards = [...boards]
      return column.cards[cardIndex]
    }
  }
  return undefined
}

export function deleteCard(boardId: string, cardId: string): boolean {
  const board = boards.find(b => b.id === boardId)
  if (!board) return false
  
  for (const column of board.columns) {
    const initialLength = column.cards.length
    column.cards = column.cards.filter(c => c.id !== cardId)
    if (column.cards.length < initialLength) {
      board.updatedAt = new Date().toISOString()
      boards = [...boards]
      return true
    }
  }
  return false
}

export function moveCard(
  boardId: string,
  cardId: string,
  sourceColumnId: string,
  targetColumnId: string,
  newIndex: number
): boolean {
  const board = boards.find(b => b.id === boardId)
  if (!board) return false
  
  const sourceColumn = board.columns.find(c => c.id === sourceColumnId)
  const targetColumn = board.columns.find(c => c.id === targetColumnId)
  
  if (!sourceColumn || !targetColumn) return false
  
  const cardIndex = sourceColumn.cards.findIndex(c => c.id === cardId)
  if (cardIndex === -1) return false
  
  const [card] = sourceColumn.cards.splice(cardIndex, 1)
  card.columnId = targetColumnId
  card.updatedAt = new Date().toISOString()
  
  targetColumn.cards.splice(newIndex, 0, card)
  
  // Update orders
  sourceColumn.cards.forEach((c, i) => c.order = i)
  targetColumn.cards.forEach((c, i) => c.order = i)
  
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return true
}

// Chat operations
export function getChatMessages(): ChatMessage[] {
  return chatMessages
}

export function addChatMessage(role: 'user' | 'assistant', content: string): ChatMessage {
  const message: ChatMessage = {
    id: `msg${Date.now()}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  }
  chatMessages = [...chatMessages, message]
  return message
}

export function clearChatMessages(): void {
  chatMessages = []
}

export function getCard(boardId: string, cardId: string): Card | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  for (const column of board.columns) {
    const card = column.cards.find(c => c.id === cardId)
    if (card) return card
  }
  return undefined
}
=======
import type { Board, Card, Column, User, ChatMessage } from './types'

// Mock current user
export const currentUser: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: undefined,
}

// Mock team members
export const teamMembers: User[] = [
  currentUser,
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'u3', name: 'Bob Wilson', email: 'bob@example.com' },
  { id: 'u4', name: 'Alice Brown', email: 'alice@example.com' },
]

// Initial boards data
const initialBoards: Board[] = [
  {
    id: 'b1',
    title: 'Product Development',
    backgroundColor: '#3b82f6',
    members: [teamMembers[0], teamMembers[1]],
    columns: [
      {
        id: 'col1',
        title: 'To Do',
        boardId: 'b1',
        order: 0,
        cards: [
          {
            id: 'c1',
            title: 'Design new landing page',
            description: 'Create a modern, responsive landing page design',
            columnId: 'col1',
            boardId: 'b1',
            labels: [{ id: 'l2', name: 'Feature', color: '#3b82f6' }],
            assignees: [teamMembers[0]],
            dueDate: '2026-05-15',
            order: 0,
            createdAt: '2026-04-20',
            updatedAt: '2026-04-20',
          },
          {
            id: 'c2',
            title: 'Set up CI/CD pipeline',
            description: 'Configure automated testing and deployment',
            columnId: 'col1',
            boardId: 'b1',
            labels: [{ id: 'l3', name: 'Enhancement', color: '#22c55e' }],
            assignees: [teamMembers[1]],
            order: 1,
            createdAt: '2026-04-21',
            updatedAt: '2026-04-21',
          },
        ],
      },
      {
        id: 'col2',
        title: 'In Progress',
        boardId: 'b1',
        order: 1,
        cards: [
          {
            id: 'c3',
            title: 'Implement user authentication',
            description: 'Add login, registration, and password reset',
            columnId: 'col2',
            boardId: 'b1',
            labels: [{ id: 'l2', name: 'Feature', color: '#3b82f6' }, { id: 'l5', name: 'High Priority', color: '#ec4899' }],
            assignees: [teamMembers[0], teamMembers[1]],
            dueDate: '2026-05-01',
            order: 0,
            createdAt: '2026-04-18',
            updatedAt: '2026-04-25',
          },
        ],
      },
      {
        id: 'col3',
        title: 'Review',
        boardId: 'b1',
        order: 2,
        cards: [],
      },
      {
        id: 'col4',
        title: 'Done',
        boardId: 'b1',
        order: 3,
        cards: [
          {
            id: 'c4',
            title: 'Project setup',
            description: 'Initialize repository and configure development environment',
            columnId: 'col4',
            boardId: 'b1',
            labels: [{ id: 'l3', name: 'Enhancement', color: '#22c55e' }],
            assignees: [teamMembers[0]],
            order: 0,
            createdAt: '2026-04-15',
            updatedAt: '2026-04-17',
          },
        ],
      },
    ],
    createdAt: '2026-04-15',
    updatedAt: '2026-04-28',
  },
  {
    id: 'b2',
    title: 'Marketing Campaign',
    backgroundColor: '#22c55e',
    members: [teamMembers[2], teamMembers[3]],
    columns: [
      {
        id: 'col5',
        title: 'Ideas',
        boardId: 'b2',
        order: 0,
        cards: [
          {
            id: 'c5',
            title: 'Social media strategy',
            description: 'Plan content calendar for Q2',
            columnId: 'col5',
            boardId: 'b2',
            labels: [{ id: 'l4', name: 'Documentation', color: '#f59e0b' }],
            assignees: [teamMembers[2]],
            order: 0,
            createdAt: '2026-04-22',
            updatedAt: '2026-04-22',
          },
        ],
      },
      {
        id: 'col6',
        title: 'In Progress',
        boardId: 'b2',
        order: 1,
        cards: [],
      },
      {
        id: 'col7',
        title: 'Completed',
        boardId: 'b2',
        order: 2,
        cards: [],
      },
    ],
    createdAt: '2026-04-20',
    updatedAt: '2026-04-28',
  },
]

// In-memory store (simulating database)
let boards: Board[] = [...initialBoards]
let chatMessages: ChatMessage[] = []

// Board operations
export function getBoards(): Board[] {
  return boards
}

export function getBoard(id: string): Board | undefined {
  return boards.find(b => b.id === id)
}

export function createBoard(
  title: string,
  backgroundColor: string,
  description?: string,
): Board {
  const newBoard: Board = {
    id: `b${Date.now()}`,
    title,
    ...(description?.trim() ? { description: description.trim() } : {}),
    backgroundColor,
    members: [currentUser],
    columns: [
      { id: `col${Date.now()}-1`, title: 'To Do', boardId: '', order: 0, cards: [] },
      { id: `col${Date.now()}-2`, title: 'In Progress', boardId: '', order: 1, cards: [] },
      { id: `col${Date.now()}-3`, title: 'Done', boardId: '', order: 2, cards: [] },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  newBoard.columns.forEach(col => col.boardId = newBoard.id)
  boards = [...boards, newBoard]
  return newBoard
}

export function updateBoard(id: string, updates: Partial<Board>): Board | undefined {
  const index = boards.findIndex(b => b.id === id)
  if (index === -1) return undefined
  boards[index] = { ...boards[index], ...updates, updatedAt: new Date().toISOString() }
  boards = [...boards]
  return boards[index]
}

export function deleteBoard(id: string): boolean {
  const initialLength = boards.length
  boards = boards.filter(b => b.id !== id)
  return boards.length < initialLength
}

// Column operations
export function addColumn(boardId: string, title: string): Column | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  const newColumn: Column = {
    id: `col${Date.now()}`,
    title,
    boardId,
    order: board.columns.length,
    cards: [],
  }
  board.columns.push(newColumn)
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return newColumn
}

export function updateColumn(boardId: string, columnId: string, title: string): Column | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  const column = board.columns.find(c => c.id === columnId)
  if (!column) return undefined
  
  column.title = title
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return column
}

export function deleteColumn(boardId: string, columnId: string): boolean {
  const board = boards.find(b => b.id === boardId)
  if (!board) return false
  
  const initialLength = board.columns.length
  board.columns = board.columns.filter(c => c.id !== columnId)
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return board.columns.length < initialLength
}

// Card operations
export function addCard(boardId: string, columnId: string, title: string): Card | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  const column = board.columns.find(c => c.id === columnId)
  if (!column) return undefined
  
  const newCard: Card = {
    id: `c${Date.now()}`,
    title,
    columnId,
    boardId,
    labels: [],
    assignees: [],
    order: column.cards.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  column.cards.push(newCard)
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return newCard
}

export function updateCard(boardId: string, cardId: string, updates: Partial<Card>): Card | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  for (const column of board.columns) {
    const cardIndex = column.cards.findIndex(c => c.id === cardId)
    if (cardIndex !== -1) {
      column.cards[cardIndex] = {
        ...column.cards[cardIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      board.updatedAt = new Date().toISOString()
      boards = [...boards]
      return column.cards[cardIndex]
    }
  }
  return undefined
}

export function deleteCard(boardId: string, cardId: string): boolean {
  const board = boards.find(b => b.id === boardId)
  if (!board) return false
  
  for (const column of board.columns) {
    const initialLength = column.cards.length
    column.cards = column.cards.filter(c => c.id !== cardId)
    if (column.cards.length < initialLength) {
      board.updatedAt = new Date().toISOString()
      boards = [...boards]
      return true
    }
  }
  return false
}

export function moveCard(
  boardId: string,
  cardId: string,
  sourceColumnId: string,
  targetColumnId: string,
  newIndex: number
): boolean {
  const board = boards.find(b => b.id === boardId)
  if (!board) return false
  
  const sourceColumn = board.columns.find(c => c.id === sourceColumnId)
  const targetColumn = board.columns.find(c => c.id === targetColumnId)
  
  if (!sourceColumn || !targetColumn) return false
  
  const cardIndex = sourceColumn.cards.findIndex(c => c.id === cardId)
  if (cardIndex === -1) return false
  
  const [card] = sourceColumn.cards.splice(cardIndex, 1)
  card.columnId = targetColumnId
  card.updatedAt = new Date().toISOString()
  
  targetColumn.cards.splice(newIndex, 0, card)
  
  // Update orders
  sourceColumn.cards.forEach((c, i) => c.order = i)
  targetColumn.cards.forEach((c, i) => c.order = i)
  
  board.updatedAt = new Date().toISOString()
  boards = [...boards]
  return true
}

// Chat operations
export function getChatMessages(): ChatMessage[] {
  return chatMessages
}

export function addChatMessage(role: 'user' | 'assistant', content: string): ChatMessage {
  const message: ChatMessage = {
    id: `msg${Date.now()}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  }
  chatMessages = [...chatMessages, message]
  return message
}

export function clearChatMessages(): void {
  chatMessages = []
}

export function getCard(boardId: string, cardId: string): Card | undefined {
  const board = boards.find(b => b.id === boardId)
  if (!board) return undefined
  
  for (const column of board.columns) {
    const card = column.cards.find(c => c.id === cardId)
    if (card) return card
  }
  return undefined
}
>>>>>>> 5145a8cd9bf545d1713bda93730c11d2f28b92e4
