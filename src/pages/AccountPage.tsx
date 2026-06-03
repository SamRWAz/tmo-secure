import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useReadingHistory } from '../context/ReadingHistoryContext'
import { useGuardian } from '../context/GuardianContext'
import { getDataSummary } from '../lib/userData'
import { AdWatchModal } from '../components/AdWatchModal'
import { SubscribeModal } from '../components/SubscribeModal'

export function AccountPage() {
  const {
    user,
    isLoggedIn,
    updateName,
    deleteReadingHistory,
    deleteAllData,
    logout,
    addTokens,
    isActiveSubscription,
  } = useUser()
  const { refreshHistory } = useReadingHistory()
  const { refreshSecurityEvents } = useGuardian()
  const [name, setName] = useState(user?.name ?? '')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adWatchOpen, setAdWatchOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />
  }

  const summary = getDataSummary(user.id)

  function showOk(text: string) {
    setMessage(text)
    setError(null)
  }

  function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    const res = updateName(name)
    if (!res.ok) {
      setError(res.error ?? 'No se pudo guardar.')
      setMessage(null)
      return
    }
    showOk('Nombre actualizado.')
  }

  function handleClearHistory() {
    if (
      !window.confirm(
        '¿Borrar todo tu historial de lectura? Esta acción no se puede deshacer.',
      )
    ) {
      return
    }
    deleteReadingHistory()
    refreshHistory()
    refreshSecurityEvents()
    showOk('Historial de lectura eliminado.')
  }

  function handleDeleteAll() {
    if (
      !window.confirm(
        '¿Eliminar TODOS tus datos locales (historial, valoraciones, comentarios, chat y cuenta)? Se cerrará la sesión.',
      )
    ) {
      return
    }
    deleteAllData()
    refreshHistory()
    refreshSecurityEvents()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AdWatchModal
        open={adWatchOpen}
        onClose={() => setAdWatchOpen(false)}
        onEarned={(t) => addTokens(t)}
      />
      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />

      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400/95">
        Tu espacio
      </p>
      <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Mi cuenta</h1>
      <p className="mt-2 text-sm text-slate-400">
        Todo se guarda en este navegador (sin servidor). Puedes editar tu nombre o borrar
        tus datos cuando quieras.
      </p>

      {/* Tokens y suscripción */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 ring-1 ring-amber-400/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tokens</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-amber-200">🪙 {user.tokens}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">1 token = 1 capítulo premium desbloqueado</p>
          <button
            type="button"
            onClick={() => setAdWatchOpen(true)}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 transition text-center"
          >
            📺 Ver anuncio (+3 tokens)
          </button>
        </div>

        <div className={`flex flex-col gap-3 rounded-2xl p-4 ${isActiveSubscription ? 'border border-violet-500/30 bg-violet-500/[0.08] ring-1 ring-violet-400/15' : 'border border-slate-700/50 bg-slate-900/50 ring-1 ring-slate-800'}`}>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Suscripción</p>
            {isActiveSubscription ? (
              <>
                <p className="mt-1 text-lg font-bold text-violet-200">⭐ Premium activo</p>
                <p className="text-xs text-slate-400">Acceso ilimitado a contenido premium</p>
              </>
            ) : (
              <>
                <p className="mt-1 text-lg font-bold text-slate-300">Sin suscripción</p>
                <p className="text-xs text-slate-500">Suscríbete por $2/mes</p>
              </>
            )}
          </div>
          {!isActiveSubscription && (
            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-200 hover:bg-violet-500/20 transition"
            >
              ⭐ Suscribirse · $2/mes
            </button>
          )}
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-white/[0.06] bg-slate-900/50 p-5 ring-1 ring-slate-800/80">
        <h2 className="text-sm font-semibold text-slate-100">Perfil</h2>
        <p className="mt-1 text-xs text-slate-500">{user.email}</p>
        <form onSubmit={handleSaveName} className="mt-4 space-y-3">
          <div>
            <label htmlFor="account-name" className="text-xs text-slate-500">
              Nombre (lo usa el Guardian)
            </label>
            <input
              id="account-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-400/40 hover:bg-cyan-500/30"
          >
            Guardar nombre
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500">
          Consentimiento de datos:{' '}
          <span className="text-slate-400">
            {new Date(user.consentAt).toLocaleString('es')}
          </span>
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-white/[0.06] bg-slate-900/50 p-5 ring-1 ring-slate-800/80">
        <h2 className="text-sm font-semibold text-slate-100">Datos guardados aquí</h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <li className="rounded-xl bg-slate-950/60 px-3 py-2 ring-1 ring-slate-800">
            <span className="block text-2xl font-bold tabular-nums text-cyan-300">
              {summary.historyCount}
            </span>
            <span className="text-xs text-slate-500">Capítulos en historial</span>
          </li>
          <li className="rounded-xl bg-slate-950/60 px-3 py-2 ring-1 ring-slate-800">
            <span className="block text-2xl font-bold tabular-nums text-cyan-300">
              {summary.ratingsCount}
            </span>
            <span className="text-xs text-slate-500">Valoraciones tuyas</span>
          </li>
          <li className="rounded-xl bg-slate-950/60 px-3 py-2 ring-1 ring-slate-800">
            <span className="block text-2xl font-bold tabular-nums text-cyan-300">
              {summary.commentsCount}
            </span>
            <span className="text-xs text-slate-500">Comentarios</span>
          </li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 ring-1 ring-amber-500/20">
        <h2 className="text-sm font-semibold text-amber-100">Privacidad</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Derecho al olvido: puedes borrar solo el historial o eliminar todos los datos
          locales de la demo. No hay copia en la nube.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleClearHistory}
            className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
          >
            Borrar historial de lectura
          </button>
          <button
            type="button"
            onClick={handleDeleteAll}
            className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 hover:bg-rose-500/20"
          >
            Eliminar todos mis datos
          </button>
        </div>
      </section>

      {message && (
        <p className="mt-4 rounded-lg bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 ring-1 ring-cyan-400/30">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200 ring-1 ring-rose-400/30">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Cerrar sesión
        </button>
        <Link
          to="/"
          className="rounded-xl px-4 py-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
