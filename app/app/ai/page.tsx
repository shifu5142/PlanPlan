'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, Send, Sparkles, ListTodo, Target, ArrowRight, User } from 'lucide-react'
import { getChatMessages, addChatMessage, clearChatMessages } from '@/lib/store'
import { currentUser } from '@/lib/store'
import type { ChatMessage } from '@/lib/types'
import { cn } from '@/lib/utils'

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
  const { data: messages = [], mutate: mutateMessages } = useSWR('messages', messagesFetcher, {
    refreshInterval: 100,
  })
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? ''
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  /** Avoid duplicate greeting in React Strict Mode; reset when chat is cleared. */
  const greetingSeededRef = useRef(false)

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
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-card" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Intelligent task management</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearChat}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear chat
              </Button>
            )}
          </div>

        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-4',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className={cn(
                "h-10 w-10 shrink-0 ring-2 ring-offset-2 ring-offset-background",
                message.role === 'assistant' ? "ring-emerald-500/30" : "ring-border"
              )}>
                {message.role === 'assistant' ? (
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <Bot className="h-5 w-5 text-white" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={cn(
                  'rounded-2xl px-5 py-3.5 max-w-[75%] shadow-sm',
                  message.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-card border border-border/50'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0 ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <Bot className="h-5 w-5 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border/50 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <footer className="shrink-0 border-t border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-5">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-secondary/50 border-border/50 hover:bg-secondary hover:border-emerald-500/30 hover:text-emerald-500 transition-all duration-200"
                  onClick={() => handleSend(action.prompt)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </Button>
              )
            })}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask me anything about your tasks..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="h-12 bg-secondary/50 border-border/50 pl-5 pr-4 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
              />
            </div>
            <Button 
              onClick={() => handleSend()} 
              disabled={!inputValue.trim() || isTyping}
              size="lg"
              className="h-12 px-5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function AIPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center animate-pulse">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AIPageContent />
    </Suspense>
  )
}

export default AIPage

