import type { MangaComment } from '../lib/userComments'

/** Comentarios demo precargados por título */
export const SEED_COMMENTS: Record<string, Omit<MangaComment, 'id' | 'createdAt'>[]> = {
  'neon-samurai': [
    {
      author: 'KiraNeo',
      text: 'El capítulo 3 con la ruta “sucia” es justo lo que el Guardian debería bloquear. Muy meta.',
    },
    {
      author: 'Lluvia_88',
      text: 'Arte increíble en las calles lluviosas. ¿Habrá más arcos corporativos?',
    },
  ],
  'guardian-code': [
    {
      author: 'DevMiau',
      text: 'Me encanta la IA doméstica. Se siente como la mascota de TMO Secure hecha manga.',
    },
  ],
  'ink-memories': [
    {
      author: 'CartaPerdida',
      text: 'Romance suave sin forzar. La imprenta es un escenario perfecto.',
    },
    {
      author: 'HanaReads',
      text: 'Lloré en el capítulo 2. Muy recomendable si te gusta el drama tranquilo.',
    },
  ],
  'steel-orbit': [
    {
      author: 'MechaFan',
      text: 'Acción orbital limpia, sin pop-ups en la demo. El Guardian cumple.',
    },
  ],
  'summer-haze': [
    {
      author: 'CostaSur',
      text: 'Vibes de verano eterno. Ideal para leer de noche con calma.',
    },
  ],
}

export function getSeedComments(mangaId: string): MangaComment[] {
  const seeds = SEED_COMMENTS[mangaId] ?? []
  const base = Date.now() - seeds.length * 86_400_000
  return seeds.map((s, i) => ({
    ...s,
    id: `seed-${mangaId}-${i}`,
    createdAt: base + i * 86_400_000,
  }))
}
