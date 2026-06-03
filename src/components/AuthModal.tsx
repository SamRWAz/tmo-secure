import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

type AuthModalProps = {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { user, login, logout, isLoggedIn, isActiveSubscription } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function close() {
    setError(null)
    onClose()
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = login(email, password)
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
                  Hola,{' '}
                  <span className="font-semibold text-cyan-200">{user.name}</span>.
                </p>
                <p className="mt-1 text-xs text-slate-500">{user.email}</p>

                {/* Estado suscripción */}
                {isActiveSubscription ? (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-violet-500/10 px-3 py-2 ring-1 ring-violet-400/25">
                    <span className="text-sm">⭐</span>
                    <span className="text-xs font-semibold text-violet-200">Premium activo</span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/8 px-3 py-2 ring-1 ring-amber-400/20">
                    <span className="text-sm">🪙</span>
                    <span className="text-xs text-slate-400">
                      <span className="font-semibold text-amber-200">{user.tokens} tokens</span> disponibles
                    </span>
                  </div>
                )}

                <Link
                  to="/cuenta"
                  onClick={close}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-cyan-500/20 py-2.5 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-400/40 transition hover:bg-cyan-500/30"
                >
                  Ir a mi cuenta
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); close() }}
                  className="mt-2 w-full rounded-xl border border-slate-700 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <h2 id="auth-title" className="text-lg font-bold text-white">
                  Iniciar sesión
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  El Guardian te saluda por nombre y personaliza tus recomendaciones.
                </p>

                <form onSubmit={handleLogin} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="login-email" className="text-xs font-medium text-slate-400">
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      autoComplete="email"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>

                  <div>
                    <label htmlFor="login-password" className="text-xs font-medium text-slate-400">
                      Contraseña
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      required
                      autoComplete="current-password"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200 ring-1 ring-rose-400/30">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500/30 to-teal-600/20 py-2.5 text-sm font-bold text-cyan-50 ring-1 ring-cyan-400/45 transition hover:ring-cyan-300/60"
                  >
                    Entrar
                  </button>
                </form>

                <div className="mt-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-xs text-slate-600">¿Nuevo aquí?</span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                <Link
                  to="/registro"
                  onClick={close}
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  Crear cuenta gratuita →
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
