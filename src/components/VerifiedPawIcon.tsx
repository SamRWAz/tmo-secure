import { motion } from 'framer-motion'

/** Huella de gato verificada — enlaces pre-escaneados */
export function VerifiedPawIcon({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      initial={{ scale: 0.9, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    >
      <path
        d="M4.5 10.5c.8-1.2 2.2-1.9 3.6-1.4 1.1.4 1.8 1.5 1.9 2.7M9 8.5c.3-1.4 1.6-2.4 3-2.3 1.5.1 2.6 1.3 2.7 2.8M15 8.2c1.3-.5 2.8.2 3.4 1.5.5 1.1.3 2.4-.5 3.3M19.5 13c.9.8 1.2 2.1.7 3.2-.6 1.4-2.2 2.1-3.7 1.6-1.3-.4-2.1-1.6-2.2-2.9M4.2 14.2c-1 .9-1.3 2.5-.6 3.7.8 1.3 2.5 1.8 3.9 1.1 1-.5 1.6-1.6 1.6-2.7"
        stroke="rgb(34 211 238)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 17.5c1.2 1.8 3.3 2.9 5.5 2.7 2-.2 3.7-1.4 4.5-3.2"
        stroke="rgb(34 211 238)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="7" cy="6" r="1.1" fill="rgb(34 211 238)" />
      <circle cx="11" cy="5" r="1" fill="rgb(34 211 238)" />
      <circle cx="15" cy="5.2" r="1" fill="rgb(34 211 238)" />
      <circle cx="18.5" cy="7.5" r="1" fill="rgb(34 211 238)" />
    </motion.svg>
  )
}
