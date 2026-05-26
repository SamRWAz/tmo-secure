import type { ChatMessage } from './guardianAi'
import { readJson, writeJson } from './storage'

function chatKey(userId: string) {
  return `tmo-guardian-chat-${userId}`
}

export function loadChatMessages(userId: string): ChatMessage[] | null {
  const data = readJson<ChatMessage[] | null>(chatKey(userId), null)
  return data && data.length > 0 ? data : null
}

export function saveChatMessages(userId: string, messages: ChatMessage[]): void {
  const toSave = messages.filter((m) => m.id !== 'welcome').slice(-40)
  if (toSave.length === 0) return
  writeJson(chatKey(userId), toSave)
}

export function clearChatMessages(userId: string): void {
  writeJson(chatKey(userId), [])
}
