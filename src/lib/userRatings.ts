import { readJson, writeJson } from './storage'

const STORAGE_KEY = 'tmo-user-ratings'

type RatingsMap = Record<string, number>

export function getUserRating(mangaId: string): number | null {
  const map = readJson<RatingsMap>(STORAGE_KEY, {})
  const v = map[mangaId]
  return typeof v === 'number' ? v : null
}

export function setUserRating(mangaId: string, stars: number): void {
  const map = readJson<RatingsMap>(STORAGE_KEY, {})
  map[mangaId] = Math.min(5, Math.max(1, Math.round(stars)))
  writeJson(STORAGE_KEY, map)
}

export function getDisplayRating(
  mangaId: string,
  baseRating: number,
  ratingCount: number,
): { average: number; count: number } {
  const user = getUserRating(mangaId)
  if (user == null) return { average: baseRating, count: ratingCount }
  const count = ratingCount + 1
  const average =
    Math.round(((baseRating * ratingCount + user) / count) * 10) / 10
  return { average, count }
}
