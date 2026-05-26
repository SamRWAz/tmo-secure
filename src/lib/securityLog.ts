import { readJson, writeJson } from './storage'

const STORAGE_KEY = 'tmo-security-log'

export type SecurityEventType = 'download-blocked' | 'redirect-blocked'

export type SecurityEvent = {
  id: string
  type: SecurityEventType
  label: string
  detail?: string
  at: number
}

export function getSecurityEvents(): SecurityEvent[] {
  return readJson<SecurityEvent[]>(STORAGE_KEY, [])
}

export function addSecurityEvent(
  type: SecurityEventType,
  label: string,
  detail?: string,
): SecurityEvent {
  const event: SecurityEvent = {
    id: `${type}-${Date.now()}`,
    type,
    label,
    detail,
    at: Date.now(),
  }
  const events = [event, ...getSecurityEvents()].slice(0, 50)
  writeJson(STORAGE_KEY, events)
  return event
}
