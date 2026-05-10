'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div className="relative flex flex-col overflow-hidden h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      {/* Ambient background (decorative only) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary/[0.12] blur-3xl dark:bg-primary/20" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-chart-4/10 blur-3xl dark:bg-chart-4/15" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-t from-muted/50 to-transparent dark:from-primary/[0.04]" />
      </div>

      {/* Header */}
      <header className="shrink-0 border-b border-border/80 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
        <div className="relative mx-auto max-w-3xl px-4 py-5">
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
            aria-hidden
          />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner ring-1 ring-primary/15 dark:from-primary/25 dark:to-primary/5 dark:ring-primary/25">
                <Bot className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-background bg-primary/90 text-primary-foreground shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" aria-hidden />
                </span>
              </div>
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-semibold text-lg tracking-tight text-foreground">
                    AI Assistant
                  </h1>
                  <span className="rounded-full border border-border/80 bg-muted/60 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                    Workspace
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Grounded in your boards — ask for plans, priorities, and next steps.
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={handleClearChat}
              >
                Clear chat
              </Button>
            )}
          </div>

          {/* Context Selectors */}
          <div className="mt-5 rounded-xl border border-border/70 bg-muted/25 p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Context
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="w-full min-w-0 flex-1 space-y-2 sm:max-w-xs">
                <Label htmlFor="ai-board" className="text-xs text-muted-foreground">
                  Board
                </Label>
                <Select
                  value={selectedBoardId}
                  onValueChange={(value: string) => {
                    setSelectedBoardId(value)
                    setSelectedCardId('')
                  }}
                >
                  <SelectTrigger
                    id="ai-board"
                    className="h-10 w-full bg-background/80 shadow-sm dark:bg-background/50"
                  >
                    <SelectValue placeholder="Select a board" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded shadow-sm ring-1 ring-black/5"
                            style={{ backgroundColor: board.backgroundColor }}
                          />
                          {board.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBoard && selectedBoard.columns.some((col) => col.cards.length > 0) && (
                <div className="w-full min-w-0 flex-1 space-y-2 sm:max-w-xs">
                  <Label htmlFor="ai-card" className="text-xs text-muted-foreground">
                    Card (optional)
                  </Label>
                  <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                    <SelectTrigger
                      id="ai-card"
                      className="h-10 w-full bg-background/80 shadow-sm dark:bg-background/50"
                    >
                      <SelectValue placeholder="Select a card (optional)" />
                    </SelectTrigger>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="relative flex-1 min-h-0">
        <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar
                className={cn(
                  'h-9 w-9 shrink-0 ring-2 ring-background',
                  message.role === 'assistant' ? 'shadow-sm' : ''
                )}
              >
                {message.role === 'assistant' ? (
                  <AvatarFallback className="bg-gradient-to-br from-primary/25 to-primary/10 text-primary">
                    <Bot className="h-4 w-4" strokeWidth={2} />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-secondary font-medium text-secondary-foreground text-xs">
                    {currentUser.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={cn(
                  'max-w-[min(80%,28rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground shadow-[0_8px_32px_-12px_rgb(59_130_246/0.55)]'
                    : 'border border-border/80 bg-card/90 text-card-foreground shadow-[0_2px_0_0_rgb(255_255_255/0.04)_inset,0_12px_40px_-28px_rgb(15_23_42/0.35)] backdrop-blur-md dark:border-white/10 dark:bg-card/70 dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06),0_16px_48px_-32px_rgb(0_0_0/0.65)]'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex animate-in fade-in-0 gap-3 duration-200">
              <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-primary/25 to-primary/10 text-primary">
                  <Bot className="h-4 w-4" strokeWidth={2} />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 shadow-inner backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full bg-primary/60 motion-safe:animate-bounce dark:bg-primary/70"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-primary/60 motion-safe:animate-bounce dark:bg-primary/70"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-primary/60 motion-safe:animate-bounce dark:bg-primary/70"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <footer className="shrink-0 border-t border-border/80 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
        <div className="mx-auto max-w-3xl px-4 py-4">
          {/* Quick Actions */}
          <div className="mb-3 flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 border-border/80 bg-background/50 text-muted-foreground shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.06] hover:text-foreground motion-reduce:hover:translate-y-0 dark:bg-white/[0.03] dark:hover:bg-primary/10"
                  onClick={() => handleSend(action.prompt)}
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {action.label}
                </Button>
              )
            })}
          </div>

          {/* Input */}
          <div className="flex gap-2 rounded-2xl border border-border/80 bg-muted/30 p-1.5 pl-2 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
            <Input
              placeholder="Ask me anything about your tasks..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
            />
            <Button
              size="icon-lg"
              className="shrink-0 rounded-xl shadow-md transition-[transform,box-shadow] duration-200 ease-out hover:shadow-lg active:scale-[0.98]"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function AIPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 overflow-hidden bg-background">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/80 ring-1 ring-border shadow-inner">
            <Bot className="h-6 w-6 animate-pulse text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div className="h-2 w-36 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary/40" />
          </div>
          <p className="text-muted-foreground text-sm">Loading assistant…</p>
        </div>
      }
    >
      <AIPageContent />
    </Suspense>
  )
}

export default AIPage
