export type GuardianSpecies = 'cat' | 'dog' | 'fox' | 'owl' | 'raccoon' | 'bunny'

export const GUARDIAN_SPECIES_OPTIONS: {
  id: GuardianSpecies
  label: string
  emoji: string
  /** Saludo cuando todo está tranquilo */
  idleGreeting: string
}[] = [
  {
    id: 'cat',
    label: 'Gato táctico',
    emoji: '🐱',
    idleGreeting: '¡Miau! Todo está despejado, disfruta tu lectura sin miedo.',
  },
  {
    id: 'dog',
    label: 'Perra de firewall',
    emoji: '🐶',
    idleGreeting: 'Guau-guau. Circuito revisado: puedes seguir leyendo con calma.',
  },
  {
    id: 'fox',
    label: 'Zorro proxy',
    emoji: '🦊',
    idleGreeting: 'Astutos los anuncios, pero yo más. Ruta limpia por ahora.',
  },
  {
    id: 'owl',
    label: 'Búho nocturno',
    emoji: '🦉',
    idleGreeting: 'Cú-cuu. Vigilancia nocturna activa; nada sospechoso en el visor.',
  },
  {
    id: 'raccoon',
    label: 'Mapache root',
    emoji: '🦝',
    idleGreeting: '¿Basura digital? Ya la saqué del camino. Sigue leyendo.',
  },
  {
    id: 'bunny',
    label: 'Conejo encriptado',
    emoji: '🐰',
    idleGreeting: 'Hop-hop. Salté un par de trampas; todo suave por aquí.',
  },
]

export function getSpeciesMeta(id: GuardianSpecies) {
  return GUARDIAN_SPECIES_OPTIONS.find((s) => s.id === id) ?? GUARDIAN_SPECIES_OPTIONS[0]
}

const REDIRECT_HEADLINES = [
  'Nuh uh.',
  'Bloqueado.',
  'Ni modo.',
  'Eso no va.',
]

export function pickRedirectHeadline() {
  return REDIRECT_HEADLINES[Math.floor(Math.random() * REDIRECT_HEADLINES.length)]
}
