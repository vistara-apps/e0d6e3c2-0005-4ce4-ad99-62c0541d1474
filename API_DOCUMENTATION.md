# SudoPath API Documentation

## Overview

SudoPath is a comprehensive AI-powered conversational assistant for solo founders building Base MiniApps. This document outlines all API integrations, endpoints, and usage patterns.

## Core Architecture

### Frontend (Next.js + TypeScript)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks + Context API
- **Animation**: Framer Motion

### AI Integration (OpenAI)
- **Provider**: OpenAI GPT-4 Turbo
- **Purpose**: Conversational AI for idea generation, requirement elicitation, and strategic planning
- **Rate Limiting**: Implemented on client-side with exponential backoff

### Wallet Integration (Base Network)
- **Provider**: Coinbase Wallet SDK
- **Network**: Base (Chain ID: 8453)
- **RPC URL**: https://mainnet.base.org
- **Purpose**: Micro-transactions, token payments, wallet connectivity

### Social Integration (Farcaster)
- **Provider**: Farcaster Hub API
- **Purpose**: User identity, social context, on-chain interactions
- **Endpoint**: https://hub.snapshot.org/graphql

## API Endpoints & Integrations

### 1. OpenAI API

**Purpose**: Powers the core conversational AI functionality

**Configuration**:
```typescript
const OPENAI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 2000,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1
};
```

**Endpoints Used**:
- `POST https://api.openai.com/v1/chat/completions`

**Request Format**:
```json
{
  "model": "gpt-4-turbo-preview",
  "messages": [
    {
      "role": "system",
      "content": "You are SudoPath, an AI co-founder..."
    },
    {
      "role": "user",
      "content": "I want to build a task management app"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response Format**:
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4-turbo-preview",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Great idea! Let's break this down..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 56,
    "completion_tokens": 123,
    "total_tokens": 179
  }
}
```

**Error Handling**:
- Rate limit exceeded: Exponential backoff retry
- Invalid API key: Graceful fallback to basic responses
- Network errors: User-friendly error messages

### 2. Base Network RPC

**Purpose**: Blockchain interactions, wallet connectivity, micro-transactions

**Configuration**:
```typescript
const BASE_CONFIG = {
  chain: base,
  rpcUrl: 'https://mainnet.base.org',
  chainId: 8453,
  blockExplorer: 'https://basescan.org'
};
```

**Supported Operations**:
- Wallet connection via Coinbase Wallet SDK
- Balance checking
- Transaction sending
- Gas estimation
- Network switching

**Transaction Format**:
```typescript
const transaction = {
  to: '0x...',
  value: BigInt(amount),
  data: '0x...',
  gasLimit: BigInt(gasEstimate)
};
```

### 3. Farcaster Hub API

**Purpose**: Social graph integration, user identity verification

**Configuration**:
```typescript
const FARCASTER_CONFIG = {
  hubUrl: 'https://hub.snapshot.org/graphql',
  apiKey?: string // Optional for authenticated requests
};
```

**Common Queries**:
```graphql
# Get user profile
query GetUser($fid: Int!) {
  user(fid: $fid) {
    fid
    username
    displayName
    pfp
  }
}

# Get casts (posts)
query GetCasts($fid: Int!) {
  casts(fid: $fid, limit: 10) {
    id
    text
    timestamp
  }
}
```

## Data Models

### User Session Flow

1. **Initial Greeting** → User expresses intent
2. **Idea Input** → AI generates idea framing
3. **Problem Refinement** → User confirms understanding
4. **Urgency Assessment** → Determine problem priority
5. **Willingness Assessment** → Gauge payment willingness
6. **MVP Generation** → AI suggests 3 MVPs
7. **MVP Selection** → User chooses preferred approach
8. **Pain Point Analysis** → MECE breakdown using 80/20 rule
9. **Focus Prioritization** → Identify highest-impact areas
10. **Launch Planning** → Create actionable blueprint
11. **Risk Assessment** → Identify and validate riskiest assumption
12. **Validation Testing** → 24-hour validation test
13. **Resource Recommendation** → Contextual help and templates

### Key Data Structures

```typescript
interface UserSession {
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
}

interface IdeaFraming {
  coreProblem: string;
  targetAudience: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  willingnessToPay: 'none' | 'low' | 'medium' | 'high' | 'premium';
  valueProposition: string;
  marketSize?: number;
  competition?: string[];
}
```

## Business Logic APIs

### AI Service Methods

```typescript
class AIService {
  // Idea validation and refinement
  generateIdeaFraming(userInput: string, history: ConversationMessage[]): Promise<IdeaFraming>

  // MVP ideation
  generateMVPSuggestions(ideaFraming: IdeaFraming, history: ConversationMessage[]): Promise<MVPSuggestion[]>

  // Problem decomposition
  analyzePainPoints(ideaFraming: IdeaFraming, history: ConversationMessage[]): Promise<PainPoint[]>

  // Strategic planning
  generateLaunchBlueprint(ideaFraming: IdeaFraming, selectedMVP: MVPSuggestion, painPoints: PainPoint[]): Promise<LaunchBlueprint>

  // Risk mitigation
  generateRiskAssessment(ideaFraming: IdeaFraming, blueprint: LaunchBlueprint): Promise<RiskAssessment>

  // General conversation
  generateResponse(userMessage: string, history: ConversationMessage[], context?: any): Promise<string>
}
```

### Wallet Service Methods

```typescript
class WalletService {
  // Connection management
  connectWallet(): Promise<{ address: string; chainId: number } | null>
  disconnectWallet(): Promise<void>
  isConnected(): boolean

  // Account information
  getAddress(): Promise<string | null>
  getBalance(address: string): Promise<string>

  // Transactions
  sendTransaction(to: string, value: string, data?: string): Promise<string | null>
  estimateGas(to: string, value: string, data?: string): Promise<string | null>

  // Network utilities
  switchToBase(): Promise<boolean>
  getGasPrice(): Promise<string | null>
}
```

## Error Handling

### API Error Types

```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
}

enum ErrorCodes {
  OPENAI_RATE_LIMIT = 'OPENAI_RATE_LIMIT',
  OPENAI_INVALID_KEY = 'OPENAI_INVALID_KEY',
  WALLET_CONNECTION_FAILED = 'WALLET_CONNECTION_FAILED',
  WALLET_INSUFFICIENT_BALANCE = 'WALLET_INSUFFICIENT_BALANCE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}
```

### Error Recovery Strategies

1. **OpenAI API Errors**:
   - Rate limiting: Exponential backoff (1s, 2s, 4s, 8s, 16s max)
   - Invalid key: Fallback to basic responses
   - Network issues: Retry with circuit breaker pattern

2. **Wallet Errors**:
   - Connection failed: Clear state, prompt user to retry
   - Insufficient balance: Show clear error message with required amount
   - Wrong network: Auto-prompt to switch to Base

3. **General Errors**:
   - Validation errors: Highlight specific fields with issues
   - Network errors: Show offline mode with cached responses
   - Unexpected errors: Graceful degradation with error boundaries

## Security Considerations

### API Key Management
- OpenAI API key stored as environment variable
- Never exposed to client-side code
- Rate limiting implemented to prevent abuse
- Key rotation strategy for production

### Wallet Security
- Coinbase Wallet SDK handles private key management
- No private keys stored in application state
- Transaction signing happens in wallet
- Network requests use HTTPS only

### Data Privacy
- All conversations stored locally in browser
- No personal data sent to external APIs except necessary for functionality
- User can clear session data at any time
- GDPR-compliant data handling

## Performance Optimization

### Caching Strategies
- AI responses cached for similar inputs
- Wallet balance updates throttled (every 30 seconds)
- Session data persisted in localStorage
- Static assets optimized with Next.js

### Loading States
- Skeleton loaders for AI responses
- Progressive loading for complex operations
- Error boundaries for component failures
- Optimistic updates for better UX

### Bundle Optimization
- Dynamic imports for heavy components
- Tree shaking for unused dependencies
- Image optimization with Next.js
- Code splitting by route

## Deployment Configuration

### Environment Variables

```bash
# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=sk-...

# Wallet Configuration
NEXT_PUBLIC_COINBASE_APP_NAME=SudoPath
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Farcaster Configuration
NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.snapshot.org/graphql

# Application Configuration
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Build Configuration

```javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['basescan.org', 'opensea.io'],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;
```

## Monitoring & Analytics

### Key Metrics Tracked
- Conversation completion rates
- MVP selection distribution
- User progression through funnel
- API response times
- Error rates by component
- Wallet connection success rates

### Logging Strategy
- Client-side error logging
- API call success/failure tracking
- User journey analytics
- Performance metrics collection

## Future Enhancements

### Planned API Integrations
- **Stripe**: For fiat payment processing
- **Vercel**: For deployment automation
- **Supabase**: For data persistence
- **Resend**: For email notifications
- **Web3.Storage**: For decentralized file storage

### Advanced Features
- Multi-language support
- Voice input/output
- Collaborative sessions
- Advanced analytics dashboard
- Integration with development tools

---

## Quick Start

1. **Install dependencies**: `npm install`
2. **Set environment variables**: Copy `.env.example` to `.env.local`
3. **Run development server**: `npm run dev`
4. **Build for production**: `npm run build && npm start`

## Support

For API integration issues or questions:
- Check browser console for detailed error messages
- Verify environment variables are set correctly
- Ensure wallet is connected for blockchain features
- Check network connectivity for AI responses

