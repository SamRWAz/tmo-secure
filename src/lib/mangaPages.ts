/** Viñetas generadas (assets locales) que rota el visor según manga/capítulo */
export const GUARDIAN_PANEL_URLS = [
  '/manga/panels/manga-panel-01.svg',
  '/manga/panels/manga-panel-02.svg',
  '/manga/panels/manga-panel-03.svg',
  '/manga/panels/manga-panel-04.svg',
  '/manga/panels/manga-panel-05.svg',
  '/manga/panels/manga-panel-06.svg',
] as const

function mixIndex(mangaId: string, chapterId: string, pageIndex: number) {
  const s = `${mangaId}|${chapterId}|p${pageIndex}`
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % GUARDIAN_PANEL_URLS.length
}

export function buildChapterPanelUrls(
  mangaId: string,
  chapterId: string,
  count: number,
) {
  return Array.from({ length: count }, (_, i) => {
    const idx = mixIndex(mangaId, chapterId, i)
    return GUARDIAN_PANEL_URLS[idx]
  })
}
