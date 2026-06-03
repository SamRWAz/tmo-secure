import { motion } from 'framer-motion'

type Props = {
  onConfirm: () => void
  onDecline: () => void
}

export function AgeGateModal({ onConfirm, onDecline }: Props) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-t-3xl border border-white/[0.08] bg-slate-900 shadow-[0_32px_80px_-16px_rgb(0_0_0_/_0.8)] ring-1 ring-rose-500/20 sm:rounded-3xl"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-slate-700 sm:hidden" />
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-500/12 via-slate-900 to-slate-900 px-6 pt-7 pb-5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-rose-500/15 blur-2xl" />
          <div className="relative text-center">
            <span className="block text-5xl leading-none" aria-hidden>
              🔞
            </span>
            <h2
              id="age-gate-title"
              className="mt-4 text-xl font-bold tracking-tight text-white"
            >
              Contenido para adultos
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
              Esta obra contiene material destinado a personas{' '}
              <span className="font-semibold text-rose-200">mayores de 18 años</span>.
              Puede incluir violencia, lenguaje explícito u otras temáticas para adultos.
            </p>
          </div>
        </div>

        <div className="px-6 pb-7">
          <p className="mt-4 text-center text-xs text-slate-500">
            Al continuar confirmas que tienes 18 años o más y que eres consciente
            del tipo de contenido que encontrarás.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <motion.button
              type="button"
              onClick={onConfirm}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl bg-gradient-to-r from-rose-500/25 to-rose-600/15 py-3 text-sm font-bold text-rose-100 ring-1 ring-rose-400/40 transition hover:from-rose-500/35"
            >
              Soy mayor de 18 años — Continuar
            </motion.button>

            <button
              type="button"
              onClick={onDecline}
              className="w-full rounded-2xl border border-slate-700 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            >
              No, volver al inicio
            </button>
          </div>

          <p className="mt-4 text-center text-[10px] text-slate-700">
            TMO Secure · Verificación de edad simulada — Demo educativa
          </p>
        </div>
      </motion.div>
    </div>
  )
}
