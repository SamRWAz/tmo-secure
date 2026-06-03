import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { coverAsset } from '../data/catalog'
import type { Manga } from '../types/manga'
import { MangaCover } from './MangaCover'
import { useReadingHistory } from '../context/ReadingHistoryContext'

type Props = { manga: Manga; index?: number }

export function MangaCard({ manga, index = 0 }: Props) {
  const { history } = useReadingHistory()

  const { readCount } = useMemo(() => {
    const readIds = new Set(
      history.filter((h) => h.mangaId === manga.id).map((h) => h.chapterId),
    )
    return { readCount: readIds.size }
  }, [history, manga.id])

  const totalChapters = manga.chapters.length
  const progressPct = totalChapters > 0 ? (readCount / totalChapters) * 100 : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.28 }}
      className="group relative"
    >
      <Link
        to={`/manga/${manga.id}`}
        className="block overflow-hidden rounded-2xl bg-slate-900/80 shadow-[0_12px_40px_-12px_rgb(0_0_0_/_0.55)] ring-1 ring-white/[0.06] transition-[box-shadow,transform,ring-color] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_rgb(0_0_0_/_0.65),0_0_0_1px_rgb(34_211_238_/_0.25)] hover:ring-cyan-400/35"
      >
        <div className="relative aspect-[5/7] overflow-hidden">
          <motion.div
            className="h-full w-full"
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <MangaCover
              mangaId={manga.id}
              src={manga.coverUrl}
              svgFallback={coverAsset(manga.id).svg}
              alt={manga.title}
              title={manga.title}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-indigo-600/0 opacity-0 transition-opacity duration-300 group-hover:opacity-25" />
          {/* Badge adulto / premium */}
          {manga.isAdult ? (
            <div className="absolute right-2 top-2 rounded-full bg-rose-500/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-100 ring-1 ring-rose-400/50 backdrop-blur-sm">
              🔞
            </div>
          ) : manga.requiresTokens ? (
            <div className="absolute right-2 top-2 rounded-full bg-amber-500/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-100 ring-1 ring-amber-400/40 backdrop-blur-sm">
              🔒
            </div>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
            <p className="line-clamp-2 text-left text-sm font-semibold leading-snug text-white drop-shadow-[0_2px_8px_rgb(0_0_0_/_0.85)]">
              {manga.title}
            </p>
            <p className="mt-1 text-left text-xs font-medium text-cyan-200/90">{manga.author}</p>

            {readCount > 0 && (
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-emerald-300/90">
                    Cap. {readCount}/{totalChapters}
                  </span>
                  {readCount === totalChapters && (
                    <span className="text-[10px] font-bold text-emerald-400">✓</span>
                  )}
                </div>
                <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/[0.12]">
                  <div
                    className="h-full rounded-full bg-emerald-400/80"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          </div>
      </Link>
    </motion.article>
  )
}
