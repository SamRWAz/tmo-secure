import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { catalog, coverAsset, getManga } from '../data/catalog'
import { inspectChapterRoute } from '../lib/inspectRoute'
import { InspectionOverlay } from '../components/InspectionOverlay'
import { VerifiedPawIcon } from '../components/VerifiedPawIcon'
import { MangaGenreTags } from '../components/MangaGenreTags'
import { StarRating } from '../components/StarRating'
import { MangaComments } from '../components/MangaComments'
import { MangaCover } from '../components/MangaCover'
import { MangaCard } from '../components/MangaCard'
import { AgeGateModal } from '../components/AgeGateModal'
import { AdWatchModal } from '../components/AdWatchModal'
import { SubscribeModal } from '../components/SubscribeModal'
import { useGuardian } from '../context/GuardianContext'
import { useUser } from '../context/UserContext'
import { getDisplayRating, getUserRating, setUserRating } from '../lib/userRatings'
import type { Chapter } from '../types/manga'

export function MangaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const manga = id ? getManga(id) : undefined
  const { setThreatActive } = useGuardian()
  const {
    ageVerified,
    verifyAge,
    isActiveSubscription,
    isChapterUnlocked,
    spendToken,
    addTokens,
    user,
    isLoggedIn,
  } = useUser()

  const [inspecting, setInspecting] = useState(false)
  const [, setRatingVersion] = useState(0)
  const [lockedChapter, setLockedChapter] = useState<Chapter | null>(null)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [adWatchOpen, setAdWatchOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)

  const relatedMangas = useMemo(() => {
    if (!manga) return []
    return catalog
      .filter((m) => m.id !== manga.id && !m.isAdult)
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
      <div className="rounded-3xl border border-white/[0.06] bg-slate-900/50 p-10 text-center">
        <p className="text-slate-300">No encontramos ese título.</p>
        <Link to="/" className="mt-5 inline-flex items-center justify-center rounded-full bg-cyan-500/15 px-5 py-2.5 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/40">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const first = manga.chapters[0]
  const mangaId = manga.id
  const userRating = getUserRating(manga.id)
  const { average, count } = getDisplayRating(manga.id, manga.baseRating, manga.ratingCount)

  const isPremium = Boolean(manga.requiresTokens)
  const isAdult = Boolean(manga.isAdult)
  const needsAgeGate = isAdult && !ageVerified
  const canRead = isActiveSubscription || !isPremium

  async function openChapter(ch: Chapter) {
    setInspecting(true)
    setThreatActive(false)
    await inspectChapterRoute(ch)
    setInspecting(false)
    navigate(`/manga/${mangaId}/read/${ch.id}`)
  }

  function handleChapterClick(ch: Chapter) {
    if (!isPremium || isActiveSubscription || isChapterUnlocked(ch.id)) {
      openChapter(ch)
      return
    }
    setLockedChapter(ch)
    setTokenError(null)
    setPaywallOpen(true)
  }

  function handleSpendToken() {
    if (!lockedChapter) return
    const res = spendToken(lockedChapter.id)
    if (res.ok) {
      setPaywallOpen(false)
      openChapter(lockedChapter)
    } else {
      setTokenError(res.error ?? 'Error al usar el token.')
    }
  }

  return (
    <div>
      {/* Age Gate (bloquea la página si es adulto y no verificado) */}
      {needsAgeGate && (
        <AgeGateModal
          onConfirm={verifyAge}
          onDecline={() => navigate('/')}
        />
      )}

      <AnimatePresence>
        {inspecting && <InspectionOverlay visible />}
      </AnimatePresence>

      {/* Paywall modal para capítulos bloqueados */}
      <AnimatePresence>
        {paywallOpen && lockedChapter && (
          <motion.div
            className="fixed inset-0 z-[65] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Cerrar"
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              onClick={() => setPaywallOpen(false)}
            />
            <motion.div
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900 shadow-2xl"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            >
              <div className="bg-gradient-to-br from-amber-500/12 via-slate-900 to-slate-900 px-6 pt-6 pb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                  Contenido Premium
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">
                  🔒 Cap. {lockedChapter.number}: {lockedChapter.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Este capítulo requiere suscripción o 1 token para desbloquearse.
                </p>
              </div>

              <div className="space-y-3 px-6 pb-6 pt-4">
                {/* Opción suscripción */}
                <button
                  type="button"
                  onClick={() => { setPaywallOpen(false); setSubscribeOpen(true) }}
                  className="w-full rounded-2xl bg-gradient-to-r from-violet-500/25 to-indigo-500/15 py-3 text-sm font-bold text-violet-100 ring-1 ring-violet-400/40 transition hover:from-violet-500/35"
                >
                  ⭐ Suscribirse · $2/mes — acceso ilimitado
                </button>

                {/* Opción token */}
                <button
                  type="button"
                  onClick={handleSpendToken}
                  disabled={!isLoggedIn || (user?.tokens ?? 0) < 1}
                  className={`w-full rounded-2xl py-3 text-sm font-bold transition ${
                    !isLoggedIn || (user?.tokens ?? 0) < 1
                      ? 'cursor-not-allowed bg-slate-800/60 text-slate-600 ring-1 ring-slate-700/50'
                      : 'bg-gradient-to-r from-amber-500/25 to-orange-500/15 text-amber-100 ring-1 ring-amber-400/40 hover:from-amber-500/35'
                  }`}
                >
                  🪙 Usar 1 token (tienes {user?.tokens ?? 0})
                </button>

                {tokenError && (
                  <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-200 ring-1 ring-rose-400/25">
                    {tokenError}
                  </p>
                )}

                {/* Ver anuncio */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5">
                  <p className="text-xs text-slate-400">
                    ¿Quieres leer más sin gastar ni un centavo?{' '}
                    <button
                      type="button"
                      onClick={() => { setPaywallOpen(false); setAdWatchOpen(true) }}
                      className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                    >
                      Mira un anuncio por 30 segundos y recibe 3 tokens.
                    </button>
                  </p>
                </div>

                {!isLoggedIn && (
                  <Link
                    to="/registro"
                    className="flex w-full items-center justify-center rounded-2xl border border-cyan-500/30 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10 transition"
                  >
                    Crear cuenta gratis (5 tokens de regalo)
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdWatchModal
        open={adWatchOpen}
        onClose={() => setAdWatchOpen(false)}
        onEarned={(t) => addTokens(t)}
      />
      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />

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
              {/* Badge adulto encima de la portada */}
              {isAdult && (
                <div className="absolute right-2 top-2 rounded-full bg-rose-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-100 ring-1 ring-rose-400/50 backdrop-blur-sm">
                  🔞 +18
                </div>
              )}
              {isPremium && !isAdult && (
                <div className="absolute right-2 top-2 rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-100 ring-1 ring-amber-400/40 backdrop-blur-sm">
                  🔒 Premium
                </div>
              )}
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

            {/* Valoración */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Valoración</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <StarRating value={average} />
                  <span className="text-xs text-slate-500">{count.toLocaleString('es')} valoraciones</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Tu nota:</p>
                <StarRating
                  value={userRating ?? 0}
                  onChange={(stars) => { setUserRating(manga.id, stars); setRatingVersion((n) => n + 1) }}
                />
              </div>
            </div>

            {/* Géneros */}
            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Géneros</p>
              <div className="mt-2">
                <MangaGenreTags categories={manga.categories} clickable />
              </div>
            </div>

            {/* Badge de validación / premium */}
            {isPremium ? (
              <div className="mt-5 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3.5 ring-1 ring-amber-400/10">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-400/40 text-sm">
                    🔒
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-amber-200">Contenido bajo licencia comercial</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      El autor de esta obra requiere compensación por su distribución. Puedes acceder
                      con una <span className="text-slate-300 font-medium">suscripción Premium</span> ($2/mes)
                      o gastando <span className="text-slate-300 font-medium">1 token</span> por capítulo.
                    </p>
                    {!canRead && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSubscribeOpen(true)}
                          className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-violet-300 ring-1 ring-violet-400/30 hover:bg-violet-500/25 transition"
                        >
                          ⭐ Suscribirse
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdWatchOpen(true)}
                          className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-400/30 hover:bg-amber-500/25 transition"
                        >
                          📺 Ver anuncio (+3 tokens)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-3.5 ring-1 ring-emerald-400/10">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/40 text-sm">
                    ✓
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-emerald-200">Obra autorizada por el creador</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      El autor ha otorgado permiso expreso para publicar esta obra de forma gratuita y{' '}
                      <span className="text-slate-300 font-medium">sin ánimo de lucro</span>.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Licencia verificada
                      </span>
                      <span className="text-[10px] text-slate-600 tabular-nums">
                        ID: TMO-{manga.id.toUpperCase().slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sinopsis */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Sinopsis</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{manga.synopsis}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300/95 sm:text-[0.9375rem]">
                {manga.extendedSynopsis}
              </p>
            </div>

            {first && (
              <motion.button
                type="button"
                onClick={() => handleChapterClick(first)}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500/25 via-cyan-500/15 to-teal-600/10 px-5 py-3.5 text-sm font-bold text-cyan-50 shadow-[0_12px_40px_-12px_rgb(34_211_238_/_0.25)] ring-2 ring-cyan-400/45 transition hover:ring-cyan-300/60 sm:w-auto"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <VerifiedPawIcon className="shrink-0" />
                {isPremium && !canRead && !isChapterUnlocked(first.id)
                  ? '🔒 Leer cap. 1 (1 token)'
                  : `Lectura protegida (desde cap. ${first.number})`}
              </motion.button>
            )}

            {/* Lista de capítulos */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                  Capítulos
                </h2>
                {isPremium && !isActiveSubscription && (
                  <span className="text-[10px] text-amber-400/80">
                    🔒 {manga.chapters.filter(c => !isChapterUnlocked(c.id)).length} bloqueados
                  </span>
                )}
              </div>
              <ul className="mt-3 divide-y divide-white/[0.05] overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950/40 ring-1 ring-slate-800/50">
                {manga.chapters.map((ch) => {
                  const unlocked = isActiveSubscription || !isPremium || isChapterUnlocked(ch.id)
                  return (
                    <li key={ch.id}>
                      <button
                        type="button"
                        onClick={() => handleChapterClick(ch)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm transition-colors hover:bg-white/[0.04] sm:px-5"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          {unlocked ? <VerifiedPawIcon /> : <span className="text-amber-400/80 text-xs">🔒</span>}
                          <span className={`truncate font-medium ${unlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                            Cap. {ch.number}: {ch.title}
                          </span>
                        </span>
                        {ch.unsafeRoute ? (
                          <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-100 ring-1 ring-amber-400/40">
                            Redirect (demo)
                          </span>
                        ) : unlocked ? (
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-cyan-400/90">
                            Pre-escaneado
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300/80 ring-1 ring-amber-400/25">
                            1 token
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
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
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Títulos relacionados</h2>
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
