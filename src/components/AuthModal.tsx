import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

type AuthModalProps = {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { user, login, register, logout, isLoggedIn } = useUser()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function close() {
    setError(null)
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (mode === 'register') {
      const res = register(name, consent)
      if (!res.ok) {
        setError(res.error ?? 'No se pudo registrar.')
        return
      }
      close()
      return
    }
    const res = login(name)
    if (!res.ok) {
      setError(res.error ?? 'No se pudo iniciar sesión.')
      return
    }
    close()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/[0.08] bg-slate-900 p-6 shadow-2xl ring-1 ring-cyan-500/20"
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {isLoggedIn && user ? (
              <>
                <h2 id="auth-title" className="text-lg font-bold text-white">
                  Tu cuenta
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Hola, <span className="font-semibold text-cyan-200">{user.name}</span>.
                  El Guardian usa tu nombre y sigue tu historial con tu consentimiento.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Consentimiento otorgado el{' '}
                  {new Date(user.consentAt).toLocaleDateString('es')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setName('')
                    setConsent(false)
                  }}
                  className="mt-6 w-full rounded-xl border border-slate-700 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cerrar sesión
                </button>
                <Link
                  to="/cuenta"
                  onClick={close}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-cyan-500/20 py-2.5 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-400/40"
                >
                  Ir a mi cuenta
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 w-full rounded-xl border border-slate-700 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2 id="auth-title" className="text-lg font-bold text-white">
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  El Guardian puede saludarte por nombre y personalizar recomendaciones.
                </p>

                <div className="mt-4 flex gap-2 rounded-xl bg-slate-950/80 p-1 ring-1 ring-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login')
                      setError(null)
                    }}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold ${mode === 'login' ? 'bg-cyan-500/20 text-cyan-100' : 'text-slate-500'}`}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register')
                      setError(null)
                    }}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold ${mode === 'register' ? 'bg-cyan-500/20 text-cyan-100' : 'text-slate-500'}`}
                  >
                    Registrarse
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="auth-name" className="text-xs font-medium text-slate-400">
                      Nombre
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="¿Cómo te llamas?"
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                      autoComplete="name"
                    />
                  </div>

                  {mode === 'register' && (
                    <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-400/30"
                      />
                      <span className="text-xs leading-relaxed text-slate-400">
                        Autorizo a TMO Secure a usar mi <strong className="text-slate-300">nombre</strong>{' '}
                        y a guardar mi <strong className="text-slate-300">historial de lectura</strong>{' '}
                        en este dispositivo para recomendaciones del Guardian. Puedo cerrar sesión
                        cuando quiera.
                      </span>
                    </label>
                  )}

                  {error && (
                    <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-200 ring-1 ring-rose-400/30">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500/30 to-teal-600/20 py-2.5 text-sm font-bold text-cyan-50 ring-1 ring-cyan-400/45"
                  >
                    {mode === 'login' ? 'Entrar' : 'Registrarme'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
