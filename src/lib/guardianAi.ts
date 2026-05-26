import { getCategoryLabel } from '../data/categoryLabels'
import { catalog } from '../data/catalog'
import { getSpeciesMeta, type GuardianSpecies } from '../data/guardianSpecies'
import type { GuardianAutonomy } from '../context/GuardianContext'
import type { Manga } from '../types/manga'
import {
  extractCategoriesFromText,
  formatCategoryList,
  isHistoryRequest,
  isRecommendationRequest,
  normalizeText,
} from './guardianIntent'
import {
  getRecentHistory,
  getTopCategoriesFromHistory,
  recommendByCategories,
  recommendMangaForUser,
} from './readingHistory'

export type ChatMessage = {
  id: string
  role: 'user' | 'guardian'
  text: string
  createdAt: number
}

export type MangaSuggestion = {
  id: string
  title: string
}

export type GuardianReply = {
  text: string
  suggestions: MangaSuggestion[]
}

export type AskGuardianOptions = {
  userName?: string
  userId?: string
}

const API_KEY = import.meta.env.VITE_GUARDIAN_AI_API_KEY as string | undefined
const API_URL =
  (import.meta.env.VITE_GUARDIAN_AI_API_URL as string | undefined) ||
  'https://api.openai.com/v1/chat/completions'
const API_MODEL =
  (import.meta.env.VITE_GUARDIAN_AI_MODEL as string | undefined) || 'gpt-4o-mini'

function catalogForPrompt(): string {
  return catalog
    .map(
      (m) =>
        `- id:${m.id} | ${m.title} | géneros: ${m.categories.map(getCategoryLabel).join(', ')} | nota: ${m.baseRating}`,
    )
    .join('\n')
}

function buildSystemPrompt(
  species: GuardianSpecies,
  autonomy: GuardianAutonomy,
  opts: AskGuardianOptions = {},
): string {
  const meta = getSpeciesMeta(species)
  const uid = opts.userId ?? 'guest'
  const history = getRecentHistory(5, uid)
  const cats = getTopCategoriesFromHistory(3, uid)
  const nameLine = opts.userName ? `El usuario se llama ${opts.userName}.` : ''

  const historyLine =
    history.length > 0
      ? `Historial reciente del usuario:\n${history.map((h) => `  • ${h.mangaTitle}, cap. ${h.chapterNumber} (${h.chapterTitle})`).join('\n')}`
      : 'El usuario NO tiene historial todavía (lista vacía).'

  const catLine =
    cats.length > 0
      ? `Géneros que más lee: ${cats.map(getCategoryLabel).join(', ')}.`
      : ''

  return `Eres el Guardian de TMO Secure (${meta.emoji} ${meta.label}). Español, tono protector y cercano.
${nameLine}
Autonomía: ${autonomy}.
${historyLine}
${catLine}

CATÁLOGO DISPONIBLE (solo estos títulos existen):
${catalogForPrompt()}

REGLAS:
- Si piden un género (acción, romance, etc.), recomienda SOLO del catálogo que encaje.
- Si piden recomendación sin historial, sugiere por género o los mejor valorados del catálogo.
- Menciona títulos entre comillas «».
- Respuestas concisas (máx. 4 oraciones salvo listas de recomendaciones).
- Seguridad: redirecciones, scroll rápido = descargas falsas bloqueadas.`
}

function formatMangaList(mangas: Manga[], intro: string): GuardianReply {
  if (mangas.length === 0) {
    return {
      text: `${intro} No encontré títulos con ese perfil en el catálogo demo.`,
      suggestions: [],
    }
  }
  const list = mangas
    .map(
      (m) =>
        `«${m.title}» (${m.categories.map(getCategoryLabel).join(', ')}) — ${m.baseRating}★`,
    )
    .join('\n• ')
  return {
    text: `${intro}\n\n• ${list}\n\nToca un título abajo para abrir la ficha.`,
    suggestions: mangas.map((m) => ({ id: m.id, title: m.title })),
  }
}

function replyByGenreRequest(
  userText: string,
  species: GuardianSpecies,
): GuardianReply | null {
  const meta = getSpeciesMeta(species)
  const genres = extractCategoriesFromText(userText)
  const wantsRec = isRecommendationRequest(userText)

  if (genres.length === 0 && !wantsRec) return null

  if (genres.length > 0) {
    const picks = recommendByCategories(genres, 4)
    const label = formatCategoryList(genres)
    return formatMangaList(
      picks,
      `${meta.emoji} Buscaste algo de ${label}. Esto encaja bien en la demo:`,
    )
  }

  return null
}

function localReply(
  userText: string,
  species: GuardianSpecies,
  autonomy: GuardianAutonomy,
  opts: AskGuardianOptions = {},
): GuardianReply {
  const meta = getSpeciesMeta(species)
  const lower = normalizeText(userText)
  const uid = opts.userId ?? 'guest'
  const history = getRecentHistory(5, uid)
  const cats = getTopCategoriesFromHistory(3, uid)
  const name = opts.userName

  const genreReply = replyByGenreRequest(userText, species)
  if (genreReply) return genreReply

  if (/hola|buenas|hey|miau|guau|saludos/i.test(lower)) {
    const histHint =
      history.length > 0
        ? ` Ya llevas ${history.length} capítulo(s) en tu historial.`
        : ' Tu historial está vacío: abre un capítulo y lo registro al instante.'
    const named = name ? `${name}, ` : ''
    return {
      text: `${meta.emoji} ${named}${meta.idleGreeting}${histHint} Pídeme «recomiéndame algo de acción» o «¿qué leí?».`,
      suggestions: [],
    }
  }

  if (isRecommendationRequest(lower) || isRecommendationRequest(userText)) {
    const genres = extractCategoriesFromText(userText)
    if (genres.length > 0) {
      return replyByGenreRequest(userText, species)!
    }

    if (history.length === 0) {
      const popular = recommendByCategories(['action', 'romance', 'fantasy'], 3)
      return formatMangaList(
        popular,
        `${meta.emoji} Aún no has leído nada: tu historial está vacío. Mientras empiezas, estos son buenos puntos de partida:`,
      )
    }

    const recs = recommendMangaForUser(4, uid)
    const taste =
      cats.length > 0
        ? ` Por lo que leíste, creo que te gusta ${cats.map(getCategoryLabel).join(' y ')}.`
        : ''
    const named = name ? `${name}, ` : ''
    return formatMangaList(
      recs,
      `${meta.emoji} ${named}basado en tu historial:${taste}`,
    )
  }

  if (isHistoryRequest(userText)) {
    if (history.length === 0) {
      return {
        text: 'Tu historial está vacío. Entra a cualquier manga, abre un capítulo en el lector y lo guardaré aquí automáticamente.',
        suggestions: [],
      }
    }
    const lines = history
      .map((h) => `«${h.mangaTitle}» — cap. ${h.chapterNumber}: ${h.chapterTitle}`)
      .join('\n• ')
    return {
      text: `Esto es lo último que registré:\n\n• ${lines}`,
      suggestions: history.slice(0, 3).map((h) => ({ id: h.mangaId, title: h.mangaTitle })),
    }
  }

  if (/segur|redirect|redirec|descarga|anuncio|popup|virus|malware/i.test(lower)) {
    const autonomyHint =
      autonomy === 'caution'
        ? ' En precaución máxima reacciono antes al scroll rápido.'
        : autonomy === 'explore'
          ? ' En exploración soy un poco más permisivo, pero bloqueo descargas raras.'
          : ' En modo equilibrado balanceo alertas y lectura fluida.'
    return {
      text: `Protejo tu lectura frente a redirecciones falsas, enlaces “espejo” y descargas que saltan al hacer scroll muy rápido.${autonomyHint}`,
      suggestions: [],
    }
  }

  if (/valor|rating|estrella|nota/i.test(lower)) {
    return {
      text: 'En cada ficha puedes ver la nota de la comunidad y dejar la tuya. Eso me ayuda a afinar recomendaciones.',
      suggestions: [],
    }
  }

  if (/busca|encontr|search/i.test(lower)) {
    return {
      text: 'Usa la barra de búsqueda del header: filtra por título, autor o género (acción, romance, etc.).',
      suggestions: [],
    }
  }

  for (const m of catalog) {
    const titleLower = m.title.toLowerCase()
    if (lower.includes(titleLower) || lower.includes(m.id.replace(/-/g, ' '))) {
      return {
        text: `«${m.title}» (${m.categories.map(getCategoryLabel).join(', ')}): ${m.synopsis} Valoración: ${m.baseRating}/5.`,
        suggestions: [{ id: m.id, title: m.title }],
      }
    }
  }

  const genres = extractCategoriesFromText(userText)
  if (genres.length > 0) {
    return replyByGenreRequest(userText, species)!
  }

  return {
    text: `${meta.emoji} Puedo recomendarte por género («algo de acción/romance»), revisar tu historial o explicar la seguridad al leer. ¿Qué prefieres?`,
    suggestions: [],
  }
}

export async function askGuardian(
  userText: string,
  species: GuardianSpecies,
  autonomy: GuardianAutonomy,
  history: ChatMessage[],
  opts: AskGuardianOptions = {},
): Promise<GuardianReply> {
  const trimmed = userText.trim()
  if (!trimmed) return { text: '¿Me repites? No capté el mensaje.', suggestions: [] }

  if (API_KEY?.trim()) {
    try {
      const messages = [
        { role: 'system' as const, content: buildSystemPrompt(species, autonomy, opts) },
        ...history
          .filter((m) => m.id !== 'welcome')
          .slice(-10)
          .map((m) => ({
            role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
            content: m.text,
          })),
        { role: 'user' as const, content: trimmed },
      ]

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: API_MODEL,
          messages,
          max_tokens: 400,
          temperature: 0.7,
        }),
      })

      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[]
      }
      const text = data.choices?.[0]?.message?.content?.trim()
      if (text) {
        const genres = extractCategoriesFromText(trimmed)
        const suggestions =
          genres.length > 0
            ? recommendByCategories(genres, 4).map((m) => ({
                id: m.id,
                title: m.title,
              }))
            : recommendMangaForUser(3, opts.userId ?? 'guest').map((m) => ({
                id: m.id,
                title: m.title,
              }))
        return { text, suggestions }
      }
    } catch {
      /* fallback local */
    }
  }

  return localReply(trimmed, species, autonomy, opts)
}

export function isGuardianAiCloudEnabled(): boolean {
  return Boolean(API_KEY?.trim())
}
