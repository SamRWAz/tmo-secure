import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearReadingHistory, deleteAllLocalUserData } from '../lib/userData'
import { readJson, writeJson } from '../lib/storage'
import { getReadingHistory } from '../lib/readingHistory'

const PROFILE_KEY = 'tmo-user-profile'
const AGE_VERIFIED_KEY = 'tmo-age-verified'

/** Demo "hash" — base64 simple, no es seguridad real */
function simpleHash(pw: string): string {
  return 'h:' + btoa(encodeURIComponent(pw))
}
function checkPassword(pw: string, hash: string): boolean {
  try {
    return simpleHash(pw) === hash
  } catch {
    return false
  }
}

export type UserProfile = {
  id: string
  name: string
  email: string
  passwordHash: string
  consentAt: number
  tokens: number
  isSubscribed: boolean
  subscribedUntil: number
  unlockedChapters: string[]
}

type UserContextValue = {
  user: UserProfile | null
  isLoggedIn: boolean
  hasConsent: boolean
  userId: string
  isActiveSubscription: boolean
  ageVerified: boolean
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (
    name: string,
    email: string,
    password: string,
    consent: boolean,
  ) => { ok: boolean; error?: string }
  updateName: (name: string) => { ok: boolean; error?: string }
  deleteReadingHistory: () => void
  deleteAllData: () => void
  logout: () => void
  addTokens: (count: number) => void
  spendToken: (chapterId: string) => { ok: boolean; error?: string }
  isChapterUnlocked: (chapterId: string) => boolean
  subscribe: () => void
  verifyAge: () => void
}

const UserContext = createContext<UserContextValue | null>(null)
const GUEST_ID = 'guest'

function loadProfile(): UserProfile | null {
  const raw = readJson<unknown>(PROFILE_KEY, null)
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  // Require new format with email — old profiles need re-registration
  if (!r.email) return null
  return raw as UserProfile
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
  const [ageVerified, setAgeVerifiedState] = useState(
    () => localStorage.getItem(AGE_VERIFIED_KEY) === 'true',
  )

  const login = useCallback((email: string, password: string): { ok: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) return { ok: false, error: 'Escribe tu email.' }
    if (!password) return { ok: false, error: 'Escribe tu contraseña.' }
    const existing = loadProfile()
    if (!existing) {
      return { ok: false, error: 'No hay cuenta registrada en este dispositivo. Regístrate primero.' }
    }
    if (existing.email !== trimmedEmail) {
      return { ok: false, error: 'Email o contraseña incorrectos.' }
    }
    if (!checkPassword(password, existing.passwordHash)) {
      return { ok: false, error: 'Email o contraseña incorrectos.' }
    }
    setUser(existing)
    return { ok: true }
  }, [])

  const register = useCallback(
    (
      name: string,
      email: string,
      password: string,
      consent: boolean,
    ): { ok: boolean; error?: string } => {
      const trimmedName = name.trim()
      const trimmedEmail = email.trim().toLowerCase()
      if (!trimmedName) return { ok: false, error: 'Escribe tu nombre.' }
      if (!trimmedEmail || !trimmedEmail.includes('@'))
        return { ok: false, error: 'Email inválido.' }
      if (password.length < 6)
        return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
      if (!consent)
        return { ok: false, error: 'Debes aceptar el uso de datos para continuar.' }

      const profile: UserProfile = {
        id: `u-${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        passwordHash: simpleHash(password),
        consentAt: Date.now(),
        tokens: 5,
        isSubscribed: false,
        subscribedUntil: 0,
        unlockedChapters: [],
      }
      saveProfile(profile)
      setUser(profile)
      migrateGuestHistoryToUser(profile.id)
      return { ok: true }
    },
    [],
  )

  const updateName = useCallback((name: string): { ok: boolean; error?: string } => {
    const trimmed = name.trim()
    if (!trimmed) return { ok: false, error: 'El nombre no puede estar vacío.' }
    const current = loadProfile()
    if (!current) return { ok: false, error: 'No hay sesión activa.' }
    const updated = { ...current, name: trimmed }
    saveProfile(updated)
    setUser(updated)
    return { ok: true }
  }, [])

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

  const addTokens = useCallback((count: number) => {
    const current = loadProfile()
    if (!current) return
    const updated = { ...current, tokens: current.tokens + count }
    saveProfile(updated)
    setUser(updated)
  }, [])

  const spendToken = useCallback((chapterId: string): { ok: boolean; error?: string } => {
    const current = loadProfile()
    if (!current) return { ok: false, error: 'Inicia sesión para leer contenido premium.' }
    if (current.unlockedChapters.includes(chapterId)) return { ok: true }
    if (current.tokens < 1)
      return { ok: false, error: 'No tienes tokens. Mira un anuncio o suscríbete.' }
    const updated = {
      ...current,
      tokens: current.tokens - 1,
      unlockedChapters: [...current.unlockedChapters, chapterId],
    }
    saveProfile(updated)
    setUser(updated)
    return { ok: true }
  }, [])

  const isChapterUnlocked = useCallback(
    (chapterId: string): boolean => {
      return user?.unlockedChapters.includes(chapterId) ?? false
    },
    [user],
  )

  const subscribe = useCallback(() => {
    const current = loadProfile()
    if (!current) return
    const updated = {
      ...current,
      isSubscribed: true,
      subscribedUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    }
    saveProfile(updated)
    setUser(updated)
  }, [])

  const verifyAge = useCallback(() => {
    localStorage.setItem(AGE_VERIFIED_KEY, 'true')
    setAgeVerifiedState(true)
  }, [])

  // Captura el tiempo en el mount (lazy initializer) para evitar Date.now() en cada render
  const [mountTime] = useState(() => Date.now())
  const isActiveSubscription = Boolean(
    user?.isSubscribed && (user?.subscribedUntil ?? 0) > mountTime,
  )

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      hasConsent: Boolean(user?.consentAt),
      userId: user?.id ?? GUEST_ID,
      isActiveSubscription,
      ageVerified,
      login,
      register,
      updateName,
      deleteReadingHistory,
      deleteAllData,
      logout,
      addTokens,
      spendToken,
      isChapterUnlocked,
      subscribe,
      verifyAge,
    }),
    [
      user,
      isActiveSubscription,
      ageVerified,
      login,
      register,
      updateName,
      deleteReadingHistory,
      deleteAllData,
      logout,
      addTokens,
      spendToken,
      isChapterUnlocked,
      subscribe,
      verifyAge,
    ],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider')
  return ctx
}
