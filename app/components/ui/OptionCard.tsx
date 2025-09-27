'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface OptionCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'highlighted' | 'selected' | 'clickable';
  disabled?: boolean;
  badge?: string;
  className?: string;
}

export function OptionCard({
  title,
  description,
  icon,
  onClick,
  variant = 'default',
  disabled = false,
  badge,
  className
}: OptionCardProps) {
  const variants = {
    default: "bg-card border-border hover:bg-accent/50",
    highlighted: "bg-accent border-accent-foreground/20 ring-2 ring-accent-foreground/10",
    selected: "bg-primary border-primary ring-2 ring-primary/20",
    clickable: "bg-card border-border hover:bg-accent cursor-pointer transition-colors"
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        "relative p-6 rounded-lg border shadow-sm transition-all duration-200",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            {badge}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex items-start space-x-4">
        {/* Icon */}
        {icon && (
          <div className={cn(
            "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
            variant === 'selected'
              ? "bg-primary-foreground/10"
              : "bg-muted"
          )}>
            <span className="text-2xl">{icon}</span>
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-lg font-semibold mb-2",
            variant === 'selected'
              ? "text-primary-foreground"
              : "text-foreground"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-sm leading-relaxed",
            variant === 'selected'
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          )}>
            {description}
          </p>
        </div>

        {/* Action Indicator */}
        {variant === 'clickable' && (
          <div className="flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>
        )}

        {variant === 'selected' && (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-primary-foreground rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      {!disabled && variant !== 'selected' && (
        <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-5 bg-primary transition-opacity duration-200" />
      )}
    </motion.div>
  );
}

// Specialized Option Cards for different use cases
interface MVPSelectionCardProps extends Omit<OptionCardProps, 'onClick'> {
  mvp: {
    title: string;
    description: string;
    buildTime: string;
    revenueModel: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
  onSelect: () => void;
  isSelected?: boolean;
}

export function MVPSelectionCard({ mvp, onSelect, isSelected, className, ...props }: MVPSelectionCardProps) {
  const riskColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <OptionCard
      {...props}
      title={mvp.title}
      description={mvp.description}
      onClick={onSelect}
      variant={isSelected ? 'selected' : 'clickable'}
      badge={`${mvp.buildTime} days`}
      className={cn("relative", className)}
    >
      {/* Revenue Model Badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          {mvp.revenueModel}
        </span>
      </div>

      {/* Risk Level Indicator */}
      <div className="mt-4">
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
          riskColors[mvp.riskLevel]
        )}>
          {mvp.riskLevel.toUpperCase()} RISK
        </span>
      </div>
    </OptionCard>
  );
}

interface FeatureCardProps extends Omit<OptionCardProps, 'onClick'> {
  feature: {
    name: string;
    description: string;
    benefits: string[];
    pricing?: string;
  };
  onSelect: () => void;
  isLocked?: boolean;
}

export function FeatureCard({ feature, onSelect, isLocked, className, ...props }: FeatureCardProps) {
  return (
    <OptionCard
      {...props}
      title={feature.name}
      description={feature.description}
      onClick={onSelect}
      variant={isLocked ? 'default' : 'clickable'}
      disabled={isLocked}
      badge={feature.pricing}
      className={cn("relative", className)}
    >
      {/* Benefits List */}
      <div className="mt-4 space-y-2">
        {feature.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{benefit}</span>
          </div>
        ))}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🔒</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Premium Feature</p>
          </div>
        </div>
      )}
    </OptionCard>
  );
}

