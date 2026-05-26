import { clearChatMessages } from './chatStorage'
import { readJson, writeJson } from './storage'

const HISTORY_PREFIX = 'tmo-reading-history'
const RATINGS_KEY = 'tmo-user-ratings'
const COMMENTS_KEY = 'tmo-user-comments'
const SECURITY_KEY = 'tmo-security-log'
const PROFILE_KEY = 'tmo-user-profile'

export function clearReadingHistory(userId: string): void {
  writeJson(`${HISTORY_PREFIX}-${userId}`, [])
}

export function clearAllReadingHistories(): void {
  clearReadingHistory('guest')
  if (typeof localStorage === 'undefined') return
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(HISTORY_PREFIX)) keys.push(k)
  }
  for (const k of keys) localStorage.removeItem(k)
}

export function clearUserRatings(): void {
  writeJson(RATINGS_KEY, {})
}

export function clearUserComments(): void {
  writeJson(COMMENTS_KEY, {})
}

export function clearSecurityLog(): void {
  writeJson(SECURITY_KEY, [])
}

export function clearUserChat(userId: string): void {
  clearChatMessages(userId)
}

export function deleteAllLocalUserData(userId: string): void {
  clearReadingHistory(userId)
  clearReadingHistory('guest')
  clearUserRatings()
  clearUserComments()
  clearSecurityLog()
  clearUserChat(userId)
  clearUserChat('guest')
  writeJson(PROFILE_KEY, null)
}

export function getDataSummary(userId: string) {
  const history = readJson<unknown[]>(`${HISTORY_PREFIX}-${userId}`, [])
  const guestHistory = readJson<unknown[]>(`${HISTORY_PREFIX}-guest`, [])
  const ratings = readJson<Record<string, number>>(RATINGS_KEY, {})
  const comments = readJson<Record<string, unknown[]>>(COMMENTS_KEY, {})
  const security = readJson<unknown[]>(SECURITY_KEY, [])
  const commentCount = Object.values(comments).reduce((n, arr) => n + arr.length, 0)

  return {
    historyCount: history.length,
    guestHistoryCount: guestHistory.length,
    ratingsCount: Object.keys(ratings).length,
    commentsCount: commentCount,
    securityEventsCount: security.length,
  }
}
