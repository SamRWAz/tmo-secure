import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  getSpeciesMeta,
  pickRedirectHeadline,
  type GuardianSpecies,
} from '../data/guardianSpecies'
import { addSecurityEvent, getSecurityEvents, type SecurityEvent } from '../lib/securityLog'

export type { GuardianSpecies } from '../data/guardianSpecies'

export type GuardianAutonomy = 'caution' | 'balanced' | 'explore'

type RedirectToast = { headline: string; subline: string }

type GuardianContextValue = {
  autonomy: GuardianAutonomy
  setAutonomy: (v: GuardianAutonomy) => void
  species: GuardianSpecies
  setSpecies: (v: GuardianSpecies) => void
  threatActive: boolean
  setThreatActive: (v: boolean) => void
  bunkerOpen: boolean
  setBunkerOpen: (v: boolean) => void
  blockedDownloadsThisChapter: number
  registerBlockedDownload: () => void
  resetChapterStats: () => void
  scrollVelocityThreshold: number
  statusMessage: string
  setStatusMessage: (m: string) => void
  redirectToast: RedirectToast | null
  /** Aviso junto al FAB: redirect neutralizada, sin impedir la lectura */
  flashRedirectSanitized: (chapterHint?: string) => void
  securityEvents: SecurityEvent[]
  refreshSecurityEvents: () => void
}

const GuardianContext = createContext<GuardianContextValue | null>(null)

function thresholdForAutonomy(a: GuardianAutonomy) {
  switch (a) {
    case 'caution':
      return 2.1
    case 'balanced':
      return 2.85
    case 'explore':
      return 3.6
    default:
      return 2.85
  }
}

export function GuardianProvider({ children }: { children: ReactNode }) {
  const [autonomy, setAutonomy] = useState<GuardianAutonomy>('balanced')
  const [species, setSpecies] = useState<GuardianSpecies>('cat')
  const [threatActive, setThreatActive] = useState(false)
  const [bunkerOpen, setBunkerOpen] = useState(false)
  const [blockedDownloadsThisChapter, setBlocked] = useState(0)
  const [statusMessage, setStatusMessage] = useState(
    () => getSpeciesMeta('cat').idleGreeting,
  )
  const [redirectToast, setRedirectToast] = useState<RedirectToast | null>(null)
  const [securityEvents, setSecurityEvents] = useState(() => getSecurityEvents())
  const toastTimerRef = useRef<number | null>(null)

  const refreshSecurityEvents = useCallback(() => {
    setSecurityEvents(getSecurityEvents())
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  const flashRedirectSanitized = useCallback((chapterHint?: string) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    const headline = pickRedirectHeadline()
    const subline = chapterHint
      ? `Mini redirección eliminada. (${chapterHint})`
      : 'Mini redirección eliminada. Te quedas aquí: sin salto forzado a otra pestaña.'
    setRedirectToast({ headline, subline })
    addSecurityEvent('redirect-blocked', headline, subline)
    refreshSecurityEvents()
    toastTimerRef.current = window.setTimeout(() => {
      setRedirectToast(null)
      toastTimerRef.current = null
    }, 4200)
  }, [refreshSecurityEvents])

  const registerBlockedDownload = useCallback(() => {
    setBlocked((n) => n + 1)
    setThreatActive(true)
    addSecurityEvent(
      'download-blocked',
      'Descarga sospechosa bloqueada',
      'Scroll rápido en el lector — patrón de descarga encubierta.',
    )
    refreshSecurityEvents()
    setStatusMessage(
      'Detecté un intento de descarga encubierta. Lo detuve y dejé constancia en el búnker.',
    )
  }, [refreshSecurityEvents])

  const resetChapterStats = useCallback(() => {
    setBlocked(0)
    setThreatActive(false)
    setStatusMessage(getSpeciesMeta(species).idleGreeting)
  }, [species])

  const scrollVelocityThreshold = useMemo(
    () => thresholdForAutonomy(autonomy),
    [autonomy],
  )

  const value = useMemo(
    () => ({
      autonomy,
      setAutonomy,
      species,
      setSpecies,
      threatActive,
      setThreatActive,
      bunkerOpen,
      setBunkerOpen,
      blockedDownloadsThisChapter,
      registerBlockedDownload,
      resetChapterStats,
      scrollVelocityThreshold,
      statusMessage,
      setStatusMessage,
      redirectToast,
      flashRedirectSanitized,
      securityEvents,
      refreshSecurityEvents,
    }),
    [
      autonomy,
      species,
      threatActive,
      bunkerOpen,
      blockedDownloadsThisChapter,
      registerBlockedDownload,
      resetChapterStats,
      scrollVelocityThreshold,
      statusMessage,
      redirectToast,
      flashRedirectSanitized,
      securityEvents,
      refreshSecurityEvents,
    ],
  )

  return (
    <GuardianContext.Provider value={value}>{children}</GuardianContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook acoplado al provider
export function useGuardian() {
  const ctx = useContext(GuardianContext)
  if (!ctx) throw new Error('useGuardian debe usarse dentro de GuardianProvider')
  return ctx
}
