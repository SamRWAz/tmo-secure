import { useGuardian } from '../../context/GuardianContext'

function formatWhen(ts: number) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts))
}

const TYPE_LABELS = {
  'download-blocked': 'Descarga bloqueada',
  'redirect-blocked': 'Redirección neutralizada',
} as const

export function GuardianBlocksPanel() {
  const { securityEvents, blockedDownloadsThisChapter, refreshSecurityEvents } =
    useGuardian()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-2 border-b border-slate-800 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Bloqueos del Guardian</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            En este capítulo:{' '}
            <span className="font-semibold text-cyan-300">
              {blockedDownloadsThisChapter}
            </span>{' '}
            descarga(s) detenida(s)
          </p>
        </div>
        <button
          type="button"
          onClick={refreshSecurityEvents}
          className="shrink-0 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300"
        >
          Actualizar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {securityEvents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-700/80 bg-slate-950/50 px-4 py-8 text-center text-sm text-slate-400">
            Sin bloqueos registrados. Si haces scroll muy rápido en el lector o abres un
            capítulo con ruta sucia, aparecerán aquí.
          </p>
        ) : (
          <ul className="space-y-2">
            {securityEvents.map((ev) => (
              <li
                key={ev.id}
                className="rounded-xl border border-white/[0.05] bg-slate-950/60 px-3 py-2.5 ring-1 ring-slate-800/80"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-amber-300/90">
                    {TYPE_LABELS[ev.type]}
                  </span>
                  <time className="text-[10px] text-slate-600">{formatWhen(ev.at)}</time>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-200">{ev.label}</p>
                {ev.detail && (
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{ev.detail}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
