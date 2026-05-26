import { motion } from 'framer-motion'

export function InspectionOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-5 bg-slate-950/94 px-6 text-center backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="rounded-3xl border border-white/[0.08] bg-slate-900/50 px-8 py-10 shadow-[0_24px_80px_-24px_rgb(0_0_0_/_0.7)] ring-1 ring-cyan-500/15 backdrop-blur-md">
        <motion.div
          className="mx-auto h-12 w-12 rounded-full border-2 border-cyan-400/25 border-t-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
        />
        <p className="mt-6 max-w-sm text-base font-semibold tracking-tight text-white sm:text-lg">
          Tu Guardián está inspeccionando la ruta…
        </p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
          Analizando redirecciones, firmas de anuncios y comportamiento de descarga.
        </p>
      </div>
    </motion.div>
  )
}
