import { readJson, writeJson } from './storage'

const STORAGE_KEY = 'tmo-user-comments'

export type MangaComment = {
  id: string
  author: string
  text: string
  createdAt: number
  isUser?: boolean
}

type CommentsByManga = Record<string, MangaComment[]>

export function getCommentsForManga(mangaId: string): MangaComment[] {
  const map = readJson<CommentsByManga>(STORAGE_KEY, {})
  return map[mangaId] ?? []
}

export function addComment(mangaId: string, author: string, text: string): MangaComment {
  const map = readJson<CommentsByManga>(STORAGE_KEY, {})
  const comment: MangaComment = {
    id: `u-${Date.now()}`,
    author: author.trim() || 'Lector anónimo',
    text: text.trim(),
    createdAt: Date.now(),
    isUser: true,
  }
  map[mangaId] = [comment, ...(map[mangaId] ?? [])]
  writeJson(STORAGE_KEY, map)
  return comment
}
