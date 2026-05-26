import type { MangaCategory } from '../types/manga'

export const MANGA_CATEGORY_LABELS: Record<MangaCategory, string> = {
  action: 'Acción',
  comedy: 'Comedia',
  drama: 'Drama',
  romance: 'Romance',
  fantasy: 'Fantasía',
  thriller: 'Thriller',
  'sci-fi': 'Ciencia ficción',
  'slice-of-life': 'Slice of life',
}

export function getCategoryLabel(category: MangaCategory): string {
  return MANGA_CATEGORY_LABELS[category]
}
