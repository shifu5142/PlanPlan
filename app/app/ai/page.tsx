'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, Send, Sparkles, ListTodo, Target, ArrowRight } from 'lucide-react'
import { getBoards, getBoard, getCard, getChatMessages, addChatMessage, clearChatMessages } from '@/lib/store'
import { currentUser } from '@/lib/store'
import type { Board, ChatMessage } from '@/lib/types'
import { cn } from '@/lib/utils'

function boardsFetcher(): Board[] {
  return getBoards()
}

function messagesFetcher(): ChatMessage[] {
  return getChatMessages()
}

const quickActions = [
  { label: 'Break down task', icon: ListTodo, prompt: 'Can you break down this task into smaller subtasks?' },
  { label: 'Prioritize tasks', icon: Target, prompt: 'Help me prioritize the tasks on this board based on urgency and importance.' },
  { label: 'Create work plan', icon: Sparkles, prompt: 'Create a work plan for completing the tasks on this board.' },
  { label: 'Suggest next step', icon: ArrowRight, prompt: 'What should I work on next?' },
]

function AIPageContent() {
  const searchParams = useSearchParams()
  const initialBoardId = searchParams.get('boardId')
  const initialCardId = searchParams.get('cardId')

  const { data: boards = [] } = useSWR('boards', boardsFetcher)
  const { data: messages = [], mutate: mutateMessages } = useSWR('messages', messagesFetcher, {
    refreshInterval: 100,
  })
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
  const [selectedBoardId, setSelectedBoardId] = useState<string>(initialBoardId || '')
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId || '')
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  /** Avoid duplicate greeting in React Strict Mode; reset when chat is cleared. */
  const greetingSeededRef = useRef(false)

  const selectedBoard = selectedBoardId ? getBoard(selectedBoardId) : undefined
  const selectedCard = selectedBoardId && selectedCardId ? getCard(selectedBoardId, selectedCardId) : undefined

  // Set initial values from URL params
  useEffect(() => {
    if (initialBoardId) setSelectedBoardId(initialBoardId)
    if (initialCardId) setSelectedCardId(initialCardId)
  }, [initialBoardId, initialCardId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Opening assistant message when user lands on this page (or after clear chat)
  useEffect(() => {
    if (messages.length === 0) {
      if (!greetingSeededRef.current) {
        greetingSeededRef.current = true
        addChatMessage('assistant', 'How can I help you with this task?')
        mutateMessages()
      }
    } else {
      greetingSeededRef.current = true
    }
  }, [messages.length, mutateMessages])

  const handleSend = async (message?: string) => {
    const text = (message ?? inputValue).trim()
    if (!text) return

    setInputValue('')
    addChatMessage('user', text)
    setIsTyping(true)
    mutateMessages()

    try {
      const res = await fetch(baseUrl+'/app/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promt:text }),
      })
      const data = await res.json()
      if (data.success && typeof data.plan === 'string') {
        addChatMessage('assistant', data.plan)
        console.log(data.plan)
      } else {
        addChatMessage(
          'assistant',
          typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.'
        )
      }
    } catch (error) {
      console.error(error)
      addChatMessage('assistant', 'Sorry, I encountered an error. Please try again.')
    } finally {
      setIsTyping(false)
      mutateMessages()
    }
  }

  const handleClearChat = () => {
    greetingSeededRef.current = false
    clearChatMessages()
    mutateMessages()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-background/95 backdrop-blur p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Get help with your tasks</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearChat}>
                Clear chat
              </Button>
            )}
          </div>

          {/* Context Selectors */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedBoardId} onValueChange={(value: string) => {
              setSelectedBoardId(value)
              setSelectedCardId('')
            }}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent>
                {boards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded"
                        style={{ backgroundColor: board.backgroundColor }}
                      />
                      {board.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedBoard && selectedBoard.columns.some(col => col.cards.length > 0) && (
              <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select a card (optional)" />
                </SelectTrigger>z
                <SelectContent>
                  <SelectItem value="">No specific card</SelectItem>
                  {selectedBoard.columns.map((column) =>
                    column.cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                {message.role === 'assistant' ? (
                  <AvatarFallback className="bg-primary/20">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-secondary">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={cn(
                  'rounded-2xl px-4 py-2.5 max-w-[80%]',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-secondary rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur p-4">
        <div className="max-w-3xl mx-auto">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleSend(action.prompt)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </Button>
              )
            })}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about your tasks..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1"
            />
            <Button onClick={() => handleSend()} disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AIPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <AIPageContent />
    </Suspense>
  )
}

export default AIPage
