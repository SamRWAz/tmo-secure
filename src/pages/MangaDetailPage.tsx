import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { catalog, coverAsset, getManga } from '../data/catalog'
import { inspectChapterRoute } from '../lib/inspectRoute'
import { InspectionOverlay } from '../components/InspectionOverlay'
import { VerifiedPawIcon } from '../components/VerifiedPawIcon'
import { MangaGenreTags } from '../components/MangaGenreTags'
import { StarRating } from '../components/StarRating'
import { MangaComments } from '../components/MangaComments'
import { MangaCover } from '../components/MangaCover'
import { MangaCard } from '../components/MangaCard'
import { useGuardian } from '../context/GuardianContext'
import {
  getDisplayRating,
  getUserRating,
  setUserRating,
} from '../lib/userRatings'
import type { Chapter } from '../types/manga'

export function MangaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const manga = id ? getManga(id) : undefined
  const { setThreatActive } = useGuardian()

  const [inspecting, setInspecting] = useState(false)
  const [, setRatingVersion] = useState(0)

  const relatedMangas = useMemo(() => {
    if (!manga) return []
    return catalog
      .filter((m) => m.id !== manga.id)
      .map((m) => ({
        manga: m,
        shared: m.categories.filter((c) => manga.categories.includes(c)).length,
      }))
      .filter((x) => x.shared > 0)
      .sort((a, b) => b.shared - a.shared || b.manga.baseRating - a.manga.baseRating)
      .slice(0, 4)
      .map((x) => x.manga)
  }, [manga])

  if (!manga) {
    return (
      <div className="rounded-3xl border border-white/[0.06] bg-slate-900/50 p-10 text-center shadow-inner shadow-white/[0.02] ring-1 ring-slate-800/80 backdrop-blur-sm">
        <p className="text-slate-300">No encontramos ese título.</p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-cyan-500/15 px-5 py-2.5 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/40 transition hover:bg-cyan-500/25"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  const first = manga.chapters[0]
  const mangaId = manga.id
  const userRating = getUserRating(manga.id)

  const { average, count } = getDisplayRating(
    manga.id,
    manga.baseRating,
    manga.ratingCount,
  )

  async function openChapter(ch: Chapter) {
    setInspecting(true)
    setThreatActive(false)
    await inspectChapterRoute(ch)
    setInspecting(false)
    navigate(`/manga/${mangaId}/read/${ch.id}`)
  }

  return (
    <div>
      <AnimatePresence>
        {inspecting && <InspectionOverlay visible />}
      </AnimatePresence>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="mx-auto shrink-0 lg:mx-0">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-b from-cyan-500/20 via-transparent to-indigo-600/15 opacity-70 blur-xl" />
            <motion.div
              className="relative mx-auto w-full max-w-[240px] overflow-hidden rounded-2xl shadow-[0_24px_60px_-12px_rgb(0_0_0_/_0.75)] ring-1 ring-white/[0.1] sm:max-w-[280px]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
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
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="rounded-3xl border border-white/[0.06] bg-slate-900/40 p-6 shadow-[0_20px_50px_-28px_rgb(0_0_0_/_0.55)] ring-1 ring-slate-800/60 backdrop-blur-sm sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400/95">
              Ficha protegida
            </p>
            <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-white sm:text-4xl">
              {manga.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-400">{manga.author}</p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Valoración
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <StarRating value={average} />
                  <span className="text-xs text-slate-500">
                    {count.toLocaleString('es')} valoraciones
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Tu nota:</p>
                <StarRating
                  value={userRating ?? 0}
                  onChange={(stars) => {
                    setUserRating(manga.id, stars)
                    setRatingVersion((n) => n + 1)
                  }}
                />
              </div>
            </div>

              <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Géneros
              </p>
              <div className="mt-2">
                <MangaGenreTags categories={manga.categories} clickable />
              </div>
            </div>

            {/* Validación de autor */}
            <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-3.5 ring-1 ring-emerald-400/10">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/40 text-sm">
                  ✓
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-200">
                    Obra autorizada por el creador
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    El autor ha otorgado permiso expreso para publicar esta obra de forma
                    gratuita y <span className="text-slate-300 font-medium">sin ánimo de lucro</span>{' '}
                    en esta plataforma. No se monetiza directamente ni se permite redistribución comercial.
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Licencia verificada
                    </span>
                    <span className="text-[10px] text-slate-600 tabular-nums">
                      ID validación: TMO-{manga.id.toUpperCase().slice(0, 8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Sinopsis
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{manga.synopsis}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300/95 sm:text-[0.9375rem]">
                {manga.extendedSynopsis}
              </p>
            </div>

            {first && (
              <motion.button
                type="button"
                onClick={() => openChapter(first)}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500/25 via-cyan-500/15 to-teal-600/10 px-5 py-3.5 text-sm font-bold text-cyan-50 shadow-[0_12px_40px_-12px_rgb(34_211_238_/_0.25)] ring-2 ring-cyan-400/45 transition hover:ring-cyan-300/60 sm:w-auto"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <VerifiedPawIcon className="shrink-0" />
                Lectura protegida (desde cap. {first.number})
              </motion.button>
            )}

            <div className="mt-10">
              <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                Capítulos
              </h2>
              <ul className="mt-3 divide-y divide-white/[0.05] overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950/40 ring-1 ring-slate-800/50">
                {manga.chapters.map((ch) => (
                  <li key={ch.id}>
                    <button
                      type="button"
                      onClick={() => openChapter(ch)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm transition-colors hover:bg-white/[0.04] sm:px-5"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <VerifiedPawIcon />
                        <span className="truncate font-medium text-slate-100">
                          Cap. {ch.number}: {ch.title}
                        </span>
                      </span>
                      {ch.unsafeRoute ? (
                        <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-100 ring-1 ring-amber-400/40">
                          Redirect (demo)
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-cyan-400/90">
                          Pre-escaneado
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <MangaComments mangaId={manga.id} />
          </div>
        </div>
      </div>

      {/* Títulos relacionados */}
      {relatedMangas.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-1 w-10 shrink-0 rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 shadow-[0_0_12px_rgb(99_102_241_/_0.4)]" aria-hidden />
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Títulos relacionados
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {relatedMangas.map((m, i) => (
              <MangaCard key={m.id} manga={m} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
