/**
 * Session Management
 * Simple in-memory session storage for authenticated users
 * 
 * PHASE 2 MVP: Uses in-memory Map (sessions lost on restart)
 * PHASE 3 UPGRADE: Move to Redis or database for persistence
 */

interface Session {
  walletAddress: string
  createdAt: number
  expiresAt: number
}

// In-memory storage (will be upgraded to Redis/DB later)
const sessions = new Map<string, Session>()

// Session expires after 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

/**
 * Creates a new session for an authenticated wallet
 * 
 * @param walletAddress - Verified wallet address
 * @returns sessionId - Unique session identifier to be stored in cookie
 */
export function createSession(walletAddress: string): string {
  const sessionId = crypto.randomUUID()
  const now = Date.now()
  
  const session: Session = {
    walletAddress: walletAddress.toLowerCase(), // Normalize to lowercase
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
  }
  
  sessions.set(sessionId, session)
  
  return sessionId
}

/**
 * Verifies a session and returns the wallet address if valid
 * 
 * @param sessionId - Session ID from cookie
 * @returns Wallet address if session is valid, null otherwise
 */
export function verifySession(sessionId: string): string | null {
  const session = sessions.get(sessionId)
  
  if (!session) {
    return null
  }
  
  // Check if session expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId)
    return null
  }
  
  return session.walletAddress
}

/**
 * Deletes/invalidates a session
 * Used for logout functionality
 * 
 * @param sessionId - Session ID to delete
 */
export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId)
}

/**
 * Cleanup expired sessions (internal maintenance)
 * Call this periodically to prevent memory leaks
 */
export function cleanupExpiredSessions(): void {
  const now = Date.now()
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId)
    }
  }
}

// Run cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredSessions, 60 * 60 * 1000)
}

