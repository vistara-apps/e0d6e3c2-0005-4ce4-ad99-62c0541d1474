'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppShell, AppHeader } from './components/ui/AppShell';
import { AgentChat } from './components/ui/AgentChat';
import { OptionCard, MVPSelectionCard, FeatureCard } from './components/ui/OptionCard';
import { ActionableCard, NextStepCard, ValidationTestCard, ResourceCard } from './components/ui/ActionableCard';
import { InfoTooltip } from './components/ui/InfoTooltip';
import { ConversationEngine } from './lib/conversation';
import { sessionManager } from './lib/session';
import { ConversationMessage, UserSession, MVPSuggestion } from './app/types';
import { createConversationMessage } from './lib/models';
import { Bot, User, Settings, Wallet } from 'lucide-react';

export default function HomePage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [conversationEngine, setConversationEngine] = useState<ConversationEngine | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [mvpSuggestions, setMvpSuggestions] = useState<MVPSuggestion[]>([]);

  // Initialize session and conversation engine
  useEffect(() => {
    const userSession = sessionManager.initializeSession();
    setSession(userSession);

    const engine = new ConversationEngine(userSession);
    setConversationEngine(engine);

    // If this is a new session, start with initial greeting
    if (userSession.conversationHistory.length === 0) {
      handleInitialGreeting();
    }
  }, []);

  const handleInitialGreeting = useCallback(async () => {
    if (!conversationEngine) return;

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate typing

    const { response, options } = await conversationEngine.processUserInput('hi');
    conversationEngine.addMessage(response);

    setSession(conversationEngine.getSession());
    setCurrentOptions(options || []);
    setIsTyping(false);
  }, [conversationEngine]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!conversationEngine || !session) return;

    // Add user message
    const userMessage = createConversationMessage('user', message);
    conversationEngine.addMessage(userMessage);

    setIsTyping(true);
    setCurrentOptions([]); // Clear previous options

    try {
      // Process user input
      const result = await conversationEngine.processUserInput(message);

      // Add AI response
      conversationEngine.addMessage(result.response);

      // Update session
      const updatedSession = conversationEngine.getSession();
      setSession(updatedSession);

      // Handle different response types
      if (result.options) {
        setCurrentOptions(result.options);
      }

      if (result.data && Array.isArray(result.data)) {
        // Check if this is MVP suggestions
        if (result.data[0]?.title && result.data[0]?.revenueModel) {
          setMvpSuggestions(result.data);
        }
      }

      if (result.nextStep) {
        conversationEngine.setCurrentStep(result.nextStep);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = createConversationMessage(
        'assistant',
        'Sorry, I encountered an error. Let\'s try again. What would you like to work on?'
      );
      conversationEngine.addMessage(errorMessage);
    }

    setIsTyping(false);
  }, [conversationEngine, session]);

  const handleOptionSelect = useCallback(async (option: string) => {
    await handleSendMessage(option);
  }, [handleSendMessage]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg">Loading SudoPath...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      sidebar={
        <div className="p-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-sm">SudoPath</h3>
            <p className="text-xs text-muted-foreground">AI Co-founder</p>
          </div>

          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Progress</div>
            {[
              { step: 'initial_greeting', label: 'Introduction', completed: session.currentStep !== 'initial_greeting' },
              { step: 'idea_input', label: 'Idea Input', completed: ['problem_refinement', 'urgency_assessment', 'willingness_assessment', 'mvp_generation', 'mvp_selection', 'pain_point_analysis', 'focus_prioritization', 'launch_planning', 'risk_assessment', 'validation_testing', 'resource_recommendation', 'completion'].includes(session.currentStep) },
              { step: 'mvp_generation', label: 'MVP Ideas', completed: session.mvpSuggestions && session.mvpSuggestions.length > 0 },
              { step: 'launch_planning', label: 'Launch Plan', completed: session.launchBlueprint !== undefined },
              { step: 'validation_testing', label: 'Validation', completed: session.riskiestAssumption !== undefined }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${item.completed ? 'bg-primary' : 'bg-muted'}`} />
                <span className={`text-xs ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Chat Interface */}
        <div className="bg-card rounded-lg border shadow-sm">
          <AgentChat
            messages={session.conversationHistory}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            placeholder="Tell me about your app idea..."
            className="h-[600px]"
          />
        </div>

        {/* Options/Choices */}
        {currentOptions.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {currentOptions.map((option, index) => (
              <OptionCard
                key={index}
                title={option}
                description={`Select this option to continue`}
                onClick={() => handleOptionSelect(option)}
                variant="clickable"
              />
            ))}
          </div>
        )}

        {/* MVP Suggestions */}
        {mvpSuggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your MVP</h3>
            <div className="grid gap-4 md:grid-cols-1">
              {mvpSuggestions.map((mvp, index) => (
                <MVPSelectionCard
                  key={mvp.id}
                  mvp={{
                    title: mvp.title,
                    description: mvp.description,
                    buildTime: `${mvp.buildTimeDays} days`,
                    revenueModel: mvp.revenueModel.description,
                    riskLevel: mvp.riskLevel
                  }}
                  onSelect={() => handleOptionSelect(mvp.title)}
                  className="cursor-pointer"
                />
              ))}
            </div>
          </div>
        )}

        {/* Next Steps (if available) */}
        {session.launchBlueprint && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Launch Blueprint</h3>
            <div className="grid gap-4">
              {session.launchBlueprint.timeline.map((phase, index) => (
                <NextStepCard
                  key={index}
                  step={{
                    title: phase.phase,
                    description: phase.milestones.join(', '),
                    estimatedTime: `${phase.duration} weeks`,
                    priority: index === 0 ? 'high' : 'medium'
                  }}
                  onStart={() => handleSendMessage(`Start ${phase.phase}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        {session.riskiestAssumption && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Risk Assessment</h3>
            <ValidationTestCard
              test={{
                title: 'Validate Riskiest Assumption',
                description: session.riskiestAssumption.validationMethod,
                method: 'Quick Validation Test',
                timeline: `${session.riskiestAssumption.timelineDays} hours`,
                successCriteria: session.riskiestAssumption.successCriteria
              }}
              onRunTest={() => handleSendMessage('Run validation test')}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>Built with ❤️ by SudoPath - Launch faster, earn sooner</p>
          <div className="flex justify-center space-x-4 mt-2">
            <InfoTooltip content="Privacy-first AI assistance">
              <span className="cursor-help">🔒 Private</span>
            </InfoTooltip>
            <InfoTooltip content="Optimized for Base MiniApps">
              <span className="cursor-help">🚀 Base Ready</span>
            </InfoTooltip>
            <InfoTooltip content="Focus on revenue generation">
              <span className="cursor-help">💰 Revenue Focused</span>
            </InfoTooltip>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
