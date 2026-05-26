import { motion } from 'framer-motion'
import { GUARDIAN_FILTERS, type GuardianFilterId } from '../data/guardianFilters'

type Props = {
  activeId: GuardianFilterId
  onChange: (id: GuardianFilterId) => void
}

export function GuardianFilterBar({ activeId, onChange }: Props) {
  return (
    <section
      className="relative mb-9 overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/45 p-5 shadow-[0_16px_48px_-20px_rgb(0_0_0_/_0.5)] ring-1 ring-cyan-500/10 backdrop-blur-md sm:p-6"
      aria-label="Filtros sugeridos por el Guardian"
    >
      <div className="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-cyan-500/8 blur-2xl" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400/95">
            Guardian · filtros activos
          </p>
          <h2 className="mt-1.5 text-base font-bold tracking-tight text-white sm:text-lg">
            Patrones que ya escaneé para tu búsqueda
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            No son filtros genéricos del sitio: cada chip resume una heurística que aplico
            al catálogo demo. Pasa el dedo o el cursor para leer mi nota en cada uno.
          </p>
        </div>
      </div>

      <div className="relative mt-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-slate-900/95 to-transparent sm:w-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-slate-900/95 to-transparent sm:w-10" />
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-1 [scrollbar-color:rgb(51_65_85)_transparent] [scrollbar-width:thin]">
          {GUARDIAN_FILTERS.map((f) => {
            const active = f.id === activeId
            return (
              <motion.button
                key={f.id}
                type="button"
                title={f.voice}
                aria-pressed={active}
                onClick={() => onChange(f.id)}
                className={`relative shrink-0 rounded-full px-4 py-2.5 text-left text-xs font-semibold transition-shadow sm:text-sm ${
                  active
                    ? 'bg-gradient-to-b from-cyan-400/25 to-cyan-600/15 text-cyan-50 shadow-[0_0_20px_-4px_rgb(34_211_238_/_0.45)] ring-2 ring-cyan-400/60'
                    : 'bg-slate-950/70 text-slate-300 ring-1 ring-white/[0.08] hover:bg-slate-800/80 hover:ring-cyan-500/30'
                }`}
                whileTap={{ scale: 0.97 }}
                layout
              >
                <span className="block whitespace-nowrap">{f.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
