'use client'

import { useState, useEffect, useRef } from 'react'
import { AgentChat } from './AgentChat'
import { AppShell } from './AppShell'
import { UserSession, Message, ConversationStep, MVPSuggestion, ActionableCard } from '../types'
import { LocalStorage } from '../lib/storage'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
})

export function SudoPathApp() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize session on mount (only on client)
  useEffect(() => {
    if (isClient) {
      initializeSession()
    }
  }, [isClient])

  const initializeSession = () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const userId = `user_${Date.now()}`

    const newSession: UserSession = {
      sessionId,
      userId,
      currentStep: 'welcome',
      conversationHistory: [],
      userPreferences: {
        theme: 'base',
        notifications: true,
        language: 'en'
      }
    }

    // Save to localStorage
    LocalStorage.saveSession(newSession)

    // Create user if doesn't exist
    const existingUser = LocalStorage.getUser(userId)
    if (!existingUser) {
      const newUser = {
        userId,
        preferences: newSession.userPreferences
      }
      LocalStorage.saveUser(newUser)
    }

    setSession(newSession)
    startWelcomeFlow()
  }

  const startWelcomeFlow = () => {
    const welcomeMessage: Message = {
      id: 'welcome_1',
      role: 'assistant',
      content: "👋 Welcome to **SudoPath** - Your AI Co-Founder!\n\nI'm here to guide you from idea to revenue-generating MVP in record time. Let's start by understanding your core problem and target audience.\n\n**What would you like to build today?**",
      timestamp: new Date(),
      actionableCards: [
        {
          id: 'build_app',
          title: '🚀 Build an App',
          description: 'Create a new software application from scratch',
          actionLabel: 'Start Building',
          type: 'resource'
        },
        {
          id: 'analyze_website',
          title: '📊 Analyze Website',
          description: 'Analyze and improve an existing website',
          actionLabel: 'Analyze Now',
          type: 'resource'
        },
        {
          id: 'deploy_app',
          title: '☁️ Deploy App',
          description: 'Deploy your application to production',
          actionLabel: 'Deploy Now',
          type: 'resource'
        },
        {
          id: 'add_feature',
          title: '✨ Add Feature',
          description: 'Add new features to existing application',
          actionLabel: 'Add Feature',
          type: 'resource'
        },
        {
          id: 'chat_general',
          title: '💬 General Chat',
          description: 'Ask me anything about development and entrepreneurship',
          actionLabel: 'Start Chat',
          type: 'resource'
        }
      ]
    }
    setMessages([welcomeMessage])
  }

  const handleUserMessage = async (content: string, selectedOption?: string) => {
    if (!session) return

    // Add user message to chat
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: selectedOption ? `Selected: ${selectedOption}` : content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Process based on current step and user input
      await processUserInput(content, selectedOption)
    } catch (error) {
      console.error('Error processing user input:', error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardAction = async (card: ActionableCard) => {
    if (!session) return

    // Add user action to chat
    const userMessage: Message = {
      id: `user_card_${Date.now()}`,
      role: 'user',
      content: `Selected: ${card.title}`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Process card selection based on type
      await processCardAction(card)
    } catch (error) {
      console.error('Error processing card action:', error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your selection. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const processCardAction = async (card: ActionableCard) => {
    if (!session) return

    let nextStep: ConversationStep = session.currentStep
    let aiResponse = ''

    switch (card.type) {
      case 'resource':
        // Handle initial option selection
        if (card.id === 'build_app') {
          nextStep = 'idea-framing'
          aiResponse = `Perfect! Let's build an amazing app together. 🚀

To create something people will actually pay for, I need to understand your target users and their biggest problems.

**What's the core problem you're solving?**

For example:
- "Small business owners waste 5 hours/week on manual invoicing"
- "Freelancers struggle to find clients who pay on time"
- "Students can't afford expensive learning tools"

Tell me about the problem you're passionate about solving!`
        } else if (card.id === 'chat_general') {
          aiResponse = `Great! I'm here to help with any development or business questions. 💬

What would you like to know? I can help with:
- Technical architecture decisions
- Business model validation
- Development best practices
- Startup strategy
- Code reviews and debugging

What's on your mind?`
        } else {
          aiResponse = `Thanks for selecting ${card.title}. This feature is coming soon! 

In the meantime, let's focus on building your app. What problem are you trying to solve?`
        }
        break

      case 'mvp':
        nextStep = 'pain-analysis'
        aiResponse = `Great choice! You've selected **${card.title}**.

Now let's analyze the problem space using MECE (Mutually Exclusive, Collectively Exhaustive) framework to identify the highest-impact pain points.

**Common pain points in your domain:**

🔴 **High Priority (High frequency + High willingness to pay):**
- Time wasted on manual processes
- Data entry and validation errors
- Lack of real-time insights

🟡 **Medium Priority:**
- Integration with existing tools
- Mobile accessibility
- User onboarding complexity

🟢 **Low Priority:**
- Advanced customization options
- Multi-language support
- Enterprise features

**Which pain point should we prioritize for your MVP?**`
        break

      default:
        aiResponse = `Thanks for selecting ${card.title}. Let's continue with your project.`
    }

    // Update session
    setSession(prev => prev ? { ...prev, currentStep: nextStep } : null)

    // Add AI response
    const aiMessage: Message = {
      id: `ai_card_${Date.now()}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, aiMessage])
  }

  const processUserInput = async (content: string, selectedOption?: string) => {
    if (!session) return

    let nextStep: ConversationStep = session.currentStep
    let aiResponse = ''

    switch (session.currentStep) {
      case 'welcome':
        if (selectedOption === 'build_app') {
          nextStep = 'idea-framing'
          aiResponse = await generateIdeaFramingPrompt()
        } else {
          aiResponse = `Great! You selected ${selectedOption}. Let's get started with that.`
        }
        break

      case 'idea-framing':
        nextStep = 'mvp-suggestions'
        const mvpMessage = await generateMVPSuggestions(content)
        setMessages(prev => [...prev, mvpMessage])
        return // Early return since we already added the message

      case 'mvp-suggestions':
        nextStep = 'pain-analysis'
        aiResponse = await generatePainAnalysis()
        break

      case 'pain-analysis':
        nextStep = 'focus-selection'
        aiResponse = await generateFocusSelection()
        break

      case 'focus-selection':
        nextStep = 'launch-planning'
        aiResponse = await generateLaunchBlueprint()
        break

      case 'launch-planning':
        nextStep = 'validation-testing'
        aiResponse = await generateValidationTest()
        break

      case 'validation-testing':
        nextStep = 'resource-hub'
        aiResponse = await generateResourceHub()
        break

      default:
        aiResponse = "I'm here to help! What would you like to work on?"
    }

    // Update session
    setSession(prev => prev ? { ...prev, currentStep: nextStep } : null)

    // Add AI response
    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, aiMessage])
  }

  const generateIdeaFramingPrompt = async (): Promise<string> => {
    return `Perfect! Let's start framing your idea. I need to understand your core problem deeply.

**Tell me about:**
1. **The core problem** you're solving
2. **Who** is experiencing this problem
3. **Why** it's urgent for them to solve it
4. **How much** they're willing to pay for a solution

For example: "Small business owners waste 10+ hours/week on manual invoicing and are willing to pay $50/month for automation."

**What's your idea?**`
  }

  const generateMVPSuggestions = async (userInput: string): Promise<Message> => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are SudoPath, an AI co-founder helping solo founders build revenue-generating MVPs quickly.
            Based on the user's idea, suggest 3 distinct MVP ideas that can be built in 1-3 days.
            Each MVP should include:
            - A clear title
            - Brief description (2-3 sentences)
            - Revenue model suggestion with pricing
            - Estimated build time
            - 3-4 key features

            Return the response as a JSON object with this structure:
            {
              "introduction": "Brief intro text",
              "mvps": [
                {
                  "title": "MVP Title",
                  "description": "Description text",
                  "revenueModel": "Revenue model with pricing",
                  "buildTime": "X days",
                  "features": ["feature1", "feature2", "feature3"]
                }
              ]
            }`
          },
          {
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      })

      const response = JSON.parse(completion.choices[0]?.message?.content || '{}')

      const actionableCards: ActionableCard[] = response.mvps?.map((mvp: any, index: number) => ({
        id: `mvp_${index + 1}`,
        title: mvp.title,
        description: mvp.description,
        actionLabel: 'Select This MVP',
        type: 'mvp' as const,
        data: {
          revenueModel: mvp.revenueModel,
          buildTime: mvp.buildTime,
          features: mvp.features
        }
      })) || []

      return {
        id: `ai_mvp_${Date.now()}`,
        role: 'assistant',
        content: response.introduction || "Here are 3 MVP suggestions based on your idea:",
        timestamp: new Date(),
        actionableCards
      }
    } catch (error) {
      console.error('OpenAI API error:', error)

      // Fallback MVP suggestions
      const fallbackCards: ActionableCard[] = [
        {
          id: 'mvp_1',
          title: 'Landing Page MVP',
          description: 'Start with a simple landing page that captures emails and validates interest. Include a problem statement, solution overview, and early access signup.',
          actionLabel: 'Select This MVP',
          type: 'mvp',
          data: {
            revenueModel: 'Freemium with premium features ($9.99/mo)',
            buildTime: '1 day',
            features: ['Email capture form', 'Problem/solution explanation', 'Social proof section', 'Early access waitlist']
          }
        },
        {
          id: 'mvp_2',
          title: 'Chrome Extension MVP',
          description: 'Build a browser extension that provides immediate value to your target users. Focus on solving one specific pain point exceptionally well.',
          actionLabel: 'Select This MVP',
          type: 'mvp',
          data: {
            revenueModel: 'One-time purchase ($4.99)',
            buildTime: '2 days',
            features: ['Core functionality', 'Simple UI', 'Basic settings', 'Chrome Web Store listing']
          }
        },
        {
          id: 'mvp_3',
          title: 'Web App MVP',
          description: 'Create a full web application with the core features needed to solve the main problem. Focus on the 20% of features that deliver 80% of value.',
          actionLabel: 'Select This MVP',
          type: 'mvp',
          data: {
            revenueModel: 'Subscription ($19.99/mo)',
            buildTime: '3 days',
            features: ['User authentication', 'Core workflow', 'Basic dashboard', 'Payment integration']
          }
        }
      ]

      return {
        id: `ai_mvp_fallback_${Date.now()}`,
        role: 'assistant',
        content: "Based on your idea, here are 3 practical MVP suggestions that can be built quickly and start generating revenue:",
        timestamp: new Date(),
        actionableCards: fallbackCards
      }
    }
  }

  const generatePainAnalysis = async (): Promise<string> => {
    return `Great choice! Now let's analyze the problem space using MECE (Mutually Exclusive, Collectively Exhaustive) framework.

**Common pain points in your domain:**

🔴 **High Priority (High frequency + High willingness to pay):**
- Time wasted on manual processes
- Data entry and validation errors
- Lack of real-time insights

🟡 **Medium Priority:**
- Integration with existing tools
- Mobile accessibility
- User onboarding complexity

🟢 **Low Priority:**
- Advanced customization options
- Multi-language support
- Enterprise features

**Which pain point should we prioritize for your MVP?**`
  }

  const generateFocusSelection = async (): Promise<string> => {
    return `Excellent! Now let's apply the 80/20 rule to focus on the highest-impact features.

**Top 80/20 opportunities:**
1. **Core workflow automation** (80% of value, 20% of effort)
2. **Real-time notifications** (15% of value, 5% of effort)
3. **Basic reporting** (5% of value, 75% of effort)

**Recommended focus:** Start with core workflow automation - it addresses 80% of user needs with minimal development effort.

**Next: Let's create your launch blueprint!** 🚀`
  }

  const generateLaunchBlueprint = async (): Promise<string> => {
    return `Perfect! Now let's create your minimal launch blueprint.

**🎯 Launch Strategy:**

**User Acquisition (Week 1-2):**
- Post on indie hacker forums and Reddit
- Share on Twitter/Farcaster with #buildinpublic
- Reach out to 50 potential users directly

**Revenue Collection (Week 1):**
- Stripe integration for subscriptions
- Accept $DEGEN or other crypto payments
- Offer early-bird discount (50% off first month)

**PMF Signals (Ongoing):**
- 10 paying customers
- 50% monthly retention
- Users requesting premium features

**Timeline:** Launch MVP in 2 weeks, validate in 4 weeks.

**What's your riskiest assumption about this plan?**`
  }

  const generateValidationTest = async (): Promise<string> => {
    return `Smart thinking! Every plan has riskiest assumptions. Let's identify yours and create a validation test.

**Common riskiest assumptions:**
- Users actually experience this pain point
- They're willing to pay the proposed price
- The solution works as intended
- Users can discover and adopt the product

**24-hour validation test:** Create a simple landing page explaining your solution and post it on 3 relevant communities. Track:
- How many people click "notify me when launched"
- Questions and feedback received
- Social shares and engagement

**Want advanced AI analysis of your business model?** (Micro-transaction: $4.99)`
  }

  const generateResourceHub = async (): Promise<string> => {
    return `Congratulations! You've completed the core planning phase. 🎉

**📚 Contextual Resources for Your Next Steps:**

**Technical Resources:**
- Next.js + Tailwind CSS starter template
- Stripe payment integration guide
- Farcaster API documentation

**Business Resources:**
- Lean startup validation frameworks
- Pricing strategy calculator
- Customer interview scripts

**Community Resources:**
- Indie Hackers community
- Farcaster developer channels
- Base ecosystem Discord

**Ready to start building?** I can help you with the technical implementation too!

**What would you like to work on next?**`
  }

  // Don't render anything during server-side rendering
  if (!isClient) {
    return (
      <AppShell>
        <div className="flex flex-col h-full items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading SudoPath...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full">
          <AgentChat
            messages={messages}
            onSendMessage={handleUserMessage}
            onCardAction={handleCardAction}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AppShell>
  )
}
