import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGuardian } from '../context/GuardianContext'
import { getSpeciesMeta } from '../data/guardianSpecies'

export function NotFoundPage() {
  const { species } = useGuardian()
  const meta = getSpeciesMeta(species)

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-0 -m-12 rounded-full bg-cyan-500/8 blur-3xl" />
        <span className="relative block text-[6rem] leading-none" aria-hidden>
          {meta.emoji}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="mt-6"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-400/90">
          Guardian · Error 404
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Esta ruta no existe
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
          Escaneé la dirección y no encontré ningún capítulo ni ficha aquí.
          Puede que el enlace esté roto o la página haya sido movida.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/25 to-teal-600/15 px-5 py-2.5 text-sm font-bold text-cyan-50 ring-2 ring-cyan-400/45 transition hover:ring-cyan-300/60"
          >
            🏠 Volver al inicio
          </Link>
          <Link
            to="/guardian"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
          >
            Ver ajustes del Guardian
          </Link>
        </div>
      </motion.div>

      {/* Consola del guardian */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mx-auto mt-10 max-w-sm rounded-2xl border border-white/[0.06] bg-slate-900/50 p-4 text-left font-mono backdrop-blur-sm"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80 mb-2">
          Guardian · log
        </p>
        <p className="text-xs text-slate-500">
          <span className="text-cyan-500">→</span> GET{' '}
          <span className="text-amber-300/90">{window.location.pathname}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <span className="text-rose-400">✗</span> 404 No se encontró la ruta en el catálogo
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <span className="text-emerald-400">✓</span> Ningún patrón oscuro detectado en la solicitud
        </p>
      </motion.div>
    </div>
  )
}
