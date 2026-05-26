import { motion } from 'framer-motion'
import type { GuardianSpecies } from '../../data/guardianSpecies'
import { useNeonGuardianIds } from './useNeonGuardianIds'

function Defs({ ids }: { ids: ReturnType<typeof useNeonGuardianIds> }) {
  return (
    <defs>
      <linearGradient id={ids.body} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="55%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0c1222" />
      </linearGradient>
      <linearGradient id={ids.neon} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="45%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
      <linearGradient id={ids.threat} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="40%" stopColor="#e879f9" />
        <stop offset="100%" stopColor="#fb7185" />
      </linearGradient>
    </defs>
  )
}

const svgGlow = (threat: boolean) =>
  threat
    ? 'drop-shadow(0 0 12px rgba(244,114,182,0.75)) drop-shadow(0 0 4px rgba(251,113,133,0.9))'
    : 'drop-shadow(0 0 10px rgba(34,211,238,0.55)) drop-shadow(0 0 3px rgba(103,232,249,0.45))'

function BlinkingEyes({
  cxL,
  cxR,
  cy,
  threatActive,
  ids,
  pupils,
}: {
  cxL: number
  cxR: number
  cy: number
  threatActive: boolean
  ids: ReturnType<typeof useNeonGuardianIds>
  pupils?: boolean
}) {
  return (
    <motion.g
      animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 1] }}
      transition={{
        duration: 3.1,
        repeat: Infinity,
        times: [0, 0.52, 0.56, 0.6, 0.68, 0.82, 1],
      }}
      style={{ transformOrigin: `${(cxL + cxR) / 2}px ${cy}px` }}
    >
      <ellipse
        cx={cxL}
        cy={cy}
        rx="4.2"
        ry="5"
        fill={threatActive ? `url(#${ids.threat})` : '#020617'}
        stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`}
        strokeWidth="1.1"
      />
      <ellipse
        cx={cxR}
        cy={cy}
        rx="4.2"
        ry="5"
        fill={threatActive ? `url(#${ids.threat})` : '#020617'}
        stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`}
        strokeWidth="1.1"
      />
      {!threatActive && pupils !== false && (
        <>
          <circle cx={cxL + 1.1} cy={cy - 1.2} r="1.35" fill="#22d3ee" opacity="0.95" />
          <circle cx={cxR + 1.1} cy={cy - 1.2} r="1.35" fill="#22d3ee" opacity="0.95" />
        </>
      )}
    </motion.g>
  )
}

function CollarChip({ ids }: { ids: ReturnType<typeof useNeonGuardianIds> }) {
  return (
    <g>
      <rect
        x="24"
        y="48"
        width="16"
        height="6"
        rx="2"
        fill="#020617"
        stroke={`url(#${ids.neon})`}
        strokeWidth="0.85"
      />
      <rect x="29" y="49.5" width="6" height="3" rx="1" fill="#22d3ee" opacity="0.4" />
    </g>
  )
}

function ThreatSpikes({ threatActive }: { threatActive: boolean }) {
  if (!threatActive) return null
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.line
          key={i}
          x1={18 + i * 7}
          y1="20"
          x2={16 + i * 7}
          y2="10"
          stroke="#fb7185"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={{ y2: [10, 6, 10] }}
          transition={{ duration: 0.28, repeat: Infinity, delay: i * 0.04 }}
        />
      ))}
    </motion.g>
  )
}

function CatNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-12 w-12"
      aria-hidden
      style={{ filter: svgGlow(threatActive) }}
      animate={
        threatActive
          ? { filter: [svgGlow(true), 'hue-rotate(6deg) brightness(1.08)', svgGlow(true)] }
          : { filter: svgGlow(false) }
      }
      transition={{ duration: 1.1, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} />
      <motion.path
        d="M18 22 L22 8 L30 20 Z"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.25"
        style={{ transformOrigin: '24px 20px' }}
        animate={{ rotate: threatActive ? [-6, 4, -5] : [-3, 3, -2] }}
        transition={{
          duration: threatActive ? 0.35 : 2.4,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      />
      <motion.path
        d="M46 22 L42 8 L34 20 Z"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.25"
        style={{ transformOrigin: '40px 20px' }}
        animate={{ rotate: threatActive ? [6, -4, 5] : [3, -3, 2] }}
        transition={{
          duration: threatActive ? 0.35 : 2.6,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      />
      <motion.ellipse
        cx="32"
        cy="34"
        rx="18"
        ry="16"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.2"
        animate={
          threatActive
            ? { scaleX: [1, 1.04, 1], scaleY: [1, 0.96, 1] }
            : { scaleX: 1, scaleY: 1 }
        }
        transition={{ duration: 0.45, repeat: threatActive ? Infinity : 0 }}
      />
      <path
        d="M10 36 H22 M10 40 H22 M42 36 H54 M42 40 H54"
        stroke="rgb(34 211 238 / 0.5)"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <BlinkingEyes cxL={26} cxR={38} cy={32} threatActive={threatActive} ids={ids} />
      <path
        d="M30 38 L32 41 L34 38 Z"
        fill="rgb(244 114 182 / 0.9)"
        stroke="rgb(34 211 238 / 0.55)"
        strokeWidth="0.5"
      />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function DogNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-12 w-12"
      aria-hidden
      style={{ filter: svgGlow(threatActive) }}
      animate={
        threatActive
          ? { filter: [svgGlow(true), 'hue-rotate(8deg) brightness(1.06)', svgGlow(true)] }
          : { filter: svgGlow(false) }
      }
      transition={{ duration: 1.05, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} />
      <motion.path
        d="M14 26 Q10 6 24 22"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.2"
        strokeLinejoin="round"
        style={{ transformOrigin: '18px 22px' }}
        animate={{ rotate: threatActive ? [8, -2, 6] : [4, -1, 3] }}
        transition={{ duration: threatActive ? 0.4 : 2.2, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.path
        d="M50 26 Q54 6 40 22"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.2"
        strokeLinejoin="round"
        style={{ transformOrigin: '46px 22px' }}
        animate={{ rotate: threatActive ? [-8, 2, -6] : [-4, 1, -3] }}
        transition={{ duration: threatActive ? 0.42 : 2.35, repeat: Infinity, repeatType: 'mirror' }}
      />
      <ellipse
        cx="32"
        cy="36"
        rx="17"
        ry="15"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.2"
      />
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
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-12 w-12"
      aria-hidden
      style={{ filter: svgGlow(threatActive) }}
      animate={
        threatActive
          ? { filter: [svgGlow(true), 'hue-rotate(10deg) saturate(1.15)', svgGlow(true)] }
          : { filter: svgGlow(false) }
      }
      transition={{ duration: 1, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} />
      <motion.path
        d="M20 14 L28 28 L16 26 Z"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.15"
        style={{ transformOrigin: '22px 22px' }}
        animate={{ rotate: threatActive ? [-5, 4, -4] : [-2, 2, -1.5] }}
        transition={{ duration: threatActive ? 0.32 : 2.5, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.path
        d="M44 14 L36 28 L48 26 Z"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.15"
        style={{ transformOrigin: '42px 22px' }}
        animate={{ rotate: threatActive ? [5, -4, 4] : [2, -2, 1.5] }}
        transition={{ duration: threatActive ? 0.34 : 2.6, repeat: Infinity, repeatType: 'mirror' }}
      />
      <path
        d="M32 18 L46 34 L40 50 L24 50 L18 34 Z"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M32 38 L38 46 L26 46 Z"
        fill="#020617"
        stroke={`url(#${ids.neon})`}
        strokeWidth="0.9"
      />
      <path d="M12 36 L22 40 M52 36 L42 40" stroke="rgb(34 211 238 / 0.5)" strokeWidth="0.8" strokeLinecap="round" />
      <BlinkingEyes cxL={26} cxR={38} cy={31} threatActive={threatActive} ids={ids} />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function OwlNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-12 w-12"
      aria-hidden
      style={{ filter: svgGlow(threatActive) }}
      animate={
        threatActive
          ? { filter: [svgGlow(true), 'brightness(1.12) contrast(1.05)', svgGlow(true)] }
          : { filter: svgGlow(false) }
      }
      transition={{ duration: 1.15, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} />
      <motion.path
        d="M22 12 L26 22 L18 20 Z M42 12 L38 22 L46 20 Z"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1"
        strokeLinejoin="round"
        animate={{ y: threatActive ? [0, -1, 0] : [0, -0.5, 0] }}
        transition={{ duration: threatActive ? 0.28 : 2.8, repeat: Infinity }}
      />
      <circle cx="32" cy="38" r="17" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      <motion.g
        animate={{ scale: threatActive ? [1, 1.03, 1] : [1, 1.015, 1] }}
        transition={{ duration: threatActive ? 0.5 : 2.2, repeat: Infinity }}
        style={{ transformOrigin: '32px 34px' }}
      >
        <circle
          cx="24"
          cy="34"
          r="9"
          fill="#020617"
          stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`}
          strokeWidth="1.4"
        />
        <circle
          cx="40"
          cy="34"
          r="9"
          fill="#020617"
          stroke={threatActive ? '#fbcfe8' : `url(#${ids.neon})`}
          strokeWidth="1.4"
        />
        <circle cx="24" cy="34" r="5" fill={threatActive ? `url(#${ids.threat})` : '#0f172a'} opacity="0.95" />
        <circle cx="40" cy="34" r="5" fill={threatActive ? `url(#${ids.threat})` : '#0f172a'} opacity="0.95" />
        {!threatActive && (
          <>
            <circle cx="26" cy="32" r="2.2" fill="#22d3ee" opacity="0.9" />
            <circle cx="42" cy="32" r="2.2" fill="#22d3ee" opacity="0.9" />
          </>
        )}
      </motion.g>
      <path d="M32 42 L34 48 L30 48 Z" fill="rgb(251 191 36 / 0.9)" stroke={`url(#${ids.neon})`} strokeWidth="0.45" />
      <path d="M14 40 H8 M50 40 H56" stroke="rgb(34 211 238 / 0.45)" strokeWidth="0.75" strokeLinecap="round" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function RaccoonNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-12 w-12"
      aria-hidden
      style={{ filter: svgGlow(threatActive) }}
      animate={
        threatActive
          ? { filter: [svgGlow(true), 'hue-rotate(12deg)', svgGlow(true)] }
          : { filter: svgGlow(false) }
      }
      transition={{ duration: 1.08, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} />
      <motion.circle
        cx="14"
        cy="28"
        r="7"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.1"
        animate={{ x: threatActive ? [0, 0.5, 0] : [0, 0.3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <motion.circle
        cx="50"
        cy="28"
        r="7"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.1"
        animate={{ x: threatActive ? [0, -0.5, 0] : [0, -0.3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <ellipse cx="32" cy="36" rx="18" ry="15" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      <path
        d="M16 30 Q32 26 48 30 Q48 38 32 40 Q16 38 16 30"
        fill="#020617"
        stroke={`url(#${ids.neon})`}
        strokeWidth="1"
        opacity="0.92"
      />
      <path d="M10 36 H20 M44 36 H54 M10 40 H18 M46 40 H54" stroke="rgb(34 211 238 / 0.4)" strokeWidth="0.7" strokeLinecap="round" />
      <BlinkingEyes cxL={25} cxR={39} cy={33} threatActive={threatActive} ids={ids} />
      <ellipse cx="32" cy="38" rx="4" ry="3" fill="rgb(244 114 182 / 0.75)" stroke={`url(#${ids.neon})`} strokeWidth="0.4" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

function BunnyNeon({ threatActive }: { threatActive: boolean }) {
  const ids = useNeonGuardianIds()
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-12 w-12"
      aria-hidden
      style={{ filter: svgGlow(threatActive) }}
      animate={
        threatActive
          ? { filter: [svgGlow(true), 'hue-rotate(6deg) brightness(1.08)', svgGlow(true)] }
          : { filter: svgGlow(false) }
      }
      transition={{ duration: 1.12, repeat: threatActive ? Infinity : 0 }}
    >
      <Defs ids={ids} />
      <motion.ellipse
        cx="24"
        cy="16"
        rx="6"
        ry="14"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.1"
        style={{ transformOrigin: '24px 28px' }}
        animate={{ rotate: threatActive ? [-4, 3, -3] : [-2, 2, -1.5] }}
        transition={{ duration: threatActive ? 0.38 : 2.3, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.ellipse
        cx="40"
        cy="16"
        rx="6"
        ry="14"
        fill={`url(#${ids.body})`}
        stroke={`url(#${ids.neon})`}
        strokeWidth="1.1"
        style={{ transformOrigin: '40px 28px' }}
        animate={{ rotate: threatActive ? [4, -3, 3] : [2, -2, 1.5] }}
        transition={{ duration: threatActive ? 0.4 : 2.45, repeat: Infinity, repeatType: 'mirror' }}
      />
      <circle cx="32" cy="38" r="14" fill={`url(#${ids.body})`} stroke={`url(#${ids.neon})`} strokeWidth="1.2" />
      <path d="M10 38 H20 M44 38 H54" stroke="rgb(34 211 238 / 0.45)" strokeWidth="0.75" strokeLinecap="round" />
      <BlinkingEyes cxL={26} cxR={38} cy={36} threatActive={threatActive} ids={ids} />
      <path d="M30 42 L32 45 L34 42 Z" fill="rgb(244 114 182 / 0.88)" stroke={`url(#${ids.neon})`} strokeWidth="0.45" />
      <CollarChip ids={ids} />
      <ThreatSpikes threatActive={threatActive} />
    </motion.svg>
  )
}

export function GuardianNeonAvatar({
  species,
  threatActive,
}: {
  species: GuardianSpecies
  threatActive: boolean
}) {
  switch (species) {
    case 'cat':
      return <CatNeon threatActive={threatActive} />
    case 'dog':
      return <DogNeon threatActive={threatActive} />
    case 'fox':
      return <FoxNeon threatActive={threatActive} />
    case 'owl':
      return <OwlNeon threatActive={threatActive} />
    case 'raccoon':
      return <RaccoonNeon threatActive={threatActive} />
    case 'bunny':
      return <BunnyNeon threatActive={threatActive} />
    default:
      return <CatNeon threatActive={threatActive} />
  }
}
