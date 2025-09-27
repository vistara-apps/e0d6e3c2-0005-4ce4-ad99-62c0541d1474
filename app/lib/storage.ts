import { UserSession, User } from '../types'

const SESSIONS_KEY = 'sudopath_sessions'
const USERS_KEY = 'sudopath_users'

export class LocalStorage {
  private static isClient(): boolean {
    return typeof window !== 'undefined'
  }

  // Session management
  static saveSession(session: UserSession): void {
    if (!this.isClient()) return

    try {
      const sessions = this.getAllSessions()
      sessions[session.sessionId] = session
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  static getSession(sessionId: string): UserSession | null {
    if (!this.isClient()) return null

    try {
      const sessions = this.getAllSessions()
      return sessions[sessionId] || null
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  static getAllSessions(): Record<string, UserSession> {
    if (!this.isClient()) return {}

    try {
      const sessions = localStorage.getItem(SESSIONS_KEY)
      return sessions ? JSON.parse(sessions) : {}
    } catch (error) {
      console.error('Failed to get sessions:', error)
      return {}
    }
  }

  // User management
  static saveUser(user: User): void {
    if (!this.isClient()) return

    try {
      const users = this.getAllUsers()
      users[user.userId] = user
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  static getUser(userId: string): User | null {
    if (!this.isClient()) return null

    try {
      const users = this.getAllUsers()
      return users[userId] || null
    } catch (error) {
      console.error('Failed to get user:', error)
      return null
    }
  }

  static getAllUsers(): Record<string, User> {
    if (!this.isClient()) return {}

    try {
      const users = localStorage.getItem(USERS_KEY)
      return users ? JSON.parse(users) : {}
    } catch (error) {
      console.error('Failed to get users:', error)
      return {}
    }
  }

  // Clear all data (for development)
  static clearAll(): void {
    if (!this.isClient()) return

    localStorage.removeItem(SESSIONS_KEY)
    localStorage.removeItem(USERS_KEY)
  }
}
