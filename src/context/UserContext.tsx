import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearReadingHistory,
  deleteAllLocalUserData,
} from '../lib/userData'
import { readJson, writeJson } from '../lib/storage'
import { getReadingHistory } from '../lib/readingHistory'

const PROFILE_KEY = 'tmo-user-profile'

export type UserProfile = {
  id: string
  name: string
  consentAt: number
}

type UserContextValue = {
  user: UserProfile | null
  isLoggedIn: boolean
  hasConsent: boolean
  userId: string
  login: (name: string) => { ok: boolean; error?: string }
  register: (name: string, consent: boolean) => { ok: boolean; error?: string }
  updateName: (name: string) => { ok: boolean; error?: string }
  deleteReadingHistory: () => void
  deleteAllData: () => void
  logout: () => void
}

const UserContext = createContext<UserContextValue | null>(null)

const GUEST_ID = 'guest'

function loadProfile(): UserProfile | null {
  return readJson<UserProfile | null>(PROFILE_KEY, null)
}

function saveProfile(profile: UserProfile | null) {
  writeJson(PROFILE_KEY, profile)
}

function migrateGuestHistoryToUser(userId: string) {
  const guest = getReadingHistory(GUEST_ID)
  if (guest.length === 0) return
  const userHistory = getReadingHistory(userId)
  if (userHistory.length > 0) return
  writeJson(`tmo-reading-history-${userId}`, guest.slice(0, 40))
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => loadProfile())

  const login = useCallback((name: string): { ok: boolean; error?: string } => {
    const trimmed = name.trim()
    if (!trimmed) return { ok: false, error: 'Escribe tu nombre.' }
    const existing = loadProfile()
    if (!existing) {
      return {
        ok: false,
        error: 'No hay cuenta. Regístrate y acepta el uso de datos.',
      }
    }
    if (existing.name.toLowerCase() !== trimmed.toLowerCase()) {
      return { ok: false, error: 'Nombre no coincide con la cuenta guardada.' }
    }
    setUser(existing)
    return { ok: true }
  }, [])

  const register = useCallback((name: string, consent: boolean) => {
    const trimmed = name.trim()
    if (!trimmed) return { ok: false, error: 'Escribe tu nombre.' }
    if (!consent) {
      return {
        ok: false,
        error: 'Debes aceptar el uso de tu nombre e historial de lectura para continuar.',
      }
    }
    const profile: UserProfile = {
      id: `u-${Date.now()}`,
      name: trimmed,
      consentAt: Date.now(),
    }
    saveProfile(profile)
    setUser(profile)
    migrateGuestHistoryToUser(profile.id)
    return { ok: true }
  }, [])

  const updateName = useCallback(
    (name: string): { ok: boolean; error?: string } => {
      const trimmed = name.trim()
      if (!trimmed) return { ok: false, error: 'El nombre no puede estar vacío.' }
      const current = loadProfile()
      if (!current) return { ok: false, error: 'No hay sesión activa.' }
      const updated: UserProfile = { ...current, name: trimmed }
      saveProfile(updated)
      setUser(updated)
      return { ok: true }
    },
    [],
  )

  const deleteReadingHistory = useCallback(() => {
    const id = loadProfile()?.id
    if (id) clearReadingHistory(id)
    clearReadingHistory(GUEST_ID)
  }, [])

  const deleteAllData = useCallback(() => {
    const id = loadProfile()?.id ?? GUEST_ID
    deleteAllLocalUserData(id)
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    saveProfile(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      hasConsent: Boolean(user?.consentAt),
      userId: user?.id ?? GUEST_ID,
      login,
      register,
      updateName,
      deleteReadingHistory,
      deleteAllData,
      logout,
    }),
    [user, login, register, updateName, deleteReadingHistory, deleteAllData, logout],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider')
  return ctx
}
