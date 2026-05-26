import { AnimatePresence, motion } from 'framer-motion'
import { getSpeciesMeta } from '../data/guardianSpecies'
import { useGuardian } from '../context/GuardianContext'
import { GuardianNeonAvatar } from './guardian/GuardianNeonAvatars'

/** FAB del guardián + burbuja de “redirect eliminada”; avatares SVG neon por especie */
export function GuardianCat() {
  const {
    threatActive,
    bunkerOpen,
    setBunkerOpen,
    species,
    redirectToast,
  } = useGuardian()
  const meta = getSpeciesMeta(species)

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[60] flex max-w-[min(100vw-2rem,17rem)] flex-col items-end gap-2 sm:bottom-6 sm:right-6"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {redirectToast && (
          <motion.div
            key="toast"
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="pointer-events-none w-full rounded-2xl border border-cyan-400/40 bg-slate-950/90 px-3.5 py-3 text-left shadow-[0_16px_48px_-12px_rgb(0_0_0_/_0.65),0_0_28px_-8px_rgb(34_211_238_/_0.2)] ring-1 ring-cyan-500/25 backdrop-blur-xl"
          >
            <p className="text-sm font-bold tracking-tight text-cyan-50">
              {redirectToast.headline}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-slate-400">
              {redirectToast.subline}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={`Abrir panel del guardián (${meta.label})`}
        aria-expanded={bunkerOpen}
        onClick={() => setBunkerOpen(!bunkerOpen)}
        className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/95 shadow-[0_0_0_1px_rgba(34,211,238,0.45),0_0_24px_rgba(34,211,238,0.22),0_12px_40px_rgba(2,6,23,0.65)] ring-1 ring-cyan-400/35 backdrop-blur-md transition hover:shadow-[0_0_0_1px_rgba(34,211,238,0.65),0_0_28px_rgba(34,211,238,0.35)] hover:ring-cyan-300/50"
        whileTap={{ scale: 0.94 }}
        layout
      >
        <GuardianNeonAvatar species={species} threatActive={threatActive} />
      </motion.button>
    </div>
  )
}
