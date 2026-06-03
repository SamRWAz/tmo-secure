import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUser } from '../context/UserContext'

type Props = {
  open: boolean
  onClose: () => void
}

const PERKS = [
  'Acceso ilimitado a todo el catálogo premium',
  'Capítulos desbloqueados en todos los dispositivos',
  'Sin consumo de tokens para leer',
  'El Guardian guarda tu progreso con más detalle',
  'Apoya directamente a los autores del catálogo',
]

export function SubscribeModal({ open, onClose }: Props) {
  const { subscribe, isActiveSubscription, isLoggedIn } = useUser()
  const [step, setStep] = useState<'info' | 'pay' | 'done'>('info')

  function handlePayment() {
    setStep('pay')
    setTimeout(() => {
      subscribe()
      setStep('done')
    }, 2000)
  }

  function handleClose() {
    setStep('info')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sub-title"
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900 shadow-[0_32px_80px_-16px_rgb(0_0_0_/_0.75)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          >
            {/* Cabecera */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/15 via-slate-900 to-slate-900 px-6 pt-6 pb-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/15 blur-2xl" />
              <div className="relative flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400/90">
                    TMO Secure · Premium
                  </p>
                  <h2 id="sub-title" className="mt-1.5 text-xl font-bold text-white">
                    {step === 'done'
                      ? '¡Suscripción activada!'
                      : isActiveSubscription
                        ? 'Ya eres suscriptor'
                        : 'Únete a TMO Premium'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="shrink-0 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-6 pb-7">
              {step === 'done' ? (
                <div className="text-center py-4">
                  <span className="block text-5xl leading-none" aria-hidden>⭐</span>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    Tu suscripción está activa durante{' '}
                    <span className="font-semibold text-violet-200">30 días</span>.
                    Ya puedes leer todo el catálogo premium sin gastar tokens.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-500/25 to-indigo-500/15 py-3 text-sm font-bold text-violet-100 ring-1 ring-violet-400/40 transition hover:from-violet-500/35"
                  >
                    ¡Empezar a leer!
                  </button>
                </div>
              ) : isActiveSubscription ? (
                <div className="mt-4 text-center py-2">
                  <p className="text-sm text-slate-400">
                    Tu suscripción está activa. Disfruta del acceso ilimitado.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-4 w-full rounded-2xl border border-slate-700 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <>
                  {/* Precio */}
                  <div className="mt-4 flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold text-white">$2</span>
                    <div className="text-left">
                      <span className="block text-xs text-slate-400">/mes</span>
                      <span className="block text-[10px] text-slate-600">~$0.07/día</span>
                    </div>
                  </div>

                  {/* Beneficios */}
                  <ul className="mt-5 space-y-2.5">
                    {PERKS.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="mt-0.5 text-violet-400 shrink-0">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {!isLoggedIn && (
                    <p className="mt-4 rounded-xl bg-amber-500/10 px-3 py-2.5 text-xs text-amber-200 ring-1 ring-amber-400/20">
                      Necesitas iniciar sesión para suscribirte.
                    </p>
                  )}

                  {/* Botón pago */}
                  <motion.button
                    type="button"
                    onClick={handlePayment}
                    disabled={!isLoggedIn || step === 'pay'}
                    whileTap={{ scale: 0.98 }}
                    className={`mt-5 w-full rounded-2xl py-3 text-sm font-bold transition ${
                      step === 'pay'
                        ? 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-400/30 cursor-wait'
                        : !isLoggedIn
                          ? 'bg-slate-800/60 text-slate-600 ring-1 ring-slate-700/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-violet-500/30 to-indigo-500/20 text-violet-100 ring-1 ring-violet-400/45 hover:from-violet-500/40'
                    }`}
                  >
                    {step === 'pay' ? 'Procesando pago…' : 'Pagar $2.00 / mes'}
                  </motion.button>

                  <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-700">
                    Demo simulada · Ningún cargo real se procesará.
                    <br />
                    Suscripción activa por 30 días (simulados).
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
