import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getSpeciesMeta } from '../data/guardianSpecies'
import { useGuardian } from '../context/GuardianContext'
import { useUser } from '../context/UserContext'
import { GuardianChat } from './GuardianChat'
import { GuardianBlocksPanel } from './guardian/GuardianBlocksPanel'
import { GuardianFiltersPanel } from './guardian/GuardianFiltersPanel'
import { GuardianHistoryPanel } from './guardian/GuardianHistoryPanel'

export type BunkerTab = 'chat' | 'history' | 'blocks' | 'filters'

const TABS: { id: BunkerTab; label: string; short: string }[] = [
  { id: 'chat', label: 'Chat', short: '💬' },
  { id: 'filters', label: 'Filtros', short: '🎯' },
  { id: 'history', label: 'Historial', short: '📖' },
  { id: 'blocks', label: 'Bloqueos', short: '🛡️' },
]

function BunkerPanel() {
  const { setBunkerOpen, species, refreshSecurityEvents } = useGuardian()
  const { user, isLoggedIn } = useUser()
  const [tab, setTab] = useState<BunkerTab>('chat')
  const speciesMeta = getSpeciesMeta(species)

  useEffect(() => {
    refreshSecurityEvents()
  }, [refreshSecurityEvents])

  return (
    <>
          <motion.button
            type="button"
            aria-label="Cerrar panel del guardián"
            className="pointer-events-auto absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBunkerOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bunker-title"
            className="pointer-events-auto fixed bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] right-[max(1rem,env(safe-area-inset-right))] z-10 flex h-[min(32rem,calc(100dvh-7rem))] w-[min(100vw-2rem,28rem)] overflow-hidden rounded-2xl border border-cyan-400/25 bg-slate-900/98 shadow-[0_24px_80px_-16px_rgb(0_0_0_/_0.7),0_0_40px_-12px_rgb(34_211_238_/_0.15)] ring-1 ring-white/[0.08] backdrop-blur-xl sm:w-[32rem]"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full min-h-0 w-full">
              {/* Contenido principal */}
              <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-800 px-3 py-2.5">
                  <div className="min-w-0">
                    <p
                      id="bunker-title"
                      className="truncate text-sm font-semibold text-slate-50"
                    >
                      {speciesMeta.emoji} Guardian
                      {isLoggedIn && user ? (
                        <span className="font-normal text-slate-400">
                          {' '}
                          · {user.name}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {TABS.find((t) => t.id === tab)?.label}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      to="/guardian"
                      onClick={() => setBunkerOpen(false)}
                      className="rounded-lg px-2 py-1 text-[10px] font-medium text-cyan-400/90 hover:bg-slate-800"
                      title="Ajustes del guardián"
                    >
                      Ajustes
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBunkerOpen(false)}
                      className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                      aria-label="Cerrar"
                    >
                      ✕
                    </button>
                  </div>
                </header>

                <div className="min-h-0 flex-1">
                  {tab === 'chat' && <GuardianChat />}
                  {tab === 'filters' && <GuardianFiltersPanel />}
                  {tab === 'history' && <GuardianHistoryPanel />}
                  {tab === 'blocks' && <GuardianBlocksPanel />}
                </div>
              </div>

              {/* Barra lateral junto al bot (borde derecho del panel, hacia el FAB) */}
              <nav
                className="flex w-14 shrink-0 flex-col border-l border-slate-800 bg-slate-950/90 py-2"
                aria-label="Secciones del Guardian"
              >
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    title={t.label}
                    className={`mx-1.5 flex flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[10px] font-semibold transition ${
                      tab === t.id
                        ? 'bg-cyan-500/20 text-cyan-100 ring-1 ring-cyan-400/40'
                        : 'text-slate-500 hover:bg-slate-800/80 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-base leading-none" aria-hidden>
                      {t.short}
                    </span>
                    <span className="leading-tight">{t.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
    </>
  )
}

export function SecurityBunker() {
  const location = useLocation()
  const { bunkerOpen, setBunkerOpen } = useGuardian()

  useEffect(() => {
    if (location.pathname === '/guardian') setBunkerOpen(false)
  }, [location.pathname, setBunkerOpen])

  return (
    <AnimatePresence>
      {bunkerOpen && (
        <motion.div
          key="security-bunker"
          role="presentation"
          className="fixed inset-0 z-[55] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <BunkerPanel />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
