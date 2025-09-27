// User and Session Types
export interface User {
  userId: string
  farcasterId?: string
  walletAddress?: string
  preferences: Record<string, any>
}

export interface UserSession {
  sessionId: string
  userId: string
  currentStep: ConversationStep
  conversationHistory: Message[]
  ideaFraming?: IdeaFraming
  mvpSuggestions?: MVPSuggestion[]
  painPoints?: PainPoint[]
  launchBlueprint?: LaunchBlueprint
  riskiestAssumption?: string
  userPreferences: Record<string, any>
}

// Business Logic Types
export interface BusinessIdea {
  ideaId: string
  userId: string
  rawProblem: string
  refinedProblem: string
  userUrgency: number // 1-10 scale
  willingnessToPay: number // 1-10 scale
  valueProposition: string
}

export interface MVP {
  mvpId: string
  ideaId: string
  description: string
  revenueModel: string
  estimatedBuildTime: string
  features: string[]
}

// Conversation Types
export type ConversationStep =
  | 'welcome'
  | 'idea-framing'
  | 'mvp-suggestions'
  | 'pain-analysis'
  | 'focus-selection'
  | 'launch-planning'
  | 'validation-testing'
  | 'resource-hub'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actionableCards?: ActionableCard[]
}

export interface ActionableCard {
  id: string
  title: string
  description: string
  actionLabel: string
  type: 'mvp' | 'pain-point' | 'resource' | 'validation' | 'blueprint'
  data?: Record<string, any>
}

// Analysis Types
export interface IdeaFraming {
  coreProblem: string
  targetAudience: string
  urgencyLevel: number
  willingnessToPay: number
  valueProposition: string
}

export interface MVPSuggestion {
  id: string
  title: string
  description: string
  revenueModel: string
  buildTime: string
  features: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface PainPoint {
  id: string
  category: string
  description: string
  frequency: number // 1-10 scale
  willingnessToPay: number // 1-10 scale
  solvable: boolean
  priority: 'high' | 'medium' | 'low'
}

export interface LaunchBlueprint {
  userAcquisitionStrategy: string
  paymentIntegration: string
  pmfSignals: string[]
  timeline: string
  budget: string
}

// Theme Types
export type Theme = 'default' | 'celo' | 'solana' | 'base' | 'coinbase'

export interface ThemeConfig {
  name: string
  colors: {
    bg: string
    accent: string
    primary: string
    surface: string
    textPrimary: string
    textSecondary: string
  }
}

// API Types
export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfp?: {
    url: string
  }
}

// Component Props Types
export interface OptionCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

export interface AgentChatProps {
  messages: Message[]
  onSendMessage: (content: string, selectedOption?: string) => void
  onCardAction?: (card: ActionableCard) => void
  isLoading: boolean
}

export interface AppShellProps {
  children: React.ReactNode
  title?: string
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
