export type GuardianSpecies =
  | 'cat'
  | 'dog'
  | 'fox'
  | 'owl'
  | 'raccoon'
  | 'bunny'
  | 'wolf'
  | 'dragon'
  | 'bear'
  | 'penguin'
  | 'shark'
  | 'robot'
  | 'ninja'
  | 'panda'
  | 'ghost'

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
    label: 'Perro de firewall',
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
  {
    id: 'wolf',
    label: 'Lobo guardián',
    emoji: '🐺',
    idleGreeting: 'Aúllido verificado. El perímetro digital está despejado, sigue leyendo.',
  },
  {
    id: 'dragon',
    label: 'Dragón firewall',
    emoji: '🐉',
    idleGreeting: 'Mis llamas consumen las amenazas antes de que lleguen a ti. Lectura segura.',
  },
  {
    id: 'bear',
    label: 'Oso encriptado',
    emoji: '🐻',
    idleGreeting: 'Grr. Revisé cada rincón del servidor. Puedes leer tranquilo.',
  },
  {
    id: 'penguin',
    label: 'Pingüino Linux',
    emoji: '🐧',
    idleGreeting: 'Kernel sin amenazas detectadas. Ruta limpia, código abierto y seguro.',
  },
  {
    id: 'shark',
    label: 'Tiburón de red',
    emoji: '🦈',
    idleGreeting: 'Patrullé el fondo de la red. No encontré nada malicioso. Buena lectura.',
  },
  {
    id: 'robot',
    label: 'Robot centinela',
    emoji: '🤖',
    idleGreeting: 'ESCANEO COMPLETADO. Amenazas: 0. Estado: óptimo. Procede con la lectura.',
  },
  {
    id: 'ninja',
    label: 'Ninja digital',
    emoji: '🥷',
    idleGreeting: 'Sombra limpia. Neutralicé las trampas en silencio. Nadie lo vio venir.',
  },
  {
    id: 'panda',
    label: 'Panda cifrado',
    emoji: '🐼',
    idleGreeting: 'Revisé el bambú digital y todo está seguro. Buen momento para leer.',
  },
  {
    id: 'ghost',
    label: 'Fantasma proxy',
    emoji: '👻',
    idleGreeting: 'Travesé los servidores sin dejar rastro. Tu sesión de lectura es invisible.',
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
