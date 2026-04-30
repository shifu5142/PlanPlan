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
import { Bot, Send, Sparkles, ListTodo, Target, Lightbulb, ArrowRight } from 'lucide-react'
import { getBoards, getBoard, getCard, getChatMessages, addChatMessage, clearChatMessages } from '@/lib/store'
import { currentUser } from '@/lib/store'
import type { Board, Card, ChatMessage } from '@/lib/types'
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

  const [selectedBoardId, setSelectedBoardId] = useState<string>(initialBoardId || '')
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId || '')
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  // Generate context-aware greeting when context changes
  useEffect(() => {
    if ((selectedBoard || selectedCard) && messages.length === 0) {
      let greeting = "Hello! I'm your AI assistant. "
      if (selectedCard) {
        greeting += `I see you're working on "${selectedCard.title}". How can I help you with this task?`
      } else if (selectedBoard) {
        greeting += `I see you're working on the "${selectedBoard.title}" board. How can I help you manage your tasks?`
      }
      addChatMessage('assistant', greeting)
      mutateMessages()
    }
  }, [selectedBoardId, selectedCardId, selectedBoard, selectedCard, messages.length, mutateMessages])

  const handleSend = async (message?: string) => {
    const text = message || inputValue
    try {
   const response = await fetch('/api/ai', {
    method: 'POST',
    body: JSON.stringify({ text }),
   })
   const data = await response.json()
   if (data.success) {
    addChatMessage('assistant', data.plan)
    setIsTyping(false)
   } 
    } catch (error) {
      console.error(error)
      addChatMessage('assistant', 'Sorry, I encountered an error. Please try again.')
      setIsTyping(false)
    }

    // Add user message
    addChatMessage('user', text)
    setInputValue('')
    mutateMessages()

    // Simulate AI thinking
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Generate AI response based on context
    let response = generateAIResponse(text, selectedBoard, selectedCard)
    addChatMessage('assistant', response)
    setIsTyping(false)
    mutateMessages()
  }

  const handleClearChat = () => {
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
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {messages.length === 0 && !selectedBoard && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-lg font-medium mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Select a board above to get context-aware assistance, or ask me anything about task management.
              </p>
            </div>
          )}

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

export default function AIPage() {
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

// Helper function to generate contextual AI responses
function generateAIResponse(userMessage: string, board?: Board, card?: Card): string {
  const lowerMessage = userMessage.toLowerCase()

  if (card) {
    if (lowerMessage.includes('break down') || lowerMessage.includes('subtask')) {
      return `Great idea to break down "${card.title}"! Here are some suggested subtasks:\n\n1. Research and gather requirements\n2. Create initial design/plan\n3. Implement core functionality\n4. Test and validate\n5. Document and review\n\nWould you like me to help you add any of these as separate cards?`
    }
    if (lowerMessage.includes('priority') || lowerMessage.includes('urgent')) {
      const hasDueDate = card.dueDate ? `This task has a due date of ${new Date(card.dueDate).toLocaleDateString()}.` : 'This task has no due date set.'
      return `Let me analyze "${card.title}":\n\n${hasDueDate}\n\nBased on the task details, I'd recommend:\n- Setting clear milestones\n- Breaking it into smaller chunks if needed\n- Assigning to team members with relevant skills\n\nWould you like me to suggest a specific timeline?`
    }
  }

  if (board) {
    const totalCards = board.columns.reduce((sum, col) => sum + col.cards.length, 0)
    const doneColumn = board.columns.find(col => col.title.toLowerCase().includes('done'))
    const doneCards = doneColumn?.cards.length || 0

    if (lowerMessage.includes('prioritize') || lowerMessage.includes('priority')) {
      return `Looking at your "${board.title}" board with ${totalCards} tasks:\n\n**Recommended Priority Order:**\n\n1. Tasks with upcoming due dates\n2. Tasks marked as "High Priority"\n3. Tasks blocking other work\n4. Quick wins (small tasks that can be completed fast)\n\nWould you like me to analyze specific tasks?`
    }

    if (lowerMessage.includes('work plan') || lowerMessage.includes('schedule')) {
      return `Here's a suggested work plan for "${board.title}":\n\n**This Week:**\n- Focus on completing in-progress items\n- Review any blocked tasks\n\n**Next Week:**\n- Move top priority items from backlog\n- Schedule team sync for planning\n\n**Progress:** ${doneCards}/${totalCards} tasks completed\n\nWant me to create a more detailed schedule?`
    }

    if (lowerMessage.includes('next') || lowerMessage.includes('what should')) {
      const inProgressCol = board.columns.find(col => 
        col.title.toLowerCase().includes('progress') || col.title.toLowerCase().includes('doing')
      )
      const todoCol = board.columns.find(col => 
        col.title.toLowerCase().includes('to do') || col.title.toLowerCase().includes('backlog')
      )
      
      if (inProgressCol && inProgressCol.cards.length > 0) {
        return `You currently have ${inProgressCol.cards.length} task(s) in progress. I'd recommend focusing on completing "${inProgressCol.cards[0].title}" before starting new work.\n\nWould you like tips on how to complete it faster?`
      } else if (todoCol && todoCol.cards.length > 0) {
        return `Your in-progress column is clear! I'd suggest starting with "${todoCol.cards[0].title}" from your To Do list.\n\nWant me to help you break this task down?`
      }
    }
  }

  // Generic responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm here to help you manage your tasks more effectively. You can ask me to:\n\n- Break down tasks into subtasks\n- Prioritize your work\n- Create work plans\n- Suggest what to work on next\n\nWhat would you like help with?"
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
    return "I can help you with:\n\n**Task Management**\n- Breaking down complex tasks\n- Setting priorities\n- Creating work schedules\n\n**Planning**\n- Sprint planning\n- Resource allocation suggestions\n- Timeline recommendations\n\n**Productivity**\n- Focus recommendations\n- Workload balancing\n- Progress tracking\n\nSelect a board above for context-aware assistance!"
  }

  return "I understand you're looking for help with your tasks. Could you provide more details about what you'd like to accomplish? You can also try one of the quick action buttons above for common task management needs."
}
