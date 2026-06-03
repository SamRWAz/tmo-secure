import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const AD_DURATION = 30
const TOKENS_EARNED = 3

type Props = {
  open: boolean
  onClose: () => void
  onEarned: (tokens: number) => void
}

/** Contenido del anuncio — se monta/desmonta con el modal para reset automático de estado */
function AdContent({ onClose, onEarned }: { onClose: () => void; onEarned: (t: number) => void }) {
  const [timeLeft, setTimeLeft] = useState(AD_DURATION)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  function handleClaim() {
    if (timeLeft > 0 || claimed) return
    setClaimed(true)
    onEarned(TOKENS_EARNED)
    setTimeout(onClose, 1500)
  }

  const progress = ((AD_DURATION - timeLeft) / AD_DURATION) * 100
  const isFinished = timeLeft <= 0

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-title"
      className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900 shadow-[0_32px_80px_-16px_rgb(0_0_0_/_0.75)]"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
    >
      {/* Anuncio simulado */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-900/40 via-slate-900 to-indigo-900/30 px-6 pt-6 pb-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(34_211_238_/_0.12),transparent_60%)]" />
        <div className="relative text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/70">
            Anuncio · TMO Secure
          </p>
          <div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/25 to-indigo-600/15 ring-1 ring-cyan-400/30">
            <span className="text-4xl leading-none">🛡️</span>
          </div>
          <h2 id="ad-title" className="mt-3 text-lg font-bold text-white">
            TMO Secure Premium
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
            Lee manga sin publicidad invasiva.<br />
            Tu privacidad, protegida por el Guardian.
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Viendo anuncio…</span>
            <span className="tabular-nums font-semibold text-slate-300">
              {isFinished ? '✓ Completado' : `${timeLeft}s`}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-500/[0.07] px-4 py-3">
          <span className="text-xl">🪙</span>
          <p className="text-sm text-slate-300">
            Ganarás <span className="font-bold text-amber-200">{TOKENS_EARNED} tokens</span> al terminar
          </p>
        </div>

        <motion.button
          type="button"
          onClick={handleClaim}
          disabled={!isFinished || claimed}
          whileTap={isFinished && !claimed ? { scale: 0.98 } : {}}
          className={`mt-4 w-full rounded-2xl py-3 text-sm font-bold transition ${
            claimed
              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40'
              : isFinished
                ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-100 ring-1 ring-amber-400/45 hover:from-amber-500/40'
                : 'cursor-not-allowed bg-slate-800/60 text-slate-600 ring-1 ring-slate-700/50'
          }`}
        >
          {claimed
            ? `✓ ¡+${TOKENS_EARNED} tokens recibidos!`
            : isFinished
              ? `Reclamar ${TOKENS_EARNED} tokens`
              : `Espera ${timeLeft}s para reclamar`}
        </motion.button>

        {!claimed && (
          <button
            type="button"
            onClick={onClose}
            className="mt-2.5 w-full rounded-2xl border border-slate-800 py-2.5 text-sm text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </motion.div>
  )
}

export function AdWatchModal({ open, onClose, onEarned }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" />
          <AdContent onClose={onClose} onEarned={onEarned} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
