import { getCategoryLabel } from '../data/categoryLabels'
import type { MangaCategory } from '../types/manga'

const GENRE_KEYWORDS: { category: MangaCategory; patterns: RegExp[] }[] = [
  {
    category: 'action',
    patterns: [
      /\baccion\b/,
      /\bacción\b/,
      /\bpelea/,
      /\bpeleas/,
      /\bbatall/,
      /\bluch/,
      /\bcombate/,
      /\bsamurai/,
      /\bcarrera/,
      /\badrenalina/,
      /\bshonen/,
      /\bgolpe/,
      /\bexplosiv/,
    ],
  },
  {
    category: 'romance',
    patterns: [
      /\bromance\b/,
      /\bamor\b/,
      /\bpareja/,
      /\benamor/,
      /\bromantic/,
      /\bship\b/,
      /\bcorazon/,
      /\bcorazón/,
    ],
  },
  {
    category: 'comedy',
    patterns: [/\bcomedia\b/, /\brisa\b/, /\bhumor/, /\bgracios/, /\bchist/],
  },
  {
    category: 'drama',
    patterns: [/\bdrama\b/, /\bdramatic/, /\bemocion/, /\bemoción/],
  },
  {
    category: 'fantasy',
    patterns: [
      /\bfantasi/,
      /\bfantasía/,
      /\bmagia\b/,
      /\bmagico/,
      /\bmágic/,
      /\bdimension/,
    ],
  },
  {
    category: 'thriller',
    patterns: [
      /\bthriller\b/,
      /\bmisterio/,
      /\bsuspense/,
      /\bterror\b/,
      /\bparanoi/,
      /\bdetective/,
    ],
  },
  {
    category: 'sci-fi',
    patterns: [
      /\bsci-?fi\b/,
      /\bciencia ficcion/,
      /\bciencia ficción/,
      /\bespacial/,
      /\bmecha\b/,
      /\bnano/,
      /\bciber/,
      /\bfutur/,
      /\brobot/,
    ],
  },
  {
    category: 'slice-of-life',
    patterns: [
      /\bslice\b/,
      /\bcotidian/,
      /\bvida diaria/,
      /\btranquil/,
      /\bcalma\b/,
      /\bverano\b/,
    ],
  },
]

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function extractCategoriesFromText(text: string): MangaCategory[] {
  const lower = normalizeText(text)
  const found: MangaCategory[] = []
  for (const { category, patterns } of GENRE_KEYWORDS) {
    if (patterns.some((p) => p.test(lower))) found.push(category)
  }
  return found
}

export function isRecommendationRequest(text: string): boolean {
  const lower = normalizeText(text)
  return (
    /\b(recomienda|recomiéndame|recomendame|recomiendame|suger|sugiéreme|sugerime|que leo|qué leo|dame algo|busco algo|quiero leer|algo de|pasame|pásame|necesito)\b/.test(
      lower,
    ) ||
    /\b(muestrame|muéstrame|ensename|enséñame|tienes|tenes|hay algo)\b.*\b(manga|titulo|título|serie)\b/.test(
      lower,
    ) ||
    /\balgo\b.*\b(de|sobre)\b/.test(lower)
  )
}

export function isHistoryRequest(text: string): boolean {
  const lower = normalizeText(text)
  return /\b(historial|historia|lei|leí|leido|leído|ultimo|último|reciente)\b/.test(lower)
}

export function formatCategoryList(categories: MangaCategory[]): string {
  return categories.map(getCategoryLabel).join(', ')
}
