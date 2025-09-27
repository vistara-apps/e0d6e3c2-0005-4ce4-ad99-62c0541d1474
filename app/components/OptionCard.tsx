'use client'

import { motion } from 'framer-motion'

interface OptionCardProps {
  title: string
  description: string
  onClick: () => void
  disabled?: boolean
}

export function OptionCard({ title, description, onClick, disabled = false }: OptionCardProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      className={`
        w-full p-4 text-left border border-border rounded-lg bg-card hover:bg-card/80
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:bg-card group
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2 group-hover:bg-accent/80 transition-colors"></div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </motion.button>
  )
}
