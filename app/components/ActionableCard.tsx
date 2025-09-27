'use client'

import { ActionableCard as ActionableCardType } from '../types'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, DollarSign, Zap } from 'lucide-react'

interface ActionableCardProps {
  card: ActionableCardType
  onAction: (card: ActionableCardType) => void
  disabled?: boolean
}

export function ActionableCard({ card, onAction, disabled = false }: ActionableCardProps) {
  const getIcon = () => {
    switch (card.type) {
      case 'mvp':
        return <Zap className="w-5 h-5" />
      case 'pain-point':
        return <ArrowRight className="w-5 h-5" />
      case 'blueprint':
        return <Clock className="w-5 h-5" />
      case 'validation':
        return <DollarSign className="w-5 h-5" />
      default:
        return <ArrowRight className="w-5 h-5" />
    }
  }

  const getTypeColor = () => {
    switch (card.type) {
      case 'mvp':
        return 'text-blue-500'
      case 'pain-point':
        return 'text-red-500'
      case 'blueprint':
        return 'text-green-500'
      case 'validation':
        return 'text-yellow-500'
      default:
        return 'text-accent'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-lg bg-card p-4 hover:bg-card/80 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg bg-accent/10 ${getTypeColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{card.description}</p>

            {/* Additional data display */}
            {card.data && (
              <div className="space-y-1 text-xs text-muted-foreground">
                {card.data.revenueModel && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{card.data.revenueModel}</span>
                  </div>
                )}
                {card.data.buildTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{card.data.buildTime}</span>
                  </div>
                )}
                {card.data.features && card.data.features.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-foreground mb-1">Key Features:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {card.data.features.slice(0, 3).map((feature: string, index: number) => (
                        <li key={index} className="text-xs">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {card.actionLabel && (
          <button
            onClick={() => !disabled && onAction(card)}
            disabled={disabled}
            className="px-3 py-1.5 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground text-sm rounded-md transition-colors flex items-center gap-1 ml-4"
          >
            {card.actionLabel}
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

