import { motion } from 'framer-motion'
import type { GuardianSpecies } from '../../data/guardianSpecies'
import { useNeonGuardianIds } from './useNeonGuardianIds'

/* ─── Paleta neon única por especie ─────────────────────────────────────── */
const NEON: Record<string, { n1: string; n2: string; glow: string }> = {
  cat:     { n1: '#67e8f9', n2: '#0891b2', glow: '34,211,238' },
  dog:     { n1: '#7dd3fc', n2: '#2563eb', glow: '125,211,252' },
  fox:     { n1: '#fcd34d', n2: '#d97706', glow: '252,211,77' },
  owl:     { n1: '#c4b5fd', n2: '#7c3aed', glow: '196,181,253' },
  raccoon: { n1: '#5eead4', n2: '#0d9488', glow: '94,234,212' },
  bunny:   { n1: '#f9a8d4', n2: '#be185d', glow: '249,168,212' },
  wolf:    { n1: '#a5b4fc', n2: '#4338ca', glow: '165,180,252' },
  dragon:  { n1: '#fb923c', n2: '#c2410c', glow: '251,146,60' },
  bear:    { n1: '#6ee7b7', n2: '#059669', glow: '110,231,183' },
  penguin: { n1: '#38bdf8', n2: '#0369a1', glow: '56,189,248' },
  shark:   { n1: '#2dd4bf', n2: '#0d9488', glow: '45,212,191' },
  robot:   { n1: '#bef264', n2: '#4d7c0f', glow: '190,242,100' },
  ninja:   { n1: '#fca5a5', n2: '#dc2626', glow: '252,165,165' },
  panda:   { n1: '#e2e8f0', n2: '#64748b', glow: '226,232,240' },
  ghost:   { n1: '#e879f9', n2: '#a21caf', glow: '232,121,249' },
}

function nc(sp: string) { return NEON[sp] ?? NEON.cat }

function svgGlow(threat: boolean, glow = '34,211,238') {
  return threat
    ? 'drop-shadow(0 0 12px rgba(244,114,182,0.8)) drop-shadow(0 0 4px rgba(251,113,133,0.9))'
    : `drop-shadow(0 0 11px rgba(${glow},0.7)) drop-shadow(0 0 3px rgba(${glow},0.5))`
}

/* ─── Defs con gradientes por especie ───────────────────────────────────── */
function Defs({
  ids,
  n1 = '#67e8f9',
  n2 = '#0891b2',
}: {
  ids: ReturnType<typeof useNeonGuardianIds>
  n1?: string
  n2?: string
}) {
  return (
    <defs>
      <linearGradient id={ids.body} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="55%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0c1222" />
      </linearGradient>
      <linearGradient id={ids.neon} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={n1} />
        <stop offset="50%" stopColor={n2} />
        <stop offset="100%" stopColor={n2} />
      </linearGradient>
      <linearGradient id={ids.threat} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="40%" stopColor="#e879f9" />
        <stop offset="100%" stopColor="#fb7185" />
      </linearGradient>
    </defs>
  )
}

/* ─── Ojos parpadeantes ──────────────────────────────────────────────────── */
function BlinkingEyes({
  cxL, cxR, cy, rx = 4.2, ry = 5, threatActive, ids,
}: {
  cxL: number; cxR: number; cy: number; rx?: number; ry?: number
  threatActive: boolean; ids: ReturnType<typeof useNeonGuardianIds>
}) {
  return (
    <motion.g
      animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 1] }}
      transition={{ duration: 3.1, repeat: Infinity, times: [0, 0.52, 0.56, 0.6, 0.68, 0.82, 1] }}
      style={{ transformOrigin: `${(cxL + cxR) / 2}px ${cy}px` }}
    >
      <ellipse cx={cxL} cy={cy} rx={rx} ry={ry}
        fill={threatActive ? `url(#${ids.threat})` : '#020617'}
        stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`} strokeWidth="1.1" />
      <ellipse cx={cxR} cy={cy} rx={rx} ry={ry}
        fill={threatActive ? `url(#${ids.threat})` : '#020617'}
        stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`} strokeWidth="1.1" />
      {!threatActive && (
        <>
          <circle cx={cxL + 1.1} cy={cy - 1.2} r="1.35" fill="#22d3ee" opacity="0.95" />
          <circle cx={cxR + 1.1} cy={cy - 1.2} r="1.35" fill="#22d3ee" opacity="0.95" />
        </>
      )}
    </motion.g>
  )
}

/* ─── Chip de collar ─────────────────────────────────────────────────────── */
function CollarChip({ ids }: { ids: ReturnType<typeof useNeonGuardianIds> }) {
  return (
    <g>
      <rect x="24" y="48" width="16" height="6" rx="2"
        fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.85" />
      <rect x="29" y="49.5" width="6" height="3" rx="1" fill="#22d3ee" opacity="0.4" />
    </g>
  )
}

/* ─── Picos de amenaza ───────────────────────────────────────────────────── */
function ThreatSpikes({ threatActive }: { threatActive: boolean }) {
  if (!threatActive) return null
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.line key={i} x1={18 + i * 7} y1="20" x2={16 + i * 7} y2="10"
          stroke="#fb7185" strokeWidth="1.2" strokeLinecap="round"
          animate={{ y2: [10, 6, 10] }}
          transition={{ duration: 0.28, repeat: Infinity, delay: i * 0.04 }} />
      ))}
    </motion.g>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* ESPECIES ORIGINALES (con colores únicos)                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function CatNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('cat')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(6deg) brightness(1.08)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1.1, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      <motion.path d="M18 22 L22 8 L30 20 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.25"
        style={{ transformOrigin: '24px 20px' }} animate={{ rotate: threatActive ? [-6, 4, -5] : [-3, 3, -2] }}
        transition={{ duration: threatActive ? 0.35 : 2.4, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.path d="M46 22 L42 8 L34 20 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.25"
        style={{ transformOrigin: '40px 20px' }} animate={{ rotate: threatActive ? [6, -4, 5] : [3, -3, 2] }}
        transition={{ duration: threatActive ? 0.35 : 2.6, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.ellipse cx="32" cy="34" rx="18" ry="16" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2"
        animate={threatActive ? { scaleX: [1, 1.04, 1], scaleY: [1, 0.96, 1] } : {}}
        transition={{ duration: 0.45, repeat: threatActive ? Infinity : 0 }} />
      <path d="M10 36 H22 M10 40 H22 M42 36 H54 M42 40 H54" stroke="rgb(34 211 238 / 0.5)" strokeWidth="0.85" strokeLinecap="round" />
      <BlinkingEyes cxL={26} cxR={38} cy={32} threatActive={threatActive} ids={ids} />
      <path d="M30 38 L32 41 L34 38 Z" fill="rgb(244 114 182 / 0.9)" stroke="rgb(34 211 238 / 0.55)" strokeWidth="0.5" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function DogNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('dog')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(8deg) brightness(1.06)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1.05, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      <motion.path d="M14 26 Q10 6 24 22" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" strokeLinejoin="round"
        style={{ transformOrigin: '18px 22px' }} animate={{ rotate: threatActive ? [8, -2, 6] : [4, -1, 3] }}
        transition={{ duration: threatActive ? 0.4 : 2.2, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.path d="M50 26 Q54 6 40 22" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" strokeLinejoin="round"
        style={{ transformOrigin: '46px 22px' }} animate={{ rotate: threatActive ? [-8, 2, -6] : [-4, 1, -3] }}
        transition={{ duration: threatActive ? 0.42 : 2.35, repeat: Infinity, repeatType: 'mirror' }} />
      <ellipse cx="32" cy="36" rx="17" ry="15" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      <ellipse cx="32" cy="42" rx="10" ry="7" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9" opacity="0.85" />
      <path d="M8 34 H18 M8 38 H18 M46 34 H56 M46 38 H56" stroke="rgb(34 211 238 / 0.45)" strokeWidth="0.75" strokeLinecap="round" />
      <BlinkingEyes cxL={25} cxR={39} cy={33} threatActive={threatActive} ids={ids} />
      <ellipse cx="32" cy="40" rx="3.2" ry="2.2" fill="rgb(244 114 182 / 0.85)" stroke={`url(#${ids.neon})`} strokeWidth="0.4" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function FoxNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('fox')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(10deg) saturate(1.15)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      <motion.path d="M20 14 L28 28 L16 26 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.15"
        style={{ transformOrigin: '22px 22px' }} animate={{ rotate: threatActive ? [-5, 4, -4] : [-2, 2, -1.5] }}
        transition={{ duration: threatActive ? 0.32 : 2.5, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.path d="M44 14 L36 28 L48 26 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.15"
        style={{ transformOrigin: '42px 22px' }} animate={{ rotate: threatActive ? [5, -4, 4] : [2, -2, 1.5] }}
        transition={{ duration: threatActive ? 0.34 : 2.6, repeat: Infinity, repeatType: 'mirror' }} />
      <path d="M32 18 L46 34 L40 50 L24 50 L18 34 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M32 38 L38 46 L26 46 Z" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9" />
      <path d="M12 36 L22 40 M52 36 L42 40" stroke={`${c.n1}80`} strokeWidth="0.8" strokeLinecap="round" />
      <BlinkingEyes cxL={26} cxR={38} cy={31} threatActive={threatActive} ids={ids} />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function OwlNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('owl')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'brightness(1.12) contrast(1.05)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1.15, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      <motion.path d="M22 12 L26 22 L18 20 Z M42 12 L38 22 L46 20 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1" strokeLinejoin="round"
        animate={{ y: threatActive ? [0, -1, 0] : [0, -0.5, 0] }}
        transition={{ duration: threatActive ? 0.28 : 2.8, repeat: Infinity }} />
      <circle cx="32" cy="38" r="17" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      <motion.g animate={{ scale: threatActive ? [1, 1.03, 1] : [1, 1.015, 1] }}
        transition={{ duration: threatActive ? 0.5 : 2.2, repeat: Infinity }}
        style={{ transformOrigin: '32px 34px' }}>
        <circle cx="24" cy="34" r="9" fill="#020617" stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`} strokeWidth="1.4" />
        <circle cx="40" cy="34" r="9" fill="#020617" stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`} strokeWidth="1.4" />
        <circle cx="24" cy="34" r="5" fill={threatActive ? `url(#${ids.threat})` : '#0f172a'} opacity="0.95" />
        <circle cx="40" cy="34" r="5" fill={threatActive ? `url(#${ids.threat})` : '#0f172a'} opacity="0.95" />
        {!threatActive && (
          <>
            <circle cx="26" cy="32" r="2.2" fill={c.n1} opacity="0.9" />
            <circle cx="42" cy="32" r="2.2" fill={c.n1} opacity="0.9" />
          </>
        )}
      </motion.g>
      <path d="M32 42 L34 48 L30 48 Z" fill="rgb(251 191 36 / 0.9)" stroke={`url(#${ids.neon})`} strokeWidth="0.45" />
      <path d="M14 40 H8 M50 40 H56" stroke={`${c.n1}72`} strokeWidth="0.75" strokeLinecap="round" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function RaccoonNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('raccoon')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(12deg)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1.08, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      <motion.circle cx="14" cy="28" r="7" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.1"
        animate={{ x: threatActive ? [0, 0.5, 0] : [0, 0.3, 0] }} transition={{ duration: 2.4, repeat: Infinity }} />
      <motion.circle cx="50" cy="28" r="7" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.1"
        animate={{ x: threatActive ? [0, -0.5, 0] : [0, -0.3, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <ellipse cx="32" cy="36" rx="18" ry="15" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      {/* Raccoon mask */}
      <path d="M16 30 Q32 26 48 30 Q48 38 32 40 Q16 38 16 30" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="1" opacity="0.92" />
      <path d="M10 36 H20 M44 36 H54 M10 40 H18 M46 40 H54" stroke={`${c.n1}65`} strokeWidth="0.7" strokeLinecap="round" />
      <BlinkingEyes cxL={25} cxR={39} cy={33} threatActive={threatActive} ids={ids} />
      <ellipse cx="32" cy="38" rx="4" ry="3" fill="rgb(244 114 182 / 0.75)" stroke={`url(#${ids.neon})`} strokeWidth="0.4" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function BunnyNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('bunny')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(6deg) brightness(1.08)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1.12, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      <motion.ellipse cx="24" cy="16" rx="6" ry="14" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.1"
        style={{ transformOrigin: '24px 28px' }} animate={{ rotate: threatActive ? [-4, 3, -3] : [-2, 2, -1.5] }}
        transition={{ duration: threatActive ? 0.38 : 2.3, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.ellipse cx="40" cy="16" rx="6" ry="14" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.1"
        style={{ transformOrigin: '40px 28px' }} animate={{ rotate: threatActive ? [4, -3, 3] : [2, -2, 1.5] }}
        transition={{ duration: threatActive ? 0.4 : 2.45, repeat: Infinity, repeatType: 'mirror' }} />
      <circle cx="32" cy="38" r="14" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      <path d="M10 38 H20 M44 38 H54" stroke={`${c.n1}72`} strokeWidth="0.75" strokeLinecap="round" />
      <BlinkingEyes cxL={26} cxR={38} cy={36} threatActive={threatActive} ids={ids} />
      <path d="M30 42 L32 45 L34 42 Z" fill="rgb(244 114 182 / 0.88)" stroke={`url(#${ids.neon})`} strokeWidth="0.45" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* ESPECIES NUEVAS                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

function WolfNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('wolf')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(15deg) brightness(1.1)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 0.9, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Orejas puntiagudas */}
      <motion.path d="M13 30 L21 6 L30 26 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2"
        style={{ transformOrigin: '21px 20px' }} animate={{ rotate: threatActive ? [-5, 4, -4] : [-2, 2, -1.5] }}
        transition={{ duration: threatActive ? 0.3 : 2.5, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.path d="M51 30 L43 6 L34 26 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2"
        style={{ transformOrigin: '43px 20px' }} animate={{ rotate: threatActive ? [5, -4, 4] : [2, -2, 1.5] }}
        transition={{ duration: threatActive ? 0.32 : 2.65, repeat: Infinity, repeatType: 'mirror' }} />
      {/* Cara angular */}
      <path d="M12 32 Q14 14 32 12 Q50 14 52 32 L50 48 Q42 56 22 56 L14 48 Z"
        fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Hocico */}
      <ellipse cx="32" cy="46" rx="10" ry="7" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9" opacity="0.9" />
      {/* Bigotes / marcas */}
      <path d="M8 38 L20 40 M44 40 L56 38 M8 42 L18 43 M46 43 L56 42"
        stroke={`${c.n1}60`} strokeWidth="0.75" strokeLinecap="round" />
      {/* Ojos ligeramente inclinados */}
      <BlinkingEyes cxL={24} cxR={40} cy={34} rx={5} ry={4} threatActive={threatActive} ids={ids} />
      {/* Nariz */}
      <path d="M29 47 Q32 44 35 47 Q32 50 29 47" fill={c.n2} opacity="0.85" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function DragonNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('dragon')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(-10deg) brightness(1.12)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 0.85, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Cuernos curvados */}
      <motion.path d="M20 24 Q12 6 22 4 Q26 12 28 22 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.15"
        style={{ transformOrigin: '20px 16px' }} animate={{ rotate: threatActive ? [-6, 4, -5] : [-2, 2, -1.5] }}
        transition={{ duration: threatActive ? 0.28 : 2.4, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.path d="M44 24 Q52 6 42 4 Q38 12 36 22 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.15"
        style={{ transformOrigin: '44px 16px' }} animate={{ rotate: threatActive ? [6, -4, 5] : [2, -2, 1.5] }}
        transition={{ duration: threatActive ? 0.3 : 2.55, repeat: Infinity, repeatType: 'mirror' }} />
      {/* Alas laterales */}
      <motion.path d="M12 34 Q2 24 4 44 L12 42 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1"
        style={{ transformOrigin: '8px 36px' }} animate={{ rotate: threatActive ? [-4, 2, -3] : [-1, 1, 0] }}
        transition={{ duration: threatActive ? 0.35 : 2.8, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.path d="M52 34 Q62 24 60 44 L52 42 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1"
        style={{ transformOrigin: '56px 36px' }} animate={{ rotate: threatActive ? [4, -2, 3] : [1, -1, 0] }}
        transition={{ duration: threatActive ? 0.37 : 2.95, repeat: Infinity, repeatType: 'mirror' }} />
      {/* Cuerpo/cabeza */}
      <path d="M14 30 Q16 12 32 10 Q48 12 50 30 L50 48 Q42 58 22 58 L14 48 Z"
        fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Marcas de escamas */}
      <path d="M26 22 Q32 19 38 22 M24 27 Q32 24 40 27"
        stroke={`${c.n1}60`} strokeWidth="0.7" strokeLinecap="round" fill="none" />
      {/* Hocico */}
      <ellipse cx="32" cy="47" rx="12" ry="8" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9" opacity="0.9" />
      {/* Fosas nasales */}
      <circle cx="28.5" cy="48" r="1.8" fill={c.n2} opacity="0.7" />
      <circle cx="35.5" cy="48" r="1.8" fill={c.n2} opacity="0.7" />
      {/* Ojos fieros */}
      <BlinkingEyes cxL={24} cxR={40} cy={32} rx={5} ry={3.5} threatActive={threatActive} ids={ids} />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function BearNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('bear')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'brightness(1.1)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1.2, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Orejas muy grandes y redondas */}
      <circle cx="14" cy="20" r="10" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      <circle cx="50" cy="20" r="10" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      <circle cx="14" cy="20" r="6" fill="#0c1a2e" stroke={`url(#${ids.neon})`} strokeWidth="0.6" opacity="0.8" />
      <circle cx="50" cy="20" r="6" fill="#0c1a2e" stroke={`url(#${ids.neon})`} strokeWidth="0.6" opacity="0.8" />
      {/* Cara muy redonda */}
      <circle cx="32" cy="38" r="20" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.3" />
      {/* Hocico grande */}
      <ellipse cx="32" cy="46" rx="12" ry="9" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9" opacity="0.9" />
      {/* Nariz grande */}
      <motion.ellipse cx="32" cy="42" rx="5.5" ry="3.5"
        fill={c.n2} opacity="0.85"
        animate={{ scaleX: threatActive ? [1, 1.1, 1] : [1, 1.04, 1] }}
        transition={{ duration: threatActive ? 0.4 : 2.5, repeat: Infinity }} />
      {/* Ojos pequeños y amigables */}
      <BlinkingEyes cxL={24} cxR={40} cy={34} rx={3.8} ry={4.5} threatActive={threatActive} ids={ids} />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function PenguinNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('penguin')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'brightness(1.08)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1.1, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Cuerpo ovalado (traje de frac) */}
      <ellipse cx="32" cy="42" rx="17" ry="20" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      {/* Cabeza */}
      <circle cx="32" cy="22" r="13" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      {/* Panza blanca */}
      <ellipse cx="32" cy="46" rx="10" ry="14" fill="#0d1f30" stroke={`url(#${ids.neon})`} strokeWidth="0.7" opacity="0.85" />
      {/* Aletas (brazos) */}
      <motion.path d="M15 38 Q5 46 9 56 L16 50 Q12 44 18 40 Z"
        fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1"
        style={{ transformOrigin: '15px 44px' }} animate={{ rotate: threatActive ? [-6, 3, -5] : [-3, 3, -2] }}
        transition={{ duration: threatActive ? 0.35 : 2.2, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.path d="M49 38 Q59 46 55 56 L48 50 Q52 44 46 40 Z"
        fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1"
        style={{ transformOrigin: '49px 44px' }} animate={{ rotate: threatActive ? [6, -3, 5] : [3, -3, 2] }}
        transition={{ duration: threatActive ? 0.37 : 2.35, repeat: Infinity, repeatType: 'mirror' }} />
      {/* Pico triangular (ámbar) */}
      <path d="M28 26 L36 26 L32 32 Z" fill="#fbbf24" stroke={`url(#${ids.neon})`} strokeWidth="0.6" />
      {/* Ojos */}
      <BlinkingEyes cxL={24} cxR={40} cy={19} rx={4} ry={4.5} threatActive={threatActive} ids={ids} />
      {/* Pies */}
      <path d="M24 60 Q28 64 32 62 Q36 64 40 60" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function SharkNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('shark')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(8deg)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 0.95, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Aleta dorsal (arriba, centro) */}
      <motion.path d="M28 16 L32 2 L36 16 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2"
        style={{ transformOrigin: '32px 10px' }} animate={{ rotate: threatActive ? [-4, 3, -3] : [-1.5, 1.5, -1] }}
        transition={{ duration: threatActive ? 0.3 : 3, repeat: Infinity, repeatType: 'mirror' }} />
      {/* Cabeza ancha — domo */}
      <path d="M8 38 Q10 16 32 12 Q54 16 56 38 L56 52 Q44 62 20 62 L8 52 Z"
        fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Aletas laterales */}
      <motion.path d="M8 44 Q0 36 2 52 L10 50 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1"
        style={{ transformOrigin: '5px 44px' }} animate={{ rotate: threatActive ? [-3, 2, -2] : [-1, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatType: 'mirror' }} />
      <motion.path d="M56 44 Q64 36 62 52 L54 50 Z" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1"
        style={{ transformOrigin: '59px 44px' }} animate={{ rotate: threatActive ? [3, -2, 2] : [1, -1, 0] }}
        transition={{ duration: 2.7, repeat: Infinity, repeatType: 'mirror' }} />
      {/* Sonrisa ancha con dientes */}
      <path d="M14 48 Q32 56 50 48 L48 50 Q32 60 16 50 Z"
        fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9" />
      <path d="M18 48 L20 52 M24 50 L26 54 M30 51 L32 55 M34 51 L36 54 M40 50 L42 52 M46 48 L48 52"
        stroke={`${c.n1}80`} strokeWidth="0.7" strokeLinecap="round" />
      {/* Ojos pequeños y altos */}
      <BlinkingEyes cxL={22} cxR={42} cy={28} rx={3.5} ry={3.5} threatActive={threatActive} ids={ids} />
      {/* Branquias */}
      <path d="M12 36 Q14 32 16 38 M16 36 Q18 32 20 38" stroke={`${c.n1}50`} strokeWidth="0.7" strokeLinecap="round" fill="none" />
      <path d="M44 36 Q46 32 48 38 M48 36 Q50 32 52 38" stroke={`${c.n1}50`} strokeWidth="0.7" strokeLinecap="round" fill="none" />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function RobotNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('robot')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'brightness(1.15) contrast(1.08)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 0.75, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Antena */}
      <rect x="29" y="5" width="6" height="13" rx="2" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="0.9" />
      <motion.circle cx="32" cy="4" r="3.5" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="1"
        animate={{ opacity: threatActive ? [1, 0.3, 1] : [1, 0.6, 1] }}
        transition={{ duration: threatActive ? 0.3 : 1.2, repeat: Infinity }} />
      {/* Cabeza cuadrada */}
      <rect x="10" y="16" width="44" height="38" rx="5" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.3" />
      {/* Detalles de circuito */}
      <path d="M10 36 H16 M48 36 H54" stroke={`${c.n1}60`} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M16 26 H10 V30 M48 26 H54 V30" stroke={`${c.n1}40`} strokeWidth="0.6" strokeLinecap="round" fill="none" />
      {/* Tornillos en esquinas */}
      <circle cx="14" cy="20" r="2" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.6" />
      <circle cx="50" cy="20" r="2" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.6" />
      <circle cx="14" cy="50" r="2" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.6" />
      <circle cx="50" cy="50" r="2" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.6" />
      {/* Ojos LED — barras de escaneo */}
      <rect x="15" y="26" width="14" height="10" rx="1.5" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="1" />
      <motion.rect x="16" y="28" width="12" height="2.5" rx="0.75"
        fill={threatActive ? `url(#${ids.threat})` : `url(#${ids.neon})`}
        animate={{ y: threatActive ? [28, 32, 28] : [28, 31.5, 28] }}
        transition={{ duration: threatActive ? 0.45 : 1.6, repeat: Infinity, ease: 'easeInOut' }} />
      <rect x="35" y="26" width="14" height="10" rx="1.5" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="1" />
      <motion.rect x="36" y="28" width="12" height="2.5" rx="0.75"
        fill={threatActive ? `url(#${ids.threat})` : `url(#${ids.neon})`}
        animate={{ y: threatActive ? [28, 32, 28] : [28, 31.5, 28] }}
        transition={{ duration: threatActive ? 0.45 : 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }} />
      {/* Boca LED */}
      <motion.rect x="20" y="42" width="24" height="6" rx="2" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9"
        animate={{ opacity: threatActive ? [1, 0.4, 1] : 1 }}
        transition={{ duration: 0.4, repeat: threatActive ? Infinity : 0 }} />
      {/* Segmentos de boca */}
      <path d="M25 42 V48 M30 42 V48 M35 42 V48 M40 42 V48" stroke={`${c.n1}50`} strokeWidth="0.5" />
      <motion.path d="M21 45 H43" stroke={`url(#${ids.neon})`} strokeWidth="1.5" strokeLinecap="round"
        animate={{ opacity: threatActive ? [1, 0.2, 1] : [0.8, 0.4, 0.8] }}
        transition={{ duration: threatActive ? 0.35 : 2, repeat: Infinity }} />
    </motion.svg>
  )
}

function NinjaNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('ninja')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(-15deg) brightness(1.1)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 0.8, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Cabeza */}
      <circle cx="32" cy="32" r="21" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      {/* Cinta de la cabeza (diadema ninja) */}
      <rect x="11" y="20" width="42" height="7" rx="2" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="1" />
      {/* Nudo/placa central de la diadema */}
      <rect x="28" y="19" width="8" height="9" rx="1.5" fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9" />
      <rect x="30" y="21" width="4" height="5" rx="0.75" fill={c.n2} opacity="0.6" />
      {/* Máscara que cubre boca/nariz */}
      <path d="M11 32 Q11 54 32 55 Q53 54 53 32 Z"
        fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="1" opacity="0.95" />
      {/* Pliegues de la máscara */}
      <path d="M14 38 Q32 40 50 38 M14 43 Q32 46 50 43 M14 48 Q32 51 50 48"
        stroke={`${c.n1}40`} strokeWidth="0.6" strokeLinecap="round" fill="none" />
      {/* Sólo ojos visibles — mirada afilada */}
      <BlinkingEyes cxL={24} cxR={40} cy={26} rx={5.5} ry={3.5} threatActive={threatActive} ids={ids} />
      {/* Flequillo / cabello */}
      <path d="M11 22 Q14 12 20 18 M53 22 Q50 12 44 18"
        stroke={`${c.n1}50`} strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function PandaNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('panda')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'brightness(1.08)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 1.18, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Orejas redondas */}
      <circle cx="14" cy="18" r="9" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.1" />
      <circle cx="50" cy="18" r="9" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.1" />
      {/* Cara redonda grande */}
      <circle cx="32" cy="37" r="21" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.3" />
      {/* Manchas características del oso panda alrededor de los ojos */}
      <ellipse cx="23" cy="33" rx="8.5" ry="8" fill="#0a1628" stroke={`url(#${ids.neon})`} strokeWidth="0.7" opacity="0.9" />
      <ellipse cx="41" cy="33" rx="8.5" ry="8" fill="#0a1628" stroke={`url(#${ids.neon})`} strokeWidth="0.7" opacity="0.9" />
      {/* Ojos dentro de los parches */}
      <BlinkingEyes cxL={23} cxR={41} cy={33} rx={4} ry={4.5} threatActive={threatActive} ids={ids} />
      {/* Hocico blancuzco */}
      <ellipse cx="32" cy="46" rx="10" ry="7" fill="#111e30" stroke={`url(#${ids.neon})`} strokeWidth="0.8" opacity="0.85" />
      {/* Nariz */}
      <motion.ellipse cx="32" cy="43" rx="4.5" ry="3"
        fill={c.n2} opacity="0.8"
        animate={{ scaleX: threatActive ? [1, 1.08, 1] : [1, 1.03, 1] }}
        transition={{ duration: threatActive ? 0.4 : 2.8, repeat: Infinity }} />
      {/* Boca leve */}
      <path d="M28 48 Q32 51 36 48" stroke={`${c.n1}60`} strokeWidth="0.9" strokeLinecap="round" fill="none" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function GhostNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  const c = nc('ghost')
  return (
    <motion.svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden
      style={{ filter: svgGlow(threatActive, c.glow) }}
      animate={threatActive ? { filter: [svgGlow(true, c.glow), 'hue-rotate(20deg) brightness(1.1)', svgGlow(true, c.glow)] } : {}}
      transition={{ duration: 0.95, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} n1={c.n1} n2={c.n2} />
      {/* Cuerpo flotante con base ondulada */}
      <motion.g
        animate={{ y: threatActive ? [0, -3, 0] : [0, -5, 0] }}
        transition={{ duration: threatActive ? 0.55 : 2.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <path
          d="M12 34 Q12 8 32 8 Q52 8 52 34 Q54 44 52 56 Q46 64 40 56 Q34 64 28 56 Q22 64 16 56 Q10 48 12 34 Z"
          fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.3" strokeLinejoin="round"
        />
        {/* Brillo interior */}
        <ellipse cx="32" cy="26" rx="13" ry="10" fill={c.n2} opacity="0.06" />
        {/* Ojos huecos grandes */}
        <motion.circle cx="24" cy="30" r="7"
          fill="#020617" stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`} strokeWidth="1.3"
          animate={{ scale: threatActive ? [1, 1.08, 1] : [1, 1.04, 1] }}
          transition={{ duration: threatActive ? 0.5 : 2.2, repeat: Infinity }} />
        <motion.circle cx="40" cy="30" r="7"
          fill="#020617" stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`} strokeWidth="1.3"
          animate={{ scale: threatActive ? [1, 1.08, 1] : [1, 1.04, 1] }}
          transition={{ duration: threatActive ? 0.5 : 2.2, repeat: Infinity, delay: 0.15 }} />
        {/* Brillo en los ojos */}
        {!threatActive && (
          <>
            <circle cx="26.5" cy="27.5" r="2.5" fill={c.n1} opacity="0.6" />
            <circle cx="42.5" cy="27.5" r="2.5" fill={c.n1} opacity="0.6" />
          </>
        )}
        {threatActive && (
          <>
            <circle cx="24" cy="30" r="4" fill="url(#ghost-threat)" opacity="0.85" />
            <circle cx="40" cy="30" r="4" fill="url(#ghost-threat)" opacity="0.85" />
          </>
        )}
        {/* Boca pequeña en O */}
        <motion.ellipse cx="32" cy="44" rx="3.5" ry="3"
          fill="#020617" stroke={`url(#${ids.neon})`} strokeWidth="0.9"
          animate={{ scaleY: threatActive ? [1, 1.4, 1] : [1, 1.2, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }} />
        {/* Mini brazos fantasmales */}
        <motion.path d="M12 36 Q6 42 10 48" stroke={`url(#${ids.neon})`} strokeWidth="1.4" strokeLinecap="round" fill="none"
          animate={{ x: [-1, 1, -1] }} transition={{ duration: 2.4, repeat: Infinity, repeatType: 'mirror' }} />
        <motion.path d="M52 36 Q58 42 54 48" stroke={`url(#${ids.neon})`} strokeWidth="1.4" strokeLinecap="round" fill="none"
          animate={{ x: [1, -1, 1] }} transition={{ duration: 2.5, repeat: Infinity, repeatType: 'mirror' }} />
      </motion.g>
    </motion.svg>
  )
}

/* ─── Router de avatares ─────────────────────────────────────────────────── */
export function GuardianNeonAvatar({
  species,
  threatActive,
}: {
  species: GuardianSpecies
  threatActive: boolean
}) {
  switch (species) {
    case 'cat':     return <CatNeon     threatActive={threatActive} />
    case 'dog':     return <DogNeon     threatActive={threatActive} />
    case 'fox':     return <FoxNeon     threatActive={threatActive} />
    case 'owl':     return <OwlNeon     threatActive={threatActive} />
    case 'raccoon': return <RaccoonNeon threatActive={threatActive} />
    case 'bunny':   return <BunnyNeon   threatActive={threatActive} />
    case 'wolf':    return <WolfNeon    threatActive={threatActive} />
    case 'dragon':  return <DragonNeon  threatActive={threatActive} />
    case 'bear':    return <BearNeon    threatActive={threatActive} />
    case 'penguin': return <PenguinNeon threatActive={threatActive} />
    case 'shark':   return <SharkNeon   threatActive={threatActive} />
    case 'robot':   return <RobotNeon   threatActive={threatActive} />
    case 'ninja':   return <NinjaNeon   threatActive={threatActive} />
    case 'panda':   return <PandaNeon   threatActive={threatActive} />
    case 'ghost':   return <GhostNeon   threatActive={threatActive} />
    default:        return <CatNeon     threatActive={threatActive} />
  }
}
