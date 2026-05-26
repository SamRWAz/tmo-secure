import type { Manga } from '../types/manga'

export type GuardianFilterId =
  | 'all'
  | 'green-lane'
  | 'low-ads'
  | 'pulse-action'
  | 'soft-heart'
  | 'mind-fantasy'
  | 'shadow-thrill'
  | 'demo-risk'

export type GuardianFilter = {
  id: GuardianFilterId
  label: string
  /** Microcopy en voz del Guardian (tooltip / aria) */
  voice: string
  matches: (m: Manga) => boolean
}

const hasTag =
  (tag: Manga['guardianTags'][number]) =>
  (m: Manga) =>
    m.guardianTags.includes(tag)

const hasAny =
  (...tags: Manga['guardianTags'][number][]) =>
  (m: Manga) =>
    tags.some((t) => m.guardianTags.includes(t))

export const GUARDIAN_FILTERS: GuardianFilter[] = [
  {
    id: 'all',
    label: 'Catálogo completo',
    voice:
      'Sin filtros extra: muestro todo lo que ya pasó por mi primer barrido de consistencia.',
    matches: () => true,
  },
  {
    id: 'green-lane',
    label: 'Carril verde TMO',
    voice:
      'Solo obras con sello verified-safe: rutas más predecibles y menos sorpresas tóxicas.',
    matches: hasTag('verified-safe'),
  },
  {
    id: 'low-ads',
    label: 'Baja fricción',
    voice:
      'Priorizo títulos con perfil low-ads: menos trampas visuales típicas de agregadores.',
    matches: hasTag('low-ads'),
  },
  {
    id: 'pulse-action',
    label: 'Pulso & movimiento',
    voice: 'Adrenalina controlada: acción, mecha o calle con trazos firmes.',
    matches: hasAny('action', 'mecha'),
  },
  {
    id: 'soft-heart',
    label: 'Corazón suave',
    voice: 'Romance y slice con foco en lectura pausada; buen combo nocturno.',
    matches: hasAny('romance', 'slice'),
  },
  {
    id: 'mind-fantasy',
    label: 'Mente & fantasía',
    voice:
      'Magia, ciencia-ficción médica, misterio y lo inexplicable… siempre bajo mi monitor de tabs.',
    matches: hasAny('fantasy', 'supernatural', 'medical-sf'),
  },
  {
    id: 'shadow-thrill',
    label: 'Sombra noir',
    voice: 'Thriller y tensiones urbanas; activo alertas extra de redirección.',
    matches: hasTag('thriller'),
  },
  {
    id: 'demo-risk',
    label: 'Cap. demo inseguro',
    voice:
      'Solo para practicar: incluye capítulos marcados como inseguros en la simulación.',
    matches: hasTag('simulated-risk'),
  },
]

export function getGuardianFilter(id: GuardianFilterId | string) {
  return GUARDIAN_FILTERS.find((f) => f.id === id) ?? GUARDIAN_FILTERS[0]
}
