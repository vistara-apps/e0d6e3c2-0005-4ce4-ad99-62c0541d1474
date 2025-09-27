// Core data model types based on PRD specifications

export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'default' | 'celo' | 'solana' | 'base' | 'coinbase';
  notifications: boolean;
  language: string;
  currency: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  currentStep: ConversationStep;
  conversationHistory: ConversationMessage[];
  ideaFraming?: IdeaFraming;
  mvpSuggestions?: MVPSuggestion[];
  painPoints?: PainPoint[];
  launchBlueprint?: LaunchBlueprint;
  riskiestAssumption?: RiskAssessment;
  userPreferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessIdea {
  ideaId: string;
  userId: string;
  rawProblem: string;
  refinedProblem: string;
  userUrgency: UrgencyLevel;
  willingnessToPay: WillingnessToPay;
  valueProposition: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MVP {
  mvpId: string;
  ideaId: string;
  description: string;
  revenueModel: RevenueModel;
  estimatedBuildTime: number; // in days
  technicalRequirements: string[];
  riskLevel: RiskLevel;
  createdAt: Date;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  step?: ConversationStep;
  options?: string[];
  selectedOption?: string;
  aiResponse?: AIResponse;
}

export interface AIResponse {
  type: 'idea_framing' | 'mvp_suggestion' | 'pain_analysis' | 'launch_plan' | 'risk_assessment' | 'resource_hub';
  data: any;
  confidence: number;
}

// Conversation flow types
export type ConversationStep =
  | 'initial_greeting'
  | 'idea_input'
  | 'problem_refinement'
  | 'urgency_assessment'
  | 'willingness_assessment'
  | 'mvp_generation'
  | 'mvp_selection'
  | 'pain_point_analysis'
  | 'focus_prioritization'
  | 'launch_planning'
  | 'risk_assessment'
  | 'validation_testing'
  | 'resource_recommendation'
  | 'completion';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type WillingnessToPay = 'none' | 'low' | 'medium' | 'high' | 'premium';

export type RiskLevel = 'low' | 'medium' | 'high';

// Feature-specific types
export interface IdeaFraming {
  coreProblem: string;
  targetAudience: string;
  urgencyLevel: UrgencyLevel;
  willingnessToPay: WillingnessToPay;
  valueProposition: string;
  marketSize?: number;
  competition?: string[];
}

export interface MVPSuggestion {
  id: string;
  title: string;
  description: string;
  revenueModel: RevenueModel;
  buildTimeDays: number;
  technicalStack: string[];
  riskLevel: RiskLevel;
  successMetrics: string[];
  nextSteps: string[];
}

export interface RevenueModel {
  type: 'subscription' | 'one_time' | 'freemium' | 'ads' | 'commission' | 'token_gated';
  pricing: PricingTier[];
  description: string;
}

export interface PricingTier {
  name: string;
  price: number;
  currency: string;
  features: string[];
  targetUsers: string;
}

export interface PainPoint {
  id: string;
  category: string;
  description: string;
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
  severity: 'low' | 'medium' | 'high' | 'critical';
  willingnessToPay: WillingnessToPay;
  solvable: boolean;
  estimatedEffort: number; // in days
}

export interface LaunchBlueprint {
  userAcquisitionStrategy: string[];
  paymentIntegration: string;
  pmfSignals: string[];
  initialMarketingBudget: number;
  timeline: LaunchTimeline[];
  successMetrics: string[];
}

export interface LaunchTimeline {
  phase: string;
  duration: number; // in weeks
  milestones: string[];
  deliverables: string[];
}

export interface RiskAssessment {
  riskiestAssumption: string;
  validationMethod: string;
  timelineDays: number;
  successCriteria: string[];
  fallbackPlan: string;
}

// API and Integration types
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface WalletConfig {
  network: 'base' | 'ethereum' | 'polygon';
  rpcUrl: string;
  chainId: number;
}

export interface FarcasterConfig {
  hubUrl: string;
  apiKey?: string;
}

// UI Component types
export interface ChatMessageProps {
  message: ConversationMessage;
  isTyping?: boolean;
}

export interface OptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'highlighted' | 'selected';
}

export interface ActionableCardProps {
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'compact';
}

// Error and Response types
export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}

// Payment and Transaction types
export interface MicroTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  tokenAddress?: string;
  feature: string;
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
  createdAt: Date;
}

// Analytics and Tracking types
export interface UserAnalytics {
  userId: string;
  sessionCount: number;
  averageSessionDuration: number;
  featuresUsed: string[];
  conversionRate: number;
  lastActive: Date;
}

export interface FeatureUsage {
  feature: string;
  userId: string;
  timestamp: Date;
  duration?: number;
  success: boolean;
}

