import { AnimatePresence, motion } from 'framer-motion'

const TIERS = [
  {
    id: 'cafe',
    label: 'Un café',
    amount: '2 €',
    icon: '☕',
    desc: 'Ayuda a cubrir un día de hosting.',
  },
  {
    id: 'lector',
    label: 'Lector frecuente',
    amount: '5 €',
    icon: '📖',
    desc: 'Cubre ancho de banda de un mes.',
    highlight: true,
  },
  {
    id: 'patron',
    label: 'Patrón TMO',
    amount: '10 €',
    icon: '🛡️',
    desc: 'Apoya nuevas validaciones de autores.',
  },
]

const METHODS = [
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'stripe', label: 'Tarjeta', icon: '💳' },
  { id: 'bizum', label: 'Bizum', icon: '📱' },
]

type Props = {
  open: boolean
  onClose: () => void
}

export function DonateModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="donate-title"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900 shadow-[0_32px_80px_-16px_rgb(0_0_0_/_0.75)] ring-1 ring-white/[0.06]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            {/* Cabecera */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-orange-500/8 to-slate-900 px-6 pt-6 pb-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-400/15 blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-400/90">
                    TMO Secure · Donaciones
                  </p>
                  <h2
                    id="donate-title"
                    className="mt-1.5 text-xl font-bold tracking-tight text-white"
                  >
                    Apoya la plataforma
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    Todo lo recaudado cubre costes de infraestructura. Sin publicidad,
                    sin datos vendidos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="shrink-0 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              {/* Niveles */}
              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Elige un importe
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {TIERS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3.5 text-center transition hover:scale-[1.02] ${
                      t.highlight
                        ? 'border-amber-400/50 bg-amber-500/12 ring-1 ring-amber-400/30'
                        : 'border-white/[0.07] bg-slate-950/60 hover:border-white/[0.14]'
                    }`}
                  >
                    {t.highlight && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-500/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300 ring-1 ring-amber-400/40">
                        Popular
                      </span>
                    )}
                    <span className="text-xl leading-none">{t.icon}</span>
                    <span className="text-base font-bold text-white">{t.amount}</span>
                    <span className="text-[11px] font-semibold text-slate-300">{t.label}</span>
                    <span className="text-[10px] leading-tight text-slate-500">{t.desc}</span>
                  </button>
                ))}
              </div>

              {/* Métodos */}
              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Método de pago
              </p>
              <div className="mt-3 flex gap-2">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.07] bg-slate-950/60 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-white/[0.15] hover:text-white"
                  >
                    <span>{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* CTA (simulado) */}
              <button
                type="button"
                onClick={onClose}
                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-amber-600/20 py-3 text-sm font-bold text-amber-100 ring-1 ring-amber-400/40 transition hover:from-amber-500/40 hover:ring-amber-300/60"
              >
                Donar ahora →
              </button>

              <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-600">
                Demo simulada · Ningún pago real se procesa en esta versión.
                <br />
                Tu privacidad está protegida — sin trackers de pago.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
