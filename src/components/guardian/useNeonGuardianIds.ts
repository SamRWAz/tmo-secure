import { useId } from 'react'

/** IDs únicos por instancia para gradientes SVG (evita colisiones). */
export function useNeonGuardianIds() {
  const safe = useId().replace(/:/g, '')
  const p = `ng${safe}`
  return {
    body: `${p}-body`,
    neon: `${p}-neon`,
    threat: `${p}-threat`,
  }
}
