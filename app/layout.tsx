import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { WalletConnect } from './components/WalletConnect'

export const metadata: Metadata = {
  title: 'SudoPath - AI Co-founder for Solo Founders',
  description: 'Your AI co-founder for launching fast, revenue-generating Base MiniApps. Get from idea to MVP in days, not months.',
  keywords: 'AI co-founder, solo founder, MVP, Base MiniApp, startup, app development',
  authors: [{ name: 'SudoPath' }],
  openGraph: {
    title: 'SudoPath - AI Co-founder for Solo Founders',
    description: 'Launch your app idea with AI-powered guidance. From concept to revenue in record time.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="base">
          <div className="min-h-screen bg-background">
            {/* Global Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">SP</span>
                      </div>
                      <h1 className="text-xl font-bold">SudoPath</h1>
                    </div>
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      AI Co-founder
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <WalletConnect variant="inline" />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main>
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
