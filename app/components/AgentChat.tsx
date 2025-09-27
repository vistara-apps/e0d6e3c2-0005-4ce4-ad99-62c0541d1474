'use client'

import { useState, useRef, useEffect } from 'react'
import { Message, ActionableCard } from '../types'
import { OptionCard } from './OptionCard'
import { ActionableCard as ActionableCardComponent } from './ActionableCard'
import { Send, Bot, User } from 'lucide-react'

interface AgentChatProps {
  messages: Message[]
  onSendMessage: (content: string, selectedOption?: string) => void
  onCardAction?: (card: any) => void
  isLoading: boolean
}

export function AgentChat({ messages, onSendMessage, onCardAction, isLoading }: AgentChatProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleOptionSelect = (option: { label: string; value: string }) => {
    onSendMessage(option.label, option.value)
  }

  const handleCardAction = (card: ActionableCard) => {
    // Handle card actions (e.g., select MVP, etc.)
    if (onCardAction) {
      onCardAction(card)
    } else {
      onSendMessage(`Selected: ${card.title}`, card.id)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">SudoPath</h1>
            <p className="text-sm text-muted-foreground">Your AI Co-Founder</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-accent-foreground" />
              </div>
            )}

            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
              <div className={`rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : 'bg-card border border-border'
              }`}>
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('**') && line.endsWith('**') ? 'font-semibold' : ''}>
                      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  ))}
                </div>



                {/* Actionable Cards */}
                {message.actionableCards && message.actionableCards.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.actionableCards.map((card) => (
                      <ActionableCardComponent
                        key={card.id}
                        card={card}
                        onAction={handleCardAction}
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground mt-1 px-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground rounded-md transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
