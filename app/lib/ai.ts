import OpenAI from 'openai';
import { ConversationMessage, IdeaFraming, MVPSuggestion, PainPoint, LaunchBlueprint, RiskAssessment } from '@/app/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from server-side
});

// Configuration
const CONFIG = {
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 2000,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1
};

// AI Service Class
export class AIService {
  private static instance: AIService;

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Idea Framing - Deep understanding of core problem and value proposition
  async generateIdeaFraming(
    userInput: string,
    conversationHistory: ConversationMessage[]
  ): Promise<IdeaFraming> {
    const prompt = `
You are SudoPath, an AI co-founder helping solo founders launch fast, revenue-generating apps.

Based on the user's input and conversation history, analyze their core problem and generate a structured idea framing.

User Input: "${userInput}"

Conversation History:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Provide a JSON response with:
{
  "coreProblem": "Clear, concise statement of the user's main problem",
  "targetAudience": "Specific description of who has this problem",
  "urgencyLevel": "low|medium|high|critical",
  "willingnessToPay": "none|low|medium|high|premium",
  "valueProposition": "What makes this solution uniquely valuable",
  "marketSize": "Estimated market size or TAM",
  "competition": "Brief analysis of competitive landscape"
}

Focus on being specific, actionable, and founder-focused.
`;

    try {
      const response = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: CONFIG.temperature,
        max_tokens: CONFIG.maxTokens,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const result = JSON.parse(content);
      return {
        coreProblem: result.coreProblem,
        targetAudience: result.targetAudience,
        urgencyLevel: result.urgencyLevel,
        willingnessToPay: result.willingnessToPay,
        valueProposition: result.valueProposition,
        marketSize: result.marketSize,
        competition: result.competition
      };
    } catch (error) {
      console.error('Error generating idea framing:', error);
      throw new Error('Failed to generate idea framing');
    }
  }

  // MVP Generation - Suggest 3 distinct, low-effort MVPs
  async generateMVPSuggestions(
    ideaFraming: IdeaFraming,
    conversationHistory: ConversationMessage[]
  ): Promise<MVPSuggestion[]> {
    const prompt = `
You are SudoPath, an AI co-founder. Generate 3 distinct MVP ideas that can be built in 1-3 days each.

Idea Context:
- Core Problem: ${ideaFraming.coreProblem}
- Target Audience: ${ideaFraming.targetAudience}
- Urgency: ${ideaFraming.urgencyLevel}
- Willingness to Pay: ${ideaFraming.willingnessToPay}
- Value Proposition: ${ideaFraming.valueProposition}

Requirements:
1. Each MVP must be buildable in 1-3 days
2. Include specific revenue model suggestions
3. Focus on low-effort, high-impact solutions
4. Consider the user's willingness to pay

Provide a JSON response with an array of 3 MVP objects:
[{
  "id": "unique_id",
  "title": "Catchy MVP name",
  "description": "Detailed description of what the MVP does",
  "revenueModel": "Specific revenue model (e.g., $5/mo subscription, $10 pay-per-use)",
  "buildTimeDays": 2,
  "technicalStack": ["Next.js", "Tailwind", "Stripe"],
  "riskLevel": "low|medium|high",
  "successMetrics": ["User signups", "Conversion rate"],
  "nextSteps": ["Build landing page", "Set up payment"]
}]

Make suggestions realistic and immediately actionable.
`;

    try {
      const response = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: CONFIG.temperature,
        max_tokens: CONFIG.maxTokens,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const result = JSON.parse(content);
      return result.map((mvp: any) => ({
        id: mvp.id,
        title: mvp.title,
        description: mvp.description,
        revenueModel: mvp.revenueModel,
        buildTimeDays: mvp.buildTimeDays,
        technicalStack: mvp.technicalStack,
        riskLevel: mvp.riskLevel,
        successMetrics: mvp.successMetrics,
        nextSteps: mvp.nextSteps
      }));
    } catch (error) {
      console.error('Error generating MVP suggestions:', error);
      throw new Error('Failed to generate MVP suggestions');
    }
  }

  // Pain Point Analysis - MECE breakdown and 80/20 prioritization
  async analyzePainPoints(
    ideaFraming: IdeaFraming,
    conversationHistory: ConversationMessage[]
  ): Promise<PainPoint[]> {
    const prompt = `
You are SudoPath, an AI co-founder. Perform a MECE (Mutually Exclusive, Collectively Exhaustive) analysis of pain points.

Context:
- Core Problem: ${ideaFraming.coreProblem}
- Target Audience: ${ideaFraming.targetAudience}

Requirements:
1. Break down the problem space into MECE categories
2. Identify specific pain points within each category
3. Assess frequency, severity, and willingness to pay for each
4. Estimate effort required to solve each pain point

Provide a JSON response with an array of pain point objects:
[{
  "id": "unique_id",
  "category": "Problem category name",
  "description": "Specific pain point description",
  "frequency": "rare|occasional|frequent|constant",
  "severity": "low|medium|high|critical",
  "willingnessToPay": "none|low|medium|high|premium",
  "solvable": true|false,
  "estimatedEffort": 5
}]

Focus on the most impactful pain points that align with the user's willingness to pay.
`;

    try {
      const response = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: CONFIG.temperature,
        max_tokens: CONFIG.maxTokens,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const result = JSON.parse(content);
      return result.map((point: any) => ({
        id: point.id,
        category: point.category,
        description: point.description,
        frequency: point.frequency,
        severity: point.severity,
        willingnessToPay: point.willingnessToPay,
        solvable: point.solvable,
        estimatedEffort: point.estimatedEffort
      }));
    } catch (error) {
      console.error('Error analyzing pain points:', error);
      throw new Error('Failed to analyze pain points');
    }
  }

  // Launch Blueprint Generation
  async generateLaunchBlueprint(
    ideaFraming: IdeaFraming,
    selectedMVP: MVPSuggestion,
    topPainPoints: PainPoint[]
  ): Promise<LaunchBlueprint> {
    const prompt = `
You are SudoPath, an AI co-founder. Create a lean launch blueprint for this MVP.

MVP Details:
- Title: ${selectedMVP.title}
- Description: ${selectedMVP.description}
- Revenue Model: ${selectedMVP.revenueModel}

Top Pain Points:
${topPainPoints.map(p => `- ${p.category}: ${p.description}`).join('\n')}

Context:
- Target Audience: ${ideaFraming.targetAudience}
- Willingness to Pay: ${ideaFraming.willingnessToPay}

Provide a JSON response with:
{
  "userAcquisitionStrategy": ["Strategy 1", "Strategy 2"],
  "paymentIntegration": "Payment solution recommendation",
  "pmfSignals": ["Signal 1", "Signal 2"],
  "initialMarketingBudget": 500,
  "timeline": [
    {
      "phase": "Week 1-2",
      "duration": 2,
      "milestones": ["Milestone 1", "Milestone 2"],
      "deliverables": ["Deliverable 1", "Deliverable 2"]
    }
  ],
  "successMetrics": ["Metric 1", "Metric 2"]
}

Focus on actionable, low-cost strategies that solo founders can execute quickly.
`;

    try {
      const response = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: CONFIG.temperature,
        max_tokens: CONFIG.maxTokens,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const result = JSON.parse(content);
      return {
        userAcquisitionStrategy: result.userAcquisitionStrategy,
        paymentIntegration: result.paymentIntegration,
        pmfSignals: result.pmfSignals,
        initialMarketingBudget: result.initialMarketingBudget,
        timeline: result.timeline,
        successMetrics: result.successMetrics
      };
    } catch (error) {
      console.error('Error generating launch blueprint:', error);
      throw new Error('Failed to generate launch blueprint');
    }
  }

  // Risk Assessment and Validation Test
  async generateRiskAssessment(
    ideaFraming: IdeaFraming,
    launchBlueprint: LaunchBlueprint
  ): Promise<RiskAssessment> {
    const prompt = `
You are SudoPath, an AI co-founder. Identify the riskiest assumption and create a validation test.

Context:
- Core Problem: ${ideaFraming.coreProblem}
- Value Proposition: ${ideaFraming.valueProposition}
- Launch Strategy: ${launchBlueprint.userAcquisitionStrategy.join(', ')}

Identify the single riskiest assumption that could kill this business, then design a 24-hour validation test.

Provide a JSON response with:
{
  "riskiestAssumption": "The riskiest assumption statement",
  "validationMethod": "How to test this assumption",
  "timelineDays": 1,
  "successCriteria": ["Criterion 1", "Criterion 2"],
  "fallbackPlan": "What to do if the assumption is wrong"
}

Make the validation test extremely low-cost and executable within 24 hours.
`;

    try {
      const response = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: CONFIG.temperature,
        max_tokens: CONFIG.maxTokens,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      const result = JSON.parse(content);
      return {
        riskiestAssumption: result.riskiestAssumption,
        validationMethod: result.validationMethod,
        timelineDays: result.timelineDays,
        successCriteria: result.successCriteria,
        fallbackPlan: result.fallbackPlan
      };
    } catch (error) {
      console.error('Error generating risk assessment:', error);
      throw new Error('Failed to generate risk assessment');
    }
  }

  // Conversational AI for general chat
  async generateResponse(
    userMessage: string,
    conversationHistory: ConversationMessage[],
    context?: any
  ): Promise<string> {
    const systemPrompt = `
You are SudoPath, an AI co-founder for solo founders building Base MiniApps. You help them launch fast, revenue-generating apps.

Key principles:
- Be direct, actionable, and founder-focused
- Prioritize speed to revenue over perfection
- Focus on MVPs that can be built in days, not months
- Always suggest specific next steps with timelines
- Be encouraging but realistic about challenges

Current context: ${context ? JSON.stringify(context) : 'Initial conversation'}

Respond helpfully to the user's message.
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: messages as any,
        temperature: CONFIG.temperature,
        max_tokens: CONFIG.maxTokens,
        presence_penalty: CONFIG.presencePenalty,
        frequency_penalty: CONFIG.frequencyPenalty
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

