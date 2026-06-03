import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { catalog, coverAsset } from '../data/catalog'
import { MangaCover } from './MangaCover'
import { MangaGenreTags } from './MangaGenreTags'

const FEATURED_IDS = ['guardian-code', 'ink-memories', 'echo-garden', 'ghost-band', 'summer-haze', 'cyber-healer']
const INTERVAL_MS = 6000

export function HeroSlider() {
  const featured = FEATURED_IDS.map((id) => catalog.find((m) => m.id === id))
    .filter((m): m is (typeof catalog)[number] => !!m && !m.isAdult && !m.requiresTokens)

  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIdx((i) => (i + 1) % featured.length)
    }, INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [idx, featured.length])

  const manga = featured[idx]
  if (!manga) return null

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/70 shadow-[0_32px_80px_-24px_rgb(0_0_0_/_0.7)] ring-1 ring-cyan-500/10">
      {/* Fondo desenfocado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={manga.id + '-bg'}
          className="pointer-events-none absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={manga.coverUrl}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-center opacity-15 blur-2xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8 lg:p-10">
        {/* Texto */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/90">
            TMO Secure · Destacado
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={manga.id + '-text'}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="mt-2.5 text-balance text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                {manga.title}
              </h2>
              <p className="mt-1.5 text-sm font-medium text-slate-400">{manga.author}</p>

              <div className="mt-4">
                <MangaGenreTags categories={manga.categories} clickable />
              </div>

              <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-relaxed text-slate-300/90">
                {manga.synopsis}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={`/manga/${manga.id}/read/${manga.chapters[0]?.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/30 via-cyan-500/20 to-teal-600/15 px-5 py-2.5 text-sm font-bold text-cyan-50 ring-2 ring-cyan-400/50 transition hover:ring-cyan-300/70"
                >
                  🛡️ Leer ahora
                </Link>
                <Link
                  to={`/manga/${manga.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.1]"
                >
                  Ver ficha →
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Portada */}
        <AnimatePresence mode="wait">
          <motion.div
            key={manga.id + '-cover'}
            className="mx-auto w-36 shrink-0 overflow-hidden rounded-2xl shadow-[0_24px_60px_-12px_rgb(0_0_0_/_0.8)] ring-1 ring-white/[0.12] sm:mx-0 sm:w-44 lg:w-52"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
          >
            <MangaCover
              mangaId={manga.id}
              src={manga.coverUrl}
              svgFallback={coverAsset(manga.id).svg}
              alt={manga.title}
              title={manga.title}
              className="aspect-[5/7] w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles inferiores */}
      <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/[0.05] px-6 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          {featured.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ver ${m.title}`}
              className={`rounded-full transition-all duration-300 ${
                i === idx
                  ? 'h-2 w-6 bg-cyan-400 shadow-[0_0_8px_rgb(34_211_238_/_0.6)]'
                  : 'h-2 w-2 bg-slate-600 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Barra de progreso auto-avance (CSS animation, sin setState en efecto) */}
        <div className="h-0.5 flex-1 max-w-24 overflow-hidden rounded-full bg-slate-800">
          <div
            key={idx}
            className="h-full rounded-full bg-cyan-400/70"
            style={{
              animation: `heroProgress ${INTERVAL_MS}ms linear forwards`,
            }}
          />
        </div>
        <style>{`
          @keyframes heroProgress {
            from { width: 0% }
            to   { width: 100% }
          }
        `}</style>
      </div>
    </div>
  )
}
