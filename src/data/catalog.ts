import type { Manga } from '../types/manga'
import { applyMangaMeta } from './mangaMeta'

/** Portadas en public/manga/covers/ (PNG principal, SVG respaldo) */
export const coverAsset = (id: string) => ({
  png: `/manga/covers/${id}.png`,
  svg: `/manga/covers/${id}.svg`,
})
const cover = (id: string) => coverAsset(id).png

const rawCatalog = [
  {
    id: 'neon-samurai',
    title: 'Neon Samurai Zero',
    author: 'K. Tanaka',
    synopsis:
      'Un ronin cibernético patrulla calles lluviosas mientras corporaciones ocultan la verdad sobre el núcleo de la ciudad.',
    coverUrl: cover('neon-samurai'),
    categories: ['action', 'sci-fi', 'thriller'],
    guardianTags: ['action', 'thriller', 'low-ads', 'simulated-risk'],
    chapters: [
      { id: 'c1', number: 1, title: 'Lluvia ácida', unsafeRoute: false },
      { id: 'c2', number: 2, title: 'Espejo roto', unsafeRoute: false },
      {
        id: 'c3',
        number: 3,
        title: 'Enlace espejo (simulado inseguro)',
        unsafeRoute: true,
      },
      { id: 'c4', number: 4, title: 'Búnker 7', unsafeRoute: false },
      { id: 'c5', number: 5, title: 'Último tren a Neo-Kyō', unsafeRoute: false },
    ],
  },
  {
    id: 'guardian-code',
    title: 'Guardian Code',
    author: 'M. Sato',
    synopsis:
      'Una IA doméstica aprende a distinguir entre ayuda real y trampas de anuncios. Inspiración directa para TMO Secure.',
    coverUrl: cover('guardian-code'),
    categories: ['comedy', 'sci-fi', 'slice-of-life'],
    guardianTags: ['verified-safe', 'low-ads', 'slice', 'supernatural'],
    chapters: [
      { id: 'g1', number: 1, title: 'Arranque limpio', unsafeRoute: false },
      { id: 'g2', number: 2, title: 'Patrón oscuro', unsafeRoute: false },
      { id: 'g3', number: 3, title: 'Kernel felino', unsafeRoute: false },
    ],
  },
  {
    id: 'void-library',
    title: 'Void Library',
    author: 'L. Ortega',
    synopsis:
      'Cada libro abre una dimensión; el protagonista debe cerrar portales antes de que consuman la biblioteca.',
    coverUrl: cover('void-library'),
    categories: ['fantasy', 'thriller'],
    guardianTags: ['fantasy', 'supernatural', 'thriller', 'simulated-risk'],
    chapters: [
      { id: 'v1', number: 1, title: 'Índice prohibido', unsafeRoute: false },
      {
        id: 'v2',
        number: 2,
        title: 'Capítulo con redirección falsa',
        unsafeRoute: true,
      },
      { id: 'v3', number: 3, title: 'Cierre de ciclo', unsafeRoute: false },
      { id: 'v4', number: 4, title: 'Archivo cero', unsafeRoute: false },
    ],
  },
  {
    id: 'cat-signal',
    title: 'Cat Signal',
    author: 'R. Vega',
    synopsis:
      'Un gato callejero emite señales que solo ciertos lectores pueden ver. Comedia ligera con toques de thriller.',
    coverUrl: cover('cat-signal'),
    categories: ['comedy', 'slice-of-life'],
    guardianTags: ['verified-safe', 'low-ads', 'slice', 'supernatural'],
    chapters: [
      { id: 'k1', number: 1, title: 'Primer maullido', unsafeRoute: false },
      { id: 'k2', number: 2, title: 'Noche sin anuncios', unsafeRoute: false },
      { id: 'k3', number: 3, title: 'Señal en la azotea', unsafeRoute: false },
    ],
  },
  {
    id: 'steel-orbit',
    title: 'Steel Orbit',
    author: 'A. Kuroda',
    synopsis:
      'Pilotos adolescentes defienden la órbita terrestre frente a un enemigo que jamás muestra su forma completa.',
    coverUrl: cover('steel-orbit'),
    categories: ['action', 'sci-fi'],
    guardianTags: ['mecha', 'action', 'low-ads', 'verified-safe'],
    chapters: [
      { id: 'so1', number: 1, title: 'Lanzamiento', unsafeRoute: false },
      { id: 'so2', number: 2, title: 'Punto Lagrange', unsafeRoute: false },
      { id: 'so3', number: 3, title: 'Blindaje frágil', unsafeRoute: false },
    ],
  },
  {
    id: 'ink-memories',
    title: 'Ink Memories',
    author: 'H. Mori',
    synopsis:
      'Dos excompañeros de secundaria se reencuentran en una pequeña imprenta que guarda cartas nunca enviadas.',
    coverUrl: cover('ink-memories'),
    categories: ['romance', 'drama'],
    guardianTags: ['romance', 'slice', 'verified-safe', 'low-ads'],
    chapters: [
      { id: 'im1', number: 1, title: 'Tinta fresca', unsafeRoute: false },
      { id: 'im2', number: 2, title: 'Pliegue doble', unsafeRoute: false },
    ],
  },
  {
    id: 'phantom-detective',
    title: 'Phantom Detective',
    author: 'J. Navarro',
    synopsis:
      'Un detective solo puede ver huellas de crímenes que “aún no ocurrieron”. Cada caso lo acerca a su propio borrado.',
    coverUrl: cover('phantom-detective'),
    categories: ['thriller', 'drama'],
    guardianTags: ['thriller', 'verified-safe', 'low-ads'],
    chapters: [
      { id: 'pd1', number: 1, title: 'Caso -1', unsafeRoute: false },
      { id: 'pd2', number: 2, title: 'Sombra paralela', unsafeRoute: false },
      { id: 'pd3', number: 3, title: 'Testigo invisible', unsafeRoute: false },
    ],
  },
  {
    id: 'summer-haze',
    title: 'Summer Haze',
    author: 'Y. Nishio',
    synopsis:
      'Un verano eterno en un pueblo costero donde el reloj avanza distinto para cada habitante.',
    coverUrl: cover('summer-haze'),
    categories: ['romance', 'slice-of-life', 'drama'],
    guardianTags: ['slice', 'romance', 'verified-safe', 'low-ads'],
    chapters: [
      { id: 'sh1', number: 1, title: 'Marea alta', unsafeRoute: false },
      { id: 'sh2', number: 2, title: 'Helado de limón', unsafeRoute: false },
    ],
  },
  {
    id: 'drift-kings',
    title: 'Drift Kings: Midnight',
    author: 'T. Reyes',
    synopsis:
      'Carreras clandestinas con apuestas digitales; cada victoria desbloquea un archivo cifrado en la nube.',
    coverUrl: cover('drift-kings'),
    categories: ['action', 'thriller'],
    guardianTags: ['action', 'thriller', 'simulated-risk'],
    chapters: [
      { id: 'dk1', number: 1, title: 'Salida en falso', unsafeRoute: false },
      {
        id: 'dk2',
        number: 2,
        title: 'Mirror link (demo insegura)',
        unsafeRoute: true,
      },
      { id: 'dk3', number: 3, title: 'Curva cerrada', unsafeRoute: false },
    ],
  },
  {
    id: 'echo-garden',
    title: 'Echo Garden',
    author: 'S. Ibarra',
    synopsis:
      'Un jardín botánico donde las plantas repiten en voz baja el último secreto que escucharon.',
    coverUrl: cover('echo-garden'),
    categories: ['fantasy', 'slice-of-life'],
    guardianTags: ['fantasy', 'supernatural', 'verified-safe', 'low-ads'],
    chapters: [
      { id: 'eg1', number: 1, title: 'Semilla susurrante', unsafeRoute: false },
      { id: 'eg2', number: 2, title: 'Invernadero 4', unsafeRoute: false },
    ],
  },
  {
    id: 'cyber-healer',
    title: 'Cyber Healer 9',
    author: 'E. Costa',
    synopsis:
      'Médicos con nanobots éticos debaten hasta dónde curar sin convertirse en vigilantes corporativos.',
    coverUrl: cover('cyber-healer'),
    categories: ['sci-fi', 'drama', 'thriller'],
    guardianTags: ['medical-sf', 'thriller', 'verified-safe', 'low-ads'],
    chapters: [
      { id: 'ch1', number: 1, title: 'Consentimiento informado', unsafeRoute: false },
      { id: 'ch2', number: 2, title: 'Protocolo gatuno', unsafeRoute: false },
    ],
  },
  {
    id: 'ghost-band',
    title: 'Ghost Band Session',
    author: 'N. Park',
    synopsis:
      'Una banda de ensayo solo puede tocar covers de canciones que nadie recuerda haber existido.',
    coverUrl: cover('ghost-band'),
    categories: ['comedy', 'fantasy', 'slice-of-life'],
    guardianTags: ['supernatural', 'slice', 'verified-safe', 'low-ads'],
    chapters: [
      { id: 'gb1', number: 1, title: 'Primera nota fantasma', unsafeRoute: false },
      { id: 'gb2', number: 2, title: 'Amplificador sellado', unsafeRoute: false },
    ],
  },
] as const satisfies Omit<
  Manga,
  'extendedSynopsis' | 'baseRating' | 'ratingCount'
>[]

export const catalog: Manga[] = rawCatalog.map((m) => applyMangaMeta(m))

export function getManga(id: string) {
  return catalog.find((m) => m.id === id)
}

export function getChapter(mangaId: string, chapterId: string) {
  const manga = getManga(mangaId)
  return manga?.chapters.find((c) => c.id === chapterId)
}

export function getAdjacentChapter(
  mangaId: string,
  chapterId: string,
  dir: 'prev' | 'next',
) {
  const manga = getManga(mangaId)
  if (!manga) return undefined
  const idx = manga.chapters.findIndex((c) => c.id === chapterId)
  if (idx < 0) return undefined
  const next = dir === 'next' ? manga.chapters[idx + 1] : manga.chapters[idx - 1]
  return next
}

/** Catálogo filtrado por el criterio del Guardian */
export function filterCatalogByGuardian(
  predicate: (m: Manga) => boolean,
): Manga[] {
  return catalog.filter(predicate)
}
