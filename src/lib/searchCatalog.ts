import { catalog } from '../data/catalog'
import { getCategoryLabel } from '../data/categoryLabels'
import type { Manga } from '../types/manga'

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function searchCatalog(query: string): Manga[] {
  const q = normalize(query.trim())
  if (!q) return catalog

  return catalog.filter((m) => {
    const haystack = [
      m.title,
      m.author,
      m.synopsis,
      m.extendedSynopsis,
      ...m.categories.map((c) => getCategoryLabel(c)),
    ]
      .join(' ')
      .toLowerCase()

    return q.split(/\s+/).every((word) => haystack.includes(word))
  })
}
