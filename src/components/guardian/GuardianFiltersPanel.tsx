import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GUARDIAN_FILTERS, type GuardianFilterId } from '../../data/guardianFilters'
import { useGuardian } from '../../context/GuardianContext'

export function GuardianFiltersPanel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeId = (searchParams.get('filter') ?? 'all') as GuardianFilterId
  const { setStatusMessage, setBunkerOpen } = useGuardian()

  function applyFilter(id: GuardianFilterId) {
    const params = new URLSearchParams(searchParams)
    if (id === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', id)
    }
    const f = GUARDIAN_FILTERS.find((x) => x.id === id)!
    setStatusMessage(
      id === 'all'
        ? 'Sin filtros extra: te muestro el catálogo completo.'
        : `Acoto el radar a "${f.label}". ${f.voice}`,
    )
    navigate(`/?${params.toString()}`, { replace: true })
    setBunkerOpen(false)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-100">Filtros del Guardian</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Aplico heurísticas de seguridad y tono al catálogo.
        </p>
      </div>

      <ul className="flex-1 space-y-1.5 overflow-y-auto p-3">
        {GUARDIAN_FILTERS.map((f) => {
          const active = f.id === activeId
          return (
            <li key={f.id}>
              <motion.button
                type="button"
                onClick={() => applyFilter(f.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                  active
                    ? 'bg-cyan-500/20 ring-1 ring-cyan-400/50'
                    : 'hover:bg-slate-800/80 ring-1 ring-transparent'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    active ? 'text-cyan-100' : 'text-slate-200'
                  }`}
                >
                  {f.label}
                  {active && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-cyan-400">
                      activo
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{f.voice}</p>
              </motion.button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
