'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { ConversationMessage } from '@/app/types';

interface AgentChatProps {
  messages: ConversationMessage[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  placeholder?: string;
  className?: string;
}

export function AgentChat({
  messages,
  onSendMessage,
  isTyping = false,
  placeholder = "Type your message...",
  className
}: AgentChatProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-card rounded-lg border shadow-sm",
      className
    )}>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-3"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isTyping}
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-lg border bg-background",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "placeholder:text-muted-foreground"
              )}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={cn(
              "px-4 py-3 bg-primary text-primary-foreground rounded-lg",
              "hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              "flex items-center justify-center"
            )}
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

// Individual Chat Message Component
interface ChatMessageProps {
  message: ConversationMessage;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start space-x-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar */}
      {!isUser && !isSystem && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div className={cn(
        "max-w-xs lg:max-w-md xl:max-w-lg",
        isUser ? "order-first" : "order-last"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground ml-auto"
            : isSystem
            ? "bg-muted text-muted-foreground text-center text-sm"
            : "bg-muted text-muted-foreground"
        )}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* Timestamp */}
        <div className={cn(
          "text-xs text-muted-foreground mt-1",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Message Options Component (for when AI provides choices)
interface MessageOptionsProps {
  options: string[];
  onSelectOption: (option: string) => void;
  selectedOption?: string;
}

export function MessageOptions({ options, onSelectOption, selectedOption }: MessageOptionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid gap-2 mt-3"
    >
      {options.map((option, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectOption(option)}
          className={cn(
            "p-3 rounded-lg border text-left transition-colors",
            selectedOption === option
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card hover:bg-accent text-card-foreground border-border"
          )}
        >
          <span className="text-sm font-medium">{option}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

