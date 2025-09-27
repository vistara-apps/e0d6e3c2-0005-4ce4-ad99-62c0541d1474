'use client'

import { ReactNode } from 'react'
import { useTheme } from './ThemeProvider'
import { Button } from './ui/Button'
import { Sun, Moon, Settings } from 'lucide-react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">SP</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">SudoPath</h1>
              </div>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                AI-Powered MVP Development
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'base' ? 'default' : 'base')}
                className="w-9 h-9 p-0"
              >
                {theme === 'base' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Powered by AI & Base</span>
              <span>•</span>
              <span>Built for solo founders</span>
            </div>
            <div className="flex items-center gap-4">
              <span>v0.1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
