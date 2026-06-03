import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'

export function RegisterPage() {
  const { register, isLoggedIn } = useUser()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  if (isLoggedIn) {
    navigate('/', { replace: true })
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    const res = register(name, email, password, consent)
    if (!res.ok) {
      setError(res.error ?? 'No se pudo crear la cuenta.')
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto max-w-md py-6">
      <motion.div
        className="rounded-3xl border border-white/[0.08] bg-slate-900/70 p-7 shadow-[0_24px_60px_-20px_rgb(0_0_0_/_0.65)] ring-1 ring-cyan-500/15 backdrop-blur-sm sm:p-9"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Cabecera */}
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-cyan-400/90">
          TMO Secure · Registro
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Crea tu cuenta
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Tu Guardian te saludará por nombre y recordará lo que lees para recomendarte
          mejor contenido. Todo queda en este dispositivo.
        </p>

        {/* Tokens de bienvenida */}
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-amber-400/25 bg-amber-500/8 px-3.5 py-3">
          <span className="text-xl">🪙</span>
          <p className="text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-amber-200">5 tokens de bienvenida</span>{' '}
            — úsalos para leer capítulos premium.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="reg-name" className="text-xs font-medium text-slate-400">
              Nombre
            </label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="¿Cómo te llamas?"
              required
              autoComplete="name"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/35"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/35"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="reg-password" className="text-xs font-medium text-slate-400">
              Contraseña
            </label>
            <div className="relative mt-1.5">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 pr-11 text-sm text-slate-100 placeholder-slate-600 transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="reg-confirm" className="text-xs font-medium text-slate-400">
              Confirmar contraseña
            </label>
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/35"
            />
          </div>

          {/* Consentimiento */}
          <label className="flex cursor-pointer gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-left">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 text-cyan-500 focus:ring-cyan-400/30"
            />
            <span className="text-xs leading-relaxed text-slate-400">
              Autorizo a TMO Secure a guardar mi{' '}
              <strong className="text-slate-300">nombre</strong> e{' '}
              <strong className="text-slate-300">historial de lectura</strong> en este
              dispositivo para personalizar las recomendaciones del Guardian. Puedo
              eliminar mis datos en cualquier momento desde mi cuenta.
            </span>
          </label>

          {error && (
            <p className="rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200 ring-1 ring-rose-400/30">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-500/30 via-cyan-500/20 to-teal-600/15 py-3 text-sm font-bold text-cyan-50 ring-2 ring-cyan-400/45 transition hover:ring-cyan-300/60"
          >
            Crear cuenta y empezar
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="font-semibold text-cyan-400 hover:text-cyan-300">
            Inicia sesión
          </Link>
        </p>

        <p className="mt-5 rounded-xl bg-slate-950/60 px-3 py-3 text-center text-[10px] leading-relaxed text-slate-600">
          Demo educativa · Los datos se guardan solo en este navegador.
          <br />
          No se envía información a ningún servidor externo.
        </p>
      </motion.div>
    </div>
  )
}
