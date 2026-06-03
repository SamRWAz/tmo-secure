import { catalog } from '../data/catalog'
import type { Manga, MangaCategory } from '../types/manga'
import { readJson, writeJson } from './storage'

const STORAGE_PREFIX = 'tmo-reading-history'

function storageKey(userId = 'guest') {
  return `${STORAGE_PREFIX}-${userId}`
}

export type ReadingHistoryEntry = {
  mangaId: string
  mangaTitle: string
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  readAt: number
}

export function getReadingHistory(userId = 'guest'): ReadingHistoryEntry[] {
  return readJson<ReadingHistoryEntry[]>(storageKey(userId), [])
}

export function hasReadingHistory(userId = 'guest'): boolean {
  return getReadingHistory(userId).length > 0
}

export function recordChapterRead(
  mangaId: string,
  chapterId: string,
  chapterNumber: number,
  chapterTitle: string,
  userId = 'guest',
): void {
  const manga = catalog.find((m) => m.id === mangaId)
  if (!manga) return

  const entry: ReadingHistoryEntry = {
    mangaId,
    mangaTitle: manga.title,
    chapterId,
    chapterNumber,
    chapterTitle,
    readAt: Date.now(),
  }

  const history = getReadingHistory(userId).filter(
    (h) => !(h.mangaId === mangaId && h.chapterId === chapterId),
  )
  history.unshift(entry)
  writeJson(storageKey(userId), history.slice(0, 40))
}

export function getRecentHistory(limit = 5, userId = 'guest'): ReadingHistoryEntry[] {
  return getReadingHistory(userId).slice(0, limit)
}

export function getTopCategoriesFromHistory(
  limit = 3,
  userId = 'guest',
): MangaCategory[] {
  const counts = new Map<MangaCategory, number>()
  for (const entry of getReadingHistory(userId)) {
    const manga = catalog.find((m) => m.id === entry.mangaId)
    if (!manga) continue
    for (const cat of manga.categories) {
      counts.set(cat, (counts.get(cat) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([cat]) => cat)
}

/** Catalogo sin contenido adulto — usado en todas las recomendaciones */
const safeForRecommendation = catalog.filter((m) => !m.isAdult)

/** Recomienda por generos pedidos (p. ej. "algo de accion") */
export function recommendByCategories(
  categories: MangaCategory[],
  limit = 4,
): Manga[] {
  if (categories.length === 0) return []

  const scored = safeForRecommendation.map((manga) => {
    const matches = categories.filter((c) => manga.categories.includes(c)).length
    return { manga, matches }
  })

  return scored
    .filter((s) => s.matches > 0)
    .sort((a, b) => {
      if (b.matches !== a.matches) return b.matches - a.matches
      return b.manga.baseRating - a.manga.baseRating
    })
    .slice(0, limit)
    .map((s) => s.manga)
}

/** Solo si hay historial; si no, devuelve [] */
export function recommendMangaForUser(limit = 4, userId = 'guest'): Manga[] {
  const history = getReadingHistory(userId)
  if (history.length === 0) return []

  const readMangaIds = new Set(history.map((h) => h.mangaId))
  const topCats = getTopCategoriesFromHistory(3, userId)

  const scored = safeForRecommendation.map((manga) => {
    let score = 0
    for (const cat of manga.categories) {
      const idx = topCats.indexOf(cat)
      if (idx >= 0) score += 3 - idx
    }
    if (!readMangaIds.has(manga.id)) score += 2
    if (manga.guardianTags.includes('verified-safe')) score += 0.5
    return { manga, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.manga)
}
