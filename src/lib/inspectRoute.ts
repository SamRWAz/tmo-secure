import type { Chapter } from '../types/manga'

export type InspectChapterResult = 'safe' | 'sanitized'

/**
 * Simula inspección de red: si el capítulo trae redirect “tóxico” de demo,
 * devolvemos `sanitized` (el Guardian neutraliza la redirección y deja el contenido).
 */
export function inspectChapterRoute(chapter: Chapter): Promise<InspectChapterResult> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(chapter.unsafeRoute ? 'sanitized' : 'safe')
    }, 1100)
  })
}
