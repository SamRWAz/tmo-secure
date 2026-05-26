import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getReadingHistory,
  recordChapterRead as persistChapterRead,
  type ReadingHistoryEntry,
} from '../lib/readingHistory'
import { useUser } from './UserContext'

type ReadingHistoryContextValue = {
  history: ReadingHistoryEntry[]
  hasHistory: boolean
  recordChapterRead: (
    mangaId: string,
    chapterId: string,
    chapterNumber: number,
    chapterTitle: string,
  ) => void
  refreshHistory: () => void
}

const ReadingHistoryContext = createContext<ReadingHistoryContextValue | null>(null)

export function ReadingHistoryProvider({ children }: { children: ReactNode }) {
  const { userId, hasConsent, isLoggedIn } = useUser()
  const storageId = isLoggedIn && hasConsent ? userId : 'guest'
  const [version, setVersion] = useState(0)

  const history = useMemo(
    () => getReadingHistory(storageId),
    [storageId, version],
  )

  const refreshHistory = useCallback(() => {
    setVersion((v) => v + 1)
  }, [])

  const recordChapterRead = useCallback(
    (
      mangaId: string,
      chapterId: string,
      chapterNumber: number,
      chapterTitle: string,
    ) => {
      persistChapterRead(mangaId, chapterId, chapterNumber, chapterTitle, storageId)
      setVersion((v) => v + 1)
    },
    [storageId],
  )

  const value = useMemo(
    () => ({
      history,
      hasHistory: history.length > 0,
      recordChapterRead,
      refreshHistory,
    }),
    [history, recordChapterRead, refreshHistory],
  )

  return (
    <ReadingHistoryContext.Provider value={value}>
      {children}
    </ReadingHistoryContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReadingHistory() {
  const ctx = useContext(ReadingHistoryContext)
  if (!ctx) {
    throw new Error('useReadingHistory debe usarse dentro de ReadingHistoryProvider')
  }
  return ctx
}
