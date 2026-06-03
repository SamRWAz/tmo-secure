/** Géneros / categorías de exploración del catálogo (etiquetas de obra). */
export type MangaCategory =
  | 'action'
  | 'comedy'
  | 'drama'
  | 'romance'
  | 'fantasy'
  | 'thriller'
  | 'sci-fi'
  | 'slice-of-life'

/** Etiquetas que el Guardian usa para sugerir filtros (sin lógica de servidor). */
export type GuardianTag =
  | 'verified-safe'
  | 'low-ads'
  | 'action'
  | 'romance'
  | 'slice'
  | 'fantasy'
  | 'thriller'
  | 'mecha'
  | 'supernatural'
  | 'medical-sf'
  | 'simulated-risk'

export type Chapter = {
  id: string
  number: number
  title: string
  /** Simula enlaces contaminados con redirecciones agresivas */
  unsafeRoute: boolean
}

export type Manga = {
  id: string
  title: string
  author: string
  /** Resumen corto para tarjetas y búsqueda */
  synopsis: string
  /** Sinopsis ampliada en la ficha del manga */
  extendedSynopsis: string
  /** Valoración media de la comunidad demo (1–5) */
  baseRating: number
  /** Número de valoraciones simuladas */
  ratingCount: number
  coverUrl: string
  categories: MangaCategory[]
  /** Señales curadas por el Guardian para filtrar en el cliente */
  guardianTags: GuardianTag[]
  chapters: Chapter[]
  /** El autor requiere compensación — se necesita suscripción o tokens para leer */
  requiresTokens?: boolean
  /** Contenido para mayores de 18 — oculto en inicio/recomendaciones */
  isAdult?: boolean
}
