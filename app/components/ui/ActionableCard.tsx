'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ActionableCardProps {
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
  };
  variant?: 'default' | 'compact' | 'featured';
  icon?: ReactNode;
  metadata?: {
    type: 'time' | 'cost' | 'priority' | 'risk';
    value: string | number;
    label?: string;
  }[];
  className?: string;
}

export function ActionableCard({
  title,
  description,
  action,
  variant = 'default',
  icon,
  metadata,
  className
}: ActionableCardProps) {
  const variants = {
    default: "bg-card border-border",
    compact: "bg-card border-border p-4",
    featured: "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 ring-1 ring-primary/10"
  };

  const buttonVariants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background hover:bg-accent text-accent-foreground"
  };

  const metadataIcons = {
    time: Clock,
    cost: DollarSign,
    priority: Target,
    risk: AlertTriangle
  };

  const metadataColors = {
    time: 'text-blue-600',
    cost: 'text-green-600',
    priority: 'text-purple-600',
    risk: 'text-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-lg border shadow-sm overflow-hidden",
        variants[variant],
        className
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {icon && (
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">{icon}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {metadata && metadata.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {metadata.map((item, index) => {
              const Icon = metadataIcons[item.type];
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-1 text-xs",
                    metadataColors[item.type]
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span className="font-medium">{item.value}</span>
                  {item.label && <span className="text-muted-foreground">{item.label}</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <motion.button
          whileHover={!action.disabled ? { scale: 1.02 } : {}}
          whileTap={!action.disabled ? { scale: 0.98 } : {}}
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            "w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200",
            buttonVariants[action.variant || 'primary'],
            action.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span>{action.label}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// Specialized Actionable Cards for different contexts
interface NextStepCardProps extends Omit<ActionableCardProps, 'action'> {
  step: {
    title: string;
    description: string;
    estimatedTime: string;
    priority: 'low' | 'medium' | 'high';
  };
  onStart: () => void;
  isCompleted?: boolean;
}

export function NextStepCard({ step, onStart, isCompleted, className, ...props }: NextStepCardProps) {
  const priorityColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <ActionableCard
      {...props}
      title={step.title}
      description={step.description}
      action={{
        label: isCompleted ? 'Completed' : 'Start Now',
        onClick: onStart,
        variant: isCompleted ? 'secondary' : 'primary',
        disabled: isCompleted
      }}
      metadata={[
        { type: 'time', value: step.estimatedTime, label: 'estimated' },
        { type: 'priority', value: step.priority.toUpperCase() }
      ]}
      className={cn(
        isCompleted && "opacity-75",
        className
      )}
    >
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        </div>
      )}
    </ActionableCard>
  );
}

interface ValidationTestCardProps extends Omit<ActionableCardProps, 'action'> {
  test: {
    title: string;
    description: string;
    method: string;
    timeline: string;
    successCriteria: string[];
  };
  onRunTest: () => void;
  isRunning?: boolean;
}

export function ValidationTestCard({ test, onRunTest, isRunning, className, ...props }: ValidationTestCardProps) {
  return (
    <ActionableCard
      {...props}
      title={test.title}
      description={test.description}
      action={{
        label: isRunning ? 'Running Test...' : 'Run Validation Test',
        onClick: onRunTest,
        variant: 'primary',
        disabled: isRunning
      }}
      metadata={[
        { type: 'time', value: test.timeline },
        { type: 'risk', value: 'Low Risk' }
      ]}
      className={className}
    >
      {/* Success Criteria */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Success Criteria:</h4>
        <ul className="space-y-1">
          {test.successCriteria.map((criteria, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
              <span className="text-green-500 mt-1">•</span>
              <span>{criteria}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Method Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          {test.method}
        </span>
      </div>
    </ActionableCard>
  );
}

interface ResourceCardProps extends Omit<ActionableCardProps, 'action'> {
  resource: {
    title: string;
    description: string;
    type: 'template' | 'tutorial' | 'tool' | 'expert';
    tags: string[];
    isPremium?: boolean;
  };
  onAccess: () => void;
  isLocked?: boolean;
}

export function ResourceCard({ resource, onAccess, isLocked, className, ...props }: ResourceCardProps) {
  const typeColors = {
    template: 'bg-blue-50 text-blue-700 border-blue-200',
    tutorial: 'bg-green-50 text-green-700 border-green-200',
    tool: 'bg-purple-50 text-purple-700 border-purple-200',
    expert: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <ActionableCard
      {...props}
      title={resource.title}
      description={resource.description}
      action={{
        label: isLocked ? 'Unlock Premium' : 'Access Resource',
        onClick: onAccess,
        variant: isLocked ? 'outline' : 'primary'
      }}
      metadata={[
        { type: 'cost', value: resource.isPremium ? 'Premium' : 'Free' }
      ]}
      className={cn(
        "relative",
        isLocked && "opacity-75",
        className
      )}
    >
      {/* Type Badge */}
      <div className="mb-3">
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
          typeColors[resource.type]
        )}>
          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {resource.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🔒</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Premium Resource</p>
          </div>
        </div>
      )}
    </ActionableCard>
  );
}

