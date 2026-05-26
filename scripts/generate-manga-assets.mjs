import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const coversDir = path.join(root, 'public', 'manga', 'covers')
const panelsDir = path.join(root, 'public', 'manga', 'panels')

const mangas = [
  { id: 'neon-samurai', title: 'Neon Samurai Zero', c1: '#0c4a6e', c2: '#22d3ee' },
  { id: 'guardian-code', title: 'Guardian Code', c1: '#1e1b4b', c2: '#a78bfa' },
  { id: 'void-library', title: 'Void Library', c1: '#312e81', c2: '#6366f1' },
  { id: 'cat-signal', title: 'Cat Signal', c1: '#713f12', c2: '#fbbf24' },
  { id: 'steel-orbit', title: 'Steel Orbit', c1: '#1e293b', c2: '#94a3b8' },
  { id: 'ink-memories', title: 'Ink Memories', c1: '#831843', c2: '#f9a8d4' },
  { id: 'phantom-detective', title: 'Phantom Detective', c1: '#1c1917', c2: '#78716c' },
  { id: 'summer-haze', title: 'Summer Haze', c1: '#0e7490', c2: '#fde68a' },
  { id: 'drift-kings', title: 'Drift Kings', c1: '#7f1d1d', c2: '#f97316' },
  { id: 'echo-garden', title: 'Echo Garden', c1: '#14532d', c2: '#4ade80' },
  { id: 'cyber-healer', title: 'Cyber Healer 9', c1: '#134e4a', c2: '#2dd4bf' },
  { id: 'ghost-band', title: 'Ghost Band', c1: '#4c1d95', c2: '#e879f9' },
]

function coverSvg({ title, c1, c2 }) {
  const short = title.length > 22 ? `${title.slice(0, 20)}…` : title
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="500" height="700" fill="url(#bg)"/>
  <rect x="24" y="24" width="452" height="652" rx="20" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <text x="250" y="320" text-anchor="middle" fill="rgba(255,255,255,0.95)" font-family="system-ui,sans-serif" font-size="32" font-weight="700">${short}</text>
  <text x="250" y="370" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="system-ui,sans-serif" font-size="14" letter-spacing="4">TMO SECURE</text>
</svg>`
}

function panelSvg(index, c1, c2) {
  const bars = Array.from({ length: 4 + (index % 3) }, (_, i) => {
    const y = 80 + i * 110
    const w = 280 + ((index + i) % 4) * 40
    return `<rect x="60" y="${y}" width="${w}" height="72" rx="8" fill="rgba(255,255,255,0.12)"/>`
  }).join('\n  ')
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" role="img">
  <defs>
    <linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1100" fill="url(#p)"/>
  ${bars}
  <text x="400" y="1020" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="system-ui,sans-serif" font-size="18">Demo · panel ${index}</text>
</svg>`
}

fs.mkdirSync(coversDir, { recursive: true })
fs.mkdirSync(panelsDir, { recursive: true })

for (const m of mangas) {
  fs.writeFileSync(path.join(coversDir, `${m.id}.svg`), coverSvg(m), 'utf8')
}

const panelColors = [
  ['#0f172a', '#334155'],
  ['#1e1b4b', '#4338ca'],
  ['#134e4a', '#0d9488'],
  ['#4a044e', '#a21caf'],
  ['#431407', '#c2410c'],
  ['#172554', '#2563eb'],
]

for (let i = 0; i < 6; i++) {
  const [c1, c2] = panelColors[i]
  const name = `manga-panel-${String(i + 1).padStart(2, '0')}.svg`
  fs.writeFileSync(path.join(panelsDir, name), panelSvg(i + 1, c1, c2), 'utf8')
}

console.log(`Generated ${mangas.length} covers and 6 panels in public/manga/`)
