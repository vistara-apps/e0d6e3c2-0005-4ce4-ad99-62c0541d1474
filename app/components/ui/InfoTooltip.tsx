'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface InfoTooltipProps {
  content: string;
  children?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'info' | 'warning' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InfoTooltip({
  content,
  children,
  position = 'top',
  variant = 'default',
  size = 'md',
  className
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const variants = {
    default: {
      icon: HelpCircle,
      bgColor: 'bg-popover',
      textColor: 'text-popover-foreground',
      borderColor: 'border-border'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900',
      borderColor: 'border-blue-200'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-900',
      borderColor: 'border-yellow-200'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-900',
      borderColor: 'border-green-200'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-900',
      borderColor: 'border-red-200'
    }
  };

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowPositions = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-l-transparent'
  };

  const Icon = variants[variant].icon;

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={cn(
          "inline-flex items-center justify-center rounded-full",
          "text-muted-foreground hover:text-foreground",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        )}
        aria-label="Show information"
      >
        {children || <Icon className={sizes[size]} />}
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-3 py-2 rounded-lg shadow-lg border max-w-xs text-sm font-medium",
              variants[variant].bgColor,
              variants[variant].textColor,
              variants[variant].borderColor,
              positions[position]
            )}
          >
            {content}

            {/* Arrow */}
            <div
              className={cn(
                "absolute w-0 h-0 border-4",
                variants[variant].borderColor,
                arrowPositions[position]
              )}
              style={{
                borderColor: variant === 'default'
                  ? 'var(--border)'
                  : variant === 'info'
                  ? '#bfdbfe'
                  : variant === 'warning'
                  ? '#fef3c7'
                  : variant === 'success'
                  ? '#dcfce7'
                  : '#fecaca'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Specialized tooltip components
interface FieldTooltipProps extends Omit<InfoTooltipProps, 'variant'> {
  fieldName: string;
  helpText: string;
}

export function FieldTooltip({ fieldName, helpText, ...props }: FieldTooltipProps) {
  return (
    <InfoTooltip
      {...props}
      content={`${fieldName}: ${helpText}`}
      variant="info"
    />
  );
}

interface ValidationTooltipProps extends Omit<InfoTooltipProps, 'variant'> {
  errors: string[];
  showIcon?: boolean;
}

export function ValidationTooltip({ errors, showIcon = true, ...props }: ValidationTooltipProps) {
  const content = errors.join('\n• ');

  return (
    <InfoTooltip
      {...props}
      content={`Validation Errors:\n• ${content}`}
      variant="error"
    >
      {showIcon && <AlertCircle className="w-4 h-4 text-destructive" />}
    </InfoTooltip>
  );
}

interface ProgressTooltipProps extends Omit<InfoTooltipProps, 'variant'> {
  progress: {
    current: number;
    total: number;
    label?: string;
  };
}

export function ProgressTooltip({ progress, ...props }: ProgressTooltipProps) {
  const percentage = Math.round((progress.current / progress.total) * 100);
  const content = `${progress.label || 'Progress'}: ${progress.current}/${progress.total} (${percentage}%)`;

  return (
    <InfoTooltip
      {...props}
      content={content}
      variant={percentage === 100 ? 'success' : percentage > 50 ? 'info' : 'warning'}
    >
      <div className="relative">
        <div className="w-6 h-6 rounded-full border-2 border-muted flex items-center justify-center">
          <div
            className="w-4 h-4 rounded-full border-2 border-primary"
            style={{
              background: `conic-gradient(from 0deg, hsl(var(--primary)) ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">{percentage}%</span>
        </div>
      </div>
    </InfoTooltip>
  );
}

// Inline tooltip for text explanations
interface InlineTooltipProps {
  term: string;
  explanation: string;
  variant?: 'default' | 'info' | 'warning' | 'success' | 'error';
}

export function InlineTooltip({ term, explanation, variant = 'info' }: InlineTooltipProps) {
  return (
    <span className="inline-flex items-center space-x-1">
      <span className="font-medium">{term}</span>
      <InfoTooltip
        content={explanation}
        variant={variant}
        size="sm"
        position="top"
      />
    </span>
  );
}

// Tooltip with keyboard shortcut
interface ShortcutTooltipProps extends Omit<InfoTooltipProps, 'content'> {
  action: string;
  shortcut: string;
}

export function ShortcutTooltip({ action, shortcut, ...props }: ShortcutTooltipProps) {
  return (
    <InfoTooltip
      {...props}
      content={`${action} (${shortcut})`}
      variant="info"
    />
  );
}

