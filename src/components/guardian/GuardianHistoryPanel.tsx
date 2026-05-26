import { Link } from 'react-router-dom'
import { getCategoryLabel } from '../../data/categoryLabels'
import { useReadingHistory } from '../../context/ReadingHistoryContext'
import { useUser } from '../../context/UserContext'
import { recommendMangaForUser } from '../../lib/readingHistory'
import { useGuardian } from '../../context/GuardianContext'

function formatWhen(ts: number) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts))
}

export function GuardianHistoryPanel() {
  const { history, hasHistory } = useReadingHistory()
  const { userId, user, hasConsent } = useUser()
  const { setBunkerOpen } = useGuardian()
  const recs = hasHistory ? recommendMangaForUser(4, userId) : []

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-100">Historial de lectura</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          {user && hasConsent
            ? `Seguimiento activo para ${user.name}`
            : 'Lecturas en este dispositivo (invitado)'}
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {!hasHistory ? (
          <p className="rounded-xl border border-dashed border-slate-700/80 bg-slate-950/50 px-4 py-8 text-center text-sm text-slate-400">
            Aún no hay capítulos. Abre el lector de cualquier manga y aparecerán aquí.
          </p>
        ) : (
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={`${h.mangaId}-${h.chapterId}`}>
                <Link
                  to={`/manga/${h.mangaId}/read/${h.chapterId}`}
                  onClick={() => setBunkerOpen(false)}
                  className="block rounded-xl border border-white/[0.05] bg-slate-950/60 px-3 py-2.5 transition hover:border-cyan-500/25 hover:bg-slate-900"
                >
                  <p className="font-medium text-slate-100">{h.mangaTitle}</p>
                  <p className="text-xs text-slate-400">
                    Cap. {h.chapterNumber}: {h.chapterTitle}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-600">{formatWhen(h.readAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {recs.length > 0 && (
          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Sugerencias según tu historial
            </p>
            <ul className="mt-2 space-y-2">
              {recs.map((m) => (
                <li key={m.id}>
                  <Link
                    to={`/manga/${m.id}`}
                    onClick={() => setBunkerOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm ring-1 ring-slate-800 hover:bg-slate-800/80 hover:text-cyan-200"
                  >
                    <span className="font-semibold text-slate-200">{m.title}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {m.categories.map(getCategoryLabel).join(' · ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
