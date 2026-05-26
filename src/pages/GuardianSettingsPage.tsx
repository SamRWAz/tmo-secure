import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  useGuardian,
  type GuardianAutonomy,
  type GuardianSpecies,
} from '../context/GuardianContext'
import { GUARDIAN_SPECIES_OPTIONS } from '../data/guardianSpecies'
import { useReadingHistory } from '../context/ReadingHistoryContext'
import { getCategoryLabel } from '../data/categoryLabels'
import { getTopCategoriesFromHistory } from '../lib/readingHistory'
import { useUser } from '../context/UserContext'

const levels: { id: GuardianAutonomy; title: string; body: string }[] = [
  {
    id: 'caution',
    title: 'Precaución',
    body:
      'El Guardian es más sensible al scroll rápido y avisa antes. Ideal si sueles topar sitios agresivos.',
  },
  {
    id: 'balanced',
    title: 'Equilibrado',
    body:
      'Equilibrio entre comodidad y vigilancia. Recomendado para la mayoría de lecturas diarias.',
  },
  {
    id: 'explore',
    title: 'Exploración',
    body:
      'Menos interrupciones: solo alertas claras. Úsalo cuando confías en la ruta y quieres fluir más.',
  },
]

export function GuardianSettingsPage() {
  const { autonomy, setAutonomy, species, setSpecies, setStatusMessage, securityEvents } =
    useGuardian()
  const { history } = useReadingHistory()
  const { userId, isLoggedIn, hasConsent } = useUser()

  const stats = useMemo(() => {
    const storageId = isLoggedIn && hasConsent ? userId : 'guest'
    const uniqueMangas = new Set(history.map((h) => h.mangaId)).size
    const totalChapters = history.length
    const topCats = getTopCategoriesFromHistory(1, storageId)
    const favoriteGenre = topCats.length > 0 ? getCategoryLabel(topCats[0]) : '—'
    const totalBlocks = securityEvents.length
    return { uniqueMangas, totalChapters, favoriteGenre, totalBlocks }
  }, [history, securityEvents, userId, isLoggedIn, hasConsent])

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-white/[0.06] bg-slate-900/40 p-6 shadow-[0_24px_60px_-30px_rgb(0_0_0_/_0.55)] ring-1 ring-slate-800/50 backdrop-blur-sm sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400/95">
          Configuración del Guardián
        </p>
        <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Tu Guardian en TMO Secure
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Elige la mascota del asistente y el nivel de autonomía. Las redirecciones “tóxicas”
          de la demo ya no te sacan del visor: se neutralizan y verás un aviso junto al FAB.
        </p>

        {/* Estadísticas */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { label: 'Mangas leídos', value: stats.uniqueMangas, icon: '📚' },
            { label: 'Capítulos leídos', value: stats.totalChapters, icon: '📖' },
            { label: 'Género favorito', value: stats.favoriteGenre, icon: '🏷️' },
            { label: 'Eventos de seguridad', value: stats.totalBlocks, icon: '🛡️' },
          ].map((s) => (
            <motion.div
              key={s.label}
              className="flex flex-col gap-1 rounded-2xl border border-white/[0.06] bg-slate-950/50 p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-xl leading-none">{s.icon}</span>
              <span className="mt-1 text-2xl font-bold text-white tabular-nums">{s.value}</span>
              <span className="text-xs text-slate-500">{s.label}</span>
            </motion.div>
          ))}
        </div>

        <h2 className="mt-10 text-xs font-bold uppercase tracking-wider text-slate-500">
          Mascota del guardián
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {GUARDIAN_SPECIES_OPTIONS.map((sp, i) => {
            const active = species === sp.id
            return (
              <motion.button
                key={sp.id}
                type="button"
                onClick={() => {
                  setSpecies(sp.id as GuardianSpecies)
                  setStatusMessage(sp.idleGreeting)
                }}
                className={`flex flex-col items-center rounded-2xl border p-3.5 text-center transition ${
                  active
                    ? 'border-cyan-400/50 bg-gradient-to-b from-cyan-500/20 to-slate-900/80 shadow-[0_0_24px_-6px_rgb(34_211_238_/_0.35)] ring-1 ring-cyan-400/45'
                    : 'border-white/[0.06] bg-slate-950/50 hover:border-slate-600 hover:bg-slate-900/60'
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl" aria-hidden>
                  {sp.emoji}
                </span>
                <span className="mt-2 text-xs font-semibold text-slate-100">{sp.label}</span>
              </motion.button>
            )
          })}
        </div>

        <h2 className="mt-10 text-xs font-bold uppercase tracking-wider text-slate-500">
          Autonomía
        </h2>
        <div className="mt-3 space-y-2.5">
          {levels.map((lvl, i) => {
            const active = autonomy === lvl.id
            return (
              <motion.button
                key={lvl.id}
                type="button"
                onClick={() => {
                  setAutonomy(lvl.id)
                  setStatusMessage(
                    lvl.id === 'explore'
                      ? 'Modo exploración: te doy más aire, pero sigo aquí si aparece algo raro.'
                      : lvl.id === 'caution'
                        ? 'Modo precaución: vigilo cada movimiento brusco del scroll.'
                        : 'Modo equilibrado: seguridad sin ahogar la lectura.',
                  )
                }}
                className={`flex w-full flex-col rounded-2xl border p-4 text-left transition ${
                  active
                    ? 'border-cyan-400/45 bg-cyan-500/10 ring-1 ring-cyan-400/40'
                    : 'border-white/[0.06] bg-slate-950/40 hover:border-slate-600'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-sm font-bold text-white">{lvl.title}</span>
                <span className="mt-1 text-sm leading-relaxed text-slate-400">{lvl.body}</span>
              </motion.button>
            )
          })}
        </div>

        <motion.div
          className="mt-8 rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-500/10 to-transparent p-4 text-sm leading-relaxed text-rose-100/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Las alertas de descarga son{' '}
          <span className="font-semibold text-rose-200">simulaciones educativas</span>. Las
          redirecciones “maliciosas” de la demo se traducen en un aviso junto al guardián y
          en lectura normal dentro del visor.
        </motion.div>
      </div>
    </div>
  )
}
