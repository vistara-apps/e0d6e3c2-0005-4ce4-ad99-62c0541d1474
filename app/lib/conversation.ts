import {
  ConversationStep,
  ConversationMessage,
  UserSession,
  IdeaFraming,
  MVPSuggestion,
  PainPoint,
  LaunchBlueprint,
  RiskAssessment
} from '@/app/types';
import { aiService } from './ai';
import { createConversationMessage } from './models';

export class ConversationEngine {
  private session: UserSession;
  private aiService = aiService;

  constructor(session: UserSession) {
    this.session = session;
  }

  // Process user input and determine next step
  async processUserInput(userInput: string): Promise<{
    response: ConversationMessage;
    nextStep?: ConversationStep;
    options?: string[];
    data?: any;
  }> {
    const currentStep = this.session.currentStep;

    switch (currentStep) {
      case 'initial_greeting':
        return await this.handleInitialGreeting(userInput);

      case 'idea_input':
        return await this.handleIdeaInput(userInput);

      case 'problem_refinement':
        return await this.handleProblemRefinement(userInput);

      case 'urgency_assessment':
        return await this.handleUrgencyAssessment(userInput);

      case 'willingness_assessment':
        return await this.handleWillingnessAssessment(userInput);

      case 'mvp_generation':
        return await this.handleMVPGeneration(userInput);

      case 'mvp_selection':
        return await this.handleMVPSelection(userInput);

      case 'pain_point_analysis':
        return await this.handlePainPointAnalysis(userInput);

      case 'focus_prioritization':
        return await this.handleFocusPrioritization(userInput);

      case 'launch_planning':
        return await this.handleLaunchPlanning(userInput);

      case 'risk_assessment':
        return await this.handleRiskAssessment(userInput);

      case 'validation_testing':
        return await this.handleValidationTesting(userInput);

      default:
        return await this.handleGeneralChat(userInput);
    }
  }

  private async handleInitialGreeting(userInput: string) {
    // Check if user wants to build an app
    const wantsToBuild = /build|create|make|develop|app|project/i.test(userInput);

    if (wantsToBuild) {
      const response = createConversationMessage(
        'assistant',
        "Great! I'm SudoPath, your AI co-founder. I'll help you launch a revenue-generating app fast.\n\nLet's start by understanding your idea. What's the core problem you want to solve?"
      );

      return {
        response,
        nextStep: 'idea_input'
      };
    } else {
      const response = createConversationMessage(
        'assistant',
        "Hi! I'm SudoPath, an AI co-founder that helps solo founders build and launch apps quickly. I specialize in Base MiniApps that can generate revenue.\n\nWhat would you like to do?\n\n• Build a new app\n• Analyze a website\n• Deploy an existing app\n• Add features to current app\n• Just chat about ideas"
      );

      return {
        response,
        options: ['Build a new app', 'Analyze a website', 'Deploy an existing app', 'Add features', 'Chat about ideas']
      };
    }
  }

  private async handleIdeaInput(userInput: string) {
    try {
      // Generate idea framing using AI
      const ideaFraming = await this.aiService.generateIdeaFraming(
        userInput,
        this.session.conversationHistory
      );

      this.session.ideaFraming = ideaFraming;

      const response = createConversationMessage(
        'assistant',
        `Thanks for sharing your idea! Here's what I understand:\n\n**Core Problem:** ${ideaFraming.coreProblem}\n**Target Audience:** ${ideaFraming.targetAudience}\n**Value Proposition:** ${ideaFraming.valueProposition}\n\nDoes this capture your idea accurately?`
      );

      return {
        response,
        nextStep: 'problem_refinement',
        options: ['Yes, that\'s perfect', 'Let me clarify', 'Not quite right']
      };
    } catch (error) {
      const response = createConversationMessage(
        'assistant',
        "I understand you want to build something. Can you tell me more about the problem you're solving or the app you have in mind?"
      );

      return {
        response,
        nextStep: 'idea_input'
      };
    }
  }

  private async handleProblemRefinement(userInput: string) {
    if (/yes|perfect|correct|good/i.test(userInput)) {
      const response = createConversationMessage(
        'assistant',
        "Excellent! Now let's assess how urgent this problem is for your users.\n\nOn a scale of 1-10, how painful is this problem?\n\n• 1-3: Nice to have\n• 4-7: Important but manageable\n• 8-10: Critical pain point"
      );

      return {
        response,
        nextStep: 'urgency_assessment'
      };
    } else {
      const response = createConversationMessage(
        'assistant',
        "No problem! Can you tell me more about your idea? What's the main problem you're trying to solve?"
      );

      return {
        response,
        nextStep: 'idea_input'
      };
    }
  }

  private async handleUrgencyAssessment(userInput: string) {
    // Parse urgency level from user input
    let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (/8|9|10|critical|urgent|painful/i.test(userInput)) {
      urgencyLevel = 'critical';
    } else if (/4|5|6|7|important/i.test(userInput)) {
      urgencyLevel = 'high';
    } else if (/1|2|3|nice|optional/i.test(userInput)) {
      urgencyLevel = 'low';
    }

    if (this.session.ideaFraming) {
      this.session.ideaFraming.urgencyLevel = urgencyLevel;
    }

    const response = createConversationMessage(
      'assistant',
      `Got it - this seems like a ${urgencyLevel} priority problem.\n\nNow, would your users pay to solve this? How much are they willing to spend?\n\n• Nothing - they expect it free\n• Low - $1-5 per month\n• Medium - $5-20 per month\n• High - $20-50 per month\n• Premium - $50+ per month`
    );

    return {
      response,
      nextStep: 'willingness_assessment'
    };
  }

  private async handleWillingnessAssessment(userInput: string) {
    let willingnessToPay: 'none' | 'low' | 'medium' | 'high' | 'premium' = 'medium';

    if (/nothing|free|expect|0/i.test(userInput)) {
      willingnessToPay = 'none';
    } else if (/premium|50|high/i.test(userInput)) {
      willingnessToPay = 'premium';
    } else if (/20|high/i.test(userInput)) {
      willingnessToPay = 'high';
    } else if (/1|2|3|4|5|low/i.test(userInput)) {
      willingnessToPay = 'low';
    }

    if (this.session.ideaFraming) {
      this.session.ideaFraming.willingnessToPay = willingnessToPay;
    }

    const response = createConversationMessage(
      'assistant',
      "Perfect! Now I have enough context to suggest some killer MVP ideas.\n\nBased on your problem, audience, urgency, and willingness to pay, here are 3 MVPs you could build in 1-3 days each:"
    );

    return {
      response,
      nextStep: 'mvp_generation'
    };
  }

  private async handleMVPGeneration(userInput: string) {
    try {
      if (!this.session.ideaFraming) {
        throw new Error('No idea framing available');
      }

      const mvpSuggestions = await this.aiService.generateMVPSuggestions(
        this.session.ideaFraming,
        this.session.conversationHistory
      );

      this.session.mvpSuggestions = mvpSuggestions;

      const response = createConversationMessage(
        'assistant',
        "Here are your MVP options. Which one excites you most?"
      );

      return {
        response,
        nextStep: 'mvp_selection',
        options: mvpSuggestions.map(mvp => mvp.title),
        data: mvpSuggestions
      };
    } catch (error) {
      const response = createConversationMessage(
        'assistant',
        "Let me suggest some MVP ideas based on what you've told me. Which approach interests you more?\n\n1. Simple landing page with email capture\n2. Basic web app with core functionality\n3. Mobile-first solution\n4. API-first approach"
      );

      return {
        response,
        nextStep: 'mvp_selection',
        options: ['Landing page', 'Web app', 'Mobile app', 'API service']
      };
    }
  }

  private async handleMVPSelection(userInput: string) {
    // This would parse the selected MVP and store it
    const response = createConversationMessage(
      'assistant',
      "Great choice! Now let's break down your problem space to identify the highest-impact areas to focus on.\n\nI'll analyze your problem using MECE (Mutually Exclusive, Collectively Exhaustive) framework and the 80/20 rule to find the most valuable pain points."
    );

    return {
      response,
      nextStep: 'pain_point_analysis'
    };
  }

  private async handlePainPointAnalysis(userInput: string) {
    try {
      if (!this.session.ideaFraming) {
        throw new Error('No idea framing available');
      }

      const painPoints = await this.aiService.analyzePainPoints(
        this.session.ideaFraming,
        this.session.conversationHistory
      );

      this.session.painPoints = painPoints;

      const response = createConversationMessage(
        'assistant',
        "I've analyzed your problem space and identified the top pain points using the 80/20 rule.\n\nHere are the highest-impact areas to prioritize:"
      );

      return {
        response,
        nextStep: 'focus_prioritization',
        data: painPoints
      };
    } catch (error) {
      const response = createConversationMessage(
        'assistant',
        "Based on your idea, here are the key areas to focus on first:\n\n1. Core user workflow\n2. Payment integration\n3. User onboarding\n4. Key features\n\nWhich area should we tackle first?"
      );

      return {
        response,
        nextStep: 'focus_prioritization',
        options: ['Core workflow', 'Payments', 'Onboarding', 'Features']
      };
    }
  }

  private async handleFocusPrioritization(userInput: string) {
    const response = createConversationMessage(
      'assistant',
      "Perfect! Now let's create your lean launch blueprint.\n\nThis will include:\n• How to acquire your first users\n• Payment setup\n• Success metrics to track\n• 2-week timeline with milestones"
    );

    return {
      response,
      nextStep: 'launch_planning'
    };
  }

  private async handleLaunchPlanning(userInput: string) {
    try {
      if (!this.session.ideaFraming || !this.session.mvpSuggestions?.[0]) {
        throw new Error('Missing required data');
      }

      const launchBlueprint = await this.aiService.generateLaunchBlueprint(
        this.session.ideaFraming,
        this.session.mvpSuggestions[0],
        this.session.painPoints || []
      );

      this.session.launchBlueprint = launchBlueprint;

      const response = createConversationMessage(
        'assistant',
        "Here's your launch blueprint! But before we proceed, let's identify your riskiest assumption.\n\nThe riskiest assumption is usually: \"People will actually pay for this solution.\"\n\nLet's create a 24-hour validation test to confirm this."
      );

      return {
        response,
        nextStep: 'risk_assessment'
      };
    } catch (error) {
      const response = createConversationMessage(
        'assistant',
        "Here's a simple launch plan:\n\nWeek 1: Build MVP\nWeek 2: Test with 10 users\n\nYour riskiest assumption is that users will pay. Let's test this quickly."
      );

      return {
        response,
        nextStep: 'risk_assessment'
      };
    }
  }

  private async handleRiskAssessment(userInput: string) {
    try {
      if (!this.session.ideaFraming || !this.session.launchBlueprint) {
        throw new Error('Missing required data');
      }

      const riskAssessment = await this.aiService.generateRiskAssessment(
        this.session.ideaFraming,
        this.session.launchBlueprint
      );

      this.session.riskiestAssumption = riskAssessment;

      const response = createConversationMessage(
        'assistant',
        `**Riskiest Assumption:** ${riskAssessment.riskiestAssumption}\n\n**24-Hour Validation Test:** ${riskAssessment.validationMethod}\n\n**Success Criteria:**\n${riskAssessment.successCriteria.map(c => `• ${c}`).join('\n')}\n\nReady to run this test?`
      );

      return {
        response,
        nextStep: 'validation_testing',
        options: ['Yes, let\'s do it', 'Tell me more', 'Skip for now']
      };
    } catch (error) {
      const response = createConversationMessage(
        'assistant',
        "**Riskiest Assumption:** People will actually use and pay for your solution.\n\n**Quick Test:** Post about your idea on Twitter/LinkedIn and see if 5 people express interest.\n\nWant to run this test?"
      );

      return {
        response,
        nextStep: 'validation_testing',
        options: ['Yes, test it', 'Skip test', 'Different test']
      };
    }
  }

  private async handleValidationTesting(userInput: string) {
    const response = createConversationMessage(
      'assistant',
      "Excellent! You've completed the core planning phase.\n\n**Your Next Steps:**\n1. Run the validation test (24 hours)\n2. Start building your MVP\n3. Set up payment processing\n4. Launch to first users\n\nNeed resources, templates, or expert advice to help you execute?"
    );

    return {
      response,
      nextStep: 'resource_recommendation',
      options: ['Get resources', 'Start building', 'Get expert advice']
    };
  }

  private async handleGeneralChat(userInput: string) {
    try {
      const response = await this.aiService.generateResponse(
        userInput,
        this.session.conversationHistory,
        {
          currentStep: this.session.currentStep,
          ideaFraming: this.session.ideaFraming,
          mvpSuggestions: this.session.mvpSuggestions
        }
      );

      const message = createConversationMessage('assistant', response);
      return { response: message };
    } catch (error) {
      const message = createConversationMessage(
        'assistant',
        "I'm here to help you build and launch your app! What would you like to work on next?"
      );
      return { response: message };
    }
  }

  // Update session with new message
  addMessage(message: ConversationMessage): void {
    this.session.conversationHistory.push(message);
    this.session.updatedAt = new Date();
  }

  // Update current step
  setCurrentStep(step: ConversationStep): void {
    this.session.currentStep = step;
    this.session.updatedAt = new Date();
  }

  // Get current session
  getSession(): UserSession {
    return this.session;
  }
}

