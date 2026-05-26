import { useMemo, useState } from 'react'
import { getSeedComments } from '../data/seedComments'
import {
  addComment,
  getCommentsForManga,
  type MangaComment,
} from '../lib/userComments'

function formatDate(ts: number) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(ts))
}

export function MangaComments({ mangaId }: { mangaId: string }) {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [refresh, setRefresh] = useState(0)

  const comments = useMemo(() => {
    const user = getCommentsForManga(mangaId)
    const seed = getSeedComments(mangaId)
    const merged: MangaComment[] = [...user, ...seed]
    merged.sort((a, b) => b.createdAt - a.createdAt)
    return merged
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh tras enviar
  }, [mangaId, refresh])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    addComment(mangaId, author, text)
    setText('')
    setRefresh((n) => n + 1)
  }

  return (
    <section className="mt-10 border-t border-white/[0.06] pt-10">
      <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
        Comentarios
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Opiniones de la comunidad demo. Los tuyos se guardan en este dispositivo.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-3 rounded-2xl border border-white/[0.06] bg-slate-950/50 p-4 ring-1 ring-slate-800/60"
      >
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Tu nombre (opcional)"
          className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu comentario…"
          rows={3}
          required
          className="w-full resize-y rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
        />
        <button
          type="submit"
          className="rounded-xl bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-400/40 transition hover:bg-cyan-500/30"
        >
          Publicar comentario
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {comments.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-slate-700/80 px-4 py-8 text-center text-sm text-slate-500">
            Sé el primero en comentar este título.
          </li>
        ) : (
          comments.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-white/[0.05] bg-slate-950/40 px-4 py-3.5 ring-1 ring-slate-800/50"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-slate-200">
                  {c.author}
                  {c.isUser && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-cyan-400/90">
                      Tú
                    </span>
                  )}
                </span>
                <time className="text-xs text-slate-500" dateTime={new Date(c.createdAt).toISOString()}>
                  {formatDate(c.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{c.text}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
