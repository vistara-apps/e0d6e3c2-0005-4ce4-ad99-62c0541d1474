'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

interface AppShellProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
}

export function AppShell({
  children,
  className,
  header,
  sidebar,
  footer
}: AppShellProps) {
  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground",
      "flex flex-col",
      className
    )}>
      {/* Header */}
      {header && (
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          {header}
        </motion.header>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-64 border-r bg-card/50 backdrop-blur"
          >
            {sidebar}
          </motion.aside>
        )}

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-1 overflow-auto"
        >
          <div className="container mx-auto px-4 py-6 max-w-screen-xl">
            {children}
          </div>
        </motion.main>
      </div>

      {/* Footer */}
      {footer && (
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          {footer}
        </motion.footer>
      )}
    </div>
  );
}

// Header Component
interface AppHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AppHeader({ title, subtitle, actions }: AppHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
}

// Sidebar Navigation Component
interface SidebarNavProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

export function SidebarNav({ items, activeItem, onItemClick }: SidebarNavProps) {
  return (
    <nav className="p-4 space-y-2">
      {items.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onItemClick?.(item)}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
            activeItem === item.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent text-accent-foreground"
          )}
        >
          <div className="flex items-center space-x-3">
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span className="font-medium">{item.label}</span>
          </div>
          {item.badge && (
            <span className={cn(
              "px-2 py-1 text-xs rounded-full",
              activeItem === item.id
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {item.badge}
            </span>
          )}
        </motion.button>
      ))}
    </nav>
  );
}

// Footer Component
interface AppFooterProps {
  children: ReactNode;
}

export function AppFooter({ children }: AppFooterProps) {
  return (
    <div className="flex h-16 items-center justify-center px-6 border-t">
      {children}
    </div>
  );
}

