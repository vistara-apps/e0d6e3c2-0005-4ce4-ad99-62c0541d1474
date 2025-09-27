import { z } from 'zod';
import {
  User,
  UserSession,
  BusinessIdea,
  MVP,
  ConversationMessage,
  IdeaFraming,
  MVPSuggestion,
  PainPoint,
  LaunchBlueprint,
  RiskAssessment,
  RevenueModel,
  PricingTier
} from '@/app/types';

// Validation schemas using Zod
export const UserSchema = z.object({
  userId: z.string().uuid(),
  farcasterId: z.string().optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  preferences: z.object({
    theme: z.enum(['default', 'celo', 'solana', 'base', 'coinbase']),
    notifications: z.boolean(),
    language: z.string(),
    currency: z.string()
  }),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const BusinessIdeaSchema = z.object({
  ideaId: z.string().uuid(),
  userId: z.string().uuid(),
  rawProblem: z.string().min(10),
  refinedProblem: z.string().min(10),
  userUrgency: z.enum(['low', 'medium', 'high', 'critical']),
  willingnessToPay: z.enum(['none', 'low', 'medium', 'high', 'premium']),
  valueProposition: z.string().min(20),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const MVPSchema = z.object({
  mvpId: z.string().uuid(),
  ideaId: z.string().uuid(),
  description: z.string().min(20),
  revenueModel: z.object({
    type: z.enum(['subscription', 'one_time', 'freemium', 'ads', 'commission', 'token_gated']),
    pricing: z.array(z.object({
      name: z.string(),
      price: z.number().min(0),
      currency: z.string(),
      features: z.array(z.string()),
      targetUsers: z.string()
    })),
    description: z.string()
  }),
  estimatedBuildTime: z.number().min(1).max(30),
  technicalRequirements: z.array(z.string()),
  riskLevel: z.enum(['low', 'medium', 'high']),
  createdAt: z.date()
});

export const ConversationMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  timestamp: z.date(),
  metadata: z.object({
    step: z.string().optional(),
    options: z.array(z.string()).optional(),
    selectedOption: z.string().optional(),
    aiResponse: z.any().optional()
  }).optional()
});

// Utility functions for creating instances
export function createUser(data: Partial<User>): User {
  const now = new Date();
  return {
    userId: data.userId || crypto.randomUUID(),
    farcasterId: data.farcasterId,
    walletAddress: data.walletAddress,
    preferences: data.preferences || {
      theme: 'default',
      notifications: true,
      language: 'en',
      currency: 'USD'
    },
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

export function createUserSession(userId: string): UserSession {
  const now = new Date();
  return {
    sessionId: crypto.randomUUID(),
    userId,
    currentStep: 'initial_greeting',
    conversationHistory: [],
    userPreferences: {
      theme: 'default',
      notifications: true,
      language: 'en',
      currency: 'USD'
    },
    createdAt: now,
    updatedAt: now
  };
}

export function createBusinessIdea(userId: string, rawProblem: string): BusinessIdea {
  const now = new Date();
  return {
    ideaId: crypto.randomUUID(),
    userId,
    rawProblem,
    refinedProblem: '',
    userUrgency: 'medium',
    willingnessToPay: 'medium',
    valueProposition: '',
    createdAt: now,
    updatedAt: now
  };
}

export function createMVP(ideaId: string, description: string): MVP {
  const now = new Date();
  return {
    mvpId: crypto.randomUUID(),
    ideaId,
    description,
    revenueModel: {
      type: 'subscription',
      pricing: [],
      description: ''
    },
    estimatedBuildTime: 7,
    technicalRequirements: [],
    riskLevel: 'medium',
    createdAt: now
  };
}

export function createConversationMessage(
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: any
): ConversationMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
    metadata
  };
}

// Validation functions
export function validateUser(data: any): User {
  return UserSchema.parse(data);
}

export function validateBusinessIdea(data: any): BusinessIdea {
  return BusinessIdeaSchema.parse(data);
}

export function validateMVP(data: any): MVP {
  return MVPSchema.parse(data);
}

export function validateConversationMessage(data: any): ConversationMessage {
  return ConversationMessageSchema.parse(data);
}

// Type guards
export function isValidUser(obj: any): obj is User {
  try {
    UserSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

export function isValidBusinessIdea(obj: any): obj is BusinessIdea {
  try {
    BusinessIdeaSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

export function isValidMVP(obj: any): obj is MVP {
  try {
    MVPSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

// Helper functions for business logic
export function calculatePriorityScore(painPoint: PainPoint): number {
  const frequencyScore = {
    'rare': 1,
    'occasional': 2,
    'frequent': 3,
    'constant': 4
  };

  const severityScore = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 4
  };

  const willingnessScore = {
    'none': 0,
    'low': 1,
    'medium': 2,
    'high': 3,
    'premium': 4
  };

  return (
    frequencyScore[painPoint.frequency] *
    severityScore[painPoint.severity] *
    willingnessScore[painPoint.willingnessToPay] /
    painPoint.estimatedEffort
  );
}

export function prioritizePainPoints(painPoints: PainPoint[]): PainPoint[] {
  return painPoints
    .filter(pp => pp.solvable)
    .sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));
}

export function generateRevenueModelSuggestions(idea: BusinessIdea): RevenueModel[] {
  const suggestions: RevenueModel[] = [];

  // Subscription model
  if (idea.willingnessToPay !== 'none') {
    suggestions.push({
      type: 'subscription',
      pricing: [
        {
          name: 'Basic',
          price: 9.99,
          currency: 'USD',
          features: ['Core features', 'Basic support'],
          targetUsers: 'Early stage founders'
        },
        {
          name: 'Pro',
          price: 29.99,
          currency: 'USD',
          features: ['All features', 'Priority support', 'Advanced analytics'],
          targetUsers: 'Growing businesses'
        }
      ],
      description: 'Monthly subscription for ongoing access to platform features'
    });
  }

  // Freemium model
  suggestions.push({
    type: 'freemium',
    pricing: [
      {
        name: 'Free',
        price: 0,
        currency: 'USD',
        features: ['Basic features', 'Limited usage'],
        targetUsers: 'All users'
      },
      {
        name: 'Premium',
        price: 19.99,
        currency: 'USD',
        features: ['Unlimited usage', 'Advanced features', 'Premium support'],
        targetUsers: 'Power users'
      }
    ],
    description: 'Free basic access with premium upgrades'
  });

  // One-time purchase
  suggestions.push({
    type: 'one_time',
    pricing: [
      {
        name: 'Lifetime',
        price: 99,
        currency: 'USD',
        features: ['All features', 'Lifetime access', 'All future updates'],
        targetUsers: 'Committed users'
      }
    ],
    description: 'One-time payment for lifetime access'
  });

  return suggestions;
}

