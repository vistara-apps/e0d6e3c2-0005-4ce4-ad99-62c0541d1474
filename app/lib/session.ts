import { UserSession, ConversationMessage } from '@/app/types';
import { createUserSession } from './models';
import { safeLocalStorageGet, safeLocalStorageSet } from './utils';

const SESSION_STORAGE_KEY = 'sudopath-session';
const SESSION_EXPIRY_HOURS = 24;

export class SessionManager {
  private static instance: SessionManager;
  private currentSession: UserSession | null = null;

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Initialize or load existing session
  initializeSession(userId?: string): UserSession {
    // Try to load existing session
    const existingSession = this.loadSession();

    if (existingSession && this.isSessionValid(existingSession)) {
      this.currentSession = existingSession;
      return existingSession;
    }

    // Create new session
    const newSession = createUserSession(userId || this.generateUserId());
    this.currentSession = newSession;
    this.saveSession(newSession);

    return newSession;
  }

  // Get current session
  getCurrentSession(): UserSession | null {
    if (!this.currentSession) {
      this.currentSession = this.loadSession();
    }
    return this.currentSession;
  }

  // Update session
  updateSession(updates: Partial<UserSession>): void {
    if (!this.currentSession) return;

    this.currentSession = {
      ...this.currentSession,
      ...updates,
      updatedAt: new Date()
    };

    this.saveSession(this.currentSession);
  }

  // Add message to session
  addMessage(message: ConversationMessage): void {
    if (!this.currentSession) return;

    this.currentSession.conversationHistory.push(message);
    this.currentSession.updatedAt = new Date();

    this.saveSession(this.currentSession);
  }

  // Clear session
  clearSession(): void {
    this.currentSession = null;
    this.removeSession();
  }

  // Check if session is valid (not expired)
  private isSessionValid(session: UserSession): boolean {
    const now = new Date();
    const sessionAge = now.getTime() - session.createdAt.getTime();
    const maxAge = SESSION_EXPIRY_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds

    return sessionAge < maxAge;
  }

  // Save session to localStorage
  private saveSession(session: UserSession): void {
    try {
      safeLocalStorageSet(SESSION_STORAGE_KEY, session);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  // Load session from localStorage
  private loadSession(): UserSession | null {
    try {
      const session = safeLocalStorageGet(SESSION_STORAGE_KEY);
      if (session && typeof session === 'object') {
        // Convert date strings back to Date objects
        return {
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          conversationHistory: session.conversationHistory.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        };
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
    return null;
  }

  // Remove session from localStorage
  private removeSession(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove session:', error);
    }
  }

  // Generate a unique user ID
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get session statistics
  getSessionStats(): {
    messageCount: number;
    sessionDuration: number;
    currentStep: string;
  } | null {
    const session = this.getCurrentSession();
    if (!session) return null;

    const messageCount = session.conversationHistory.length;
    const sessionDuration = Date.now() - session.createdAt.getTime();

    return {
      messageCount,
      sessionDuration,
      currentStep: session.currentStep
    };
  }

  // Export session data (for debugging/analytics)
  exportSession(): UserSession | null {
    return this.getCurrentSession();
  }

  // Import session data (for testing)
  importSession(session: UserSession): void {
    this.currentSession = session;
    this.saveSession(session);
  }

  // Check if user has completed onboarding
  hasCompletedOnboarding(): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    return session.currentStep !== 'initial_greeting' &&
           session.conversationHistory.length > 1;
  }

  // Get conversation summary
  getConversationSummary(): {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    lastActivity: Date | null;
  } {
    const session = this.getCurrentSession();
    if (!session) {
      return {
        totalMessages: 0,
        userMessages: 0,
        assistantMessages: 0,
        lastActivity: null
      };
    }

    const totalMessages = session.conversationHistory.length;
    const userMessages = session.conversationHistory.filter(msg => msg.role === 'user').length;
    const assistantMessages = session.conversationHistory.filter(msg => msg.role === 'assistant').length;
    const lastActivity = session.conversationHistory.length > 0
      ? session.conversationHistory[session.conversationHistory.length - 1].timestamp
      : null;

    return {
      totalMessages,
      userMessages,
      assistantMessages,
      lastActivity
    };
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();

