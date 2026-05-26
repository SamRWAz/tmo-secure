import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { catalog, filterCatalogByGuardian, getManga } from '../data/catalog'
import { searchCatalog } from '../lib/searchCatalog'
import { getGuardianFilter, type GuardianFilterId } from '../data/guardianFilters'
import { MANGA_CATEGORY_LABELS } from '../data/categoryLabels'
import type { MangaCategory } from '../types/manga'
import { MangaCard } from '../components/MangaCard'
import { HeroSlider } from '../components/HeroSlider'
import { MangaCover } from '../components/MangaCover'
import { coverAsset } from '../data/catalog'
import { useReadingHistory } from '../context/ReadingHistoryContext'

const BROWSE_SECTIONS: {
  category: MangaCategory
  title: string
  subtitle: string
}[] = [
  { category: 'action', title: 'Acción', subtitle: 'Peleas, persecuciones y tensión constante.' },
  { category: 'comedy', title: 'Comedia', subtitle: 'Timing, situaciones absurdas y buen humor.' },
  { category: 'drama', title: 'Drama', subtitle: 'Decisiones difíciles y conflictos personales.' },
  { category: 'romance', title: 'Romance', subtitle: 'Encuentros, distancias y segundas oportunidades.' },
  { category: 'fantasy', title: 'Fantasía', subtitle: 'Mundos extraños, magia y reglas propias.' },
  { category: 'thriller', title: 'Thriller', subtitle: 'Misterio, paranoia y giros que aprietan.' },
  { category: 'sci-fi', title: 'Ciencia ficción', subtitle: 'Futuros cercanos, tecnología y dilemas éticos.' },
  { category: 'slice-of-life', title: 'Slice of life', subtitle: 'Días cotidianos con detalle y calma narrativa.' },
]

function Section({
  title,
  subtitle,
  category,
  items,
}: {
  title: string
  subtitle: string
  category: MangaCategory
  items: typeof catalog
}) {
  const list = items.filter((m) => m.categories.includes(category))
  if (list.length === 0) return null
  return (
    <section className="mb-14 sm:mb-16">
      <div className="mb-5 flex flex-col gap-1 sm:mb-6">
        <div className="flex items-center gap-3">
          <span className="h-1 w-10 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 shadow-[0_0_12px_rgb(34_211_238_/_0.45)]" aria-hidden />
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
        </div>
        <p className="pl-[3.25rem] text-sm leading-relaxed text-slate-400 sm:text-[0.9375rem]">
          {subtitle}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {list.map((manga, i) => (
          <MangaCard key={manga.id} manga={manga} index={i} />
        ))}
      </div>
    </section>
  )
}

function ContinueReadingSection() {
  const { history } = useReadingHistory()

  const continueItems = useMemo(() => {
    const seen = new Set<string>()
    const result: typeof history = []
    for (const entry of history) {
      if (!seen.has(entry.mangaId)) {
        seen.add(entry.mangaId)
        result.push(entry)
      }
    }
    return result.slice(0, 6)
  }, [history])

  if (continueItems.length === 0) return null

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-1 w-10 shrink-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_12px_rgb(52_211_153_/_0.45)]" aria-hidden />
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Continúa leyendo
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgb(51_65_85)_transparent]">
        {continueItems.map((entry) => {
          const manga = getManga(entry.mangaId)
          if (!manga) return null
          const nextChapIdx = manga.chapters.findIndex((c) => c.id === entry.chapterId)
          const nextChap = manga.chapters[nextChapIdx + 1] ?? manga.chapters[nextChapIdx]
          return (
            <Link
              key={entry.mangaId}
              to={`/manga/${manga.id}/read/${nextChap?.id ?? manga.chapters[0].id}`}
              className="group flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/70 transition hover:border-cyan-400/30 hover:bg-slate-900"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <MangaCover
                  mangaId={manga.id}
                  src={manga.coverUrl}
                  svgFallback={coverAsset(manga.id).svg}
                  alt={manga.title}
                  title={manga.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-xs font-semibold text-slate-100">{manga.title}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Último: Cap. {entry.chapterNumber}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  ▶ Retomar
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function HomePage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q')?.trim() ?? ''
  const filterId = (searchParams.get('filter') ?? 'all') as GuardianFilterId
  const catParam = searchParams.get('cat') as MangaCategory | null
  const activeFilter = useMemo(() => getGuardianFilter(filterId), [filterId])

  const baseList = useMemo(() => {
    let list = filterCatalogByGuardian(activeFilter.matches)
    if (catParam) {
      list = list.filter((m) => m.categories.includes(catParam))
    }
    if (searchQuery) {
      const ids = new Set(searchCatalog(searchQuery).map((m) => m.id))
      list = list.filter((m) => ids.has(m.id))
    }
    return list
  }, [activeFilter, catParam, searchQuery])

  const isFiltered = filterId !== 'all'
  const isSearching = searchQuery.length > 0
  const isCatFiltered = catParam !== null

  const catLabel = catParam ? (MANGA_CATEGORY_LABELS[catParam] ?? catParam) : null

  return (
    <div>
      <HeroSlider />

      {/* Aviso de filtro Guardian activo */}
      {isFiltered && (
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/25 bg-cyan-500/8 px-4 py-3">
          <p className="text-sm text-slate-200">
            <span className="mr-1 text-cyan-400">🎯</span>
            Filtro Guardian:{' '}
            <span className="font-semibold text-cyan-200">"{activeFilter.label}"</span>
            {' — '}
            <span className="tabular-nums text-cyan-300">{baseList.length}</span> títulos
          </p>
          <Link to="/" replace className="text-xs text-slate-500 hover:text-slate-300">
            Quitar ✕
          </Link>
        </div>
      )}

      {/* Aviso de categoría activa */}
      {isCatFiltered && catLabel && (
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-500/25 bg-indigo-500/8 px-4 py-3">
          <p className="text-sm text-slate-200">
            <span className="mr-1">🏷️</span>
            Género:{' '}
            <span className="font-semibold text-indigo-200">{catLabel}</span>
            {' — '}
            <span className="tabular-nums text-indigo-300">{baseList.length}</span> títulos
          </p>
          <Link to="/" replace className="text-xs text-slate-500 hover:text-slate-300">
            Quitar ✕
          </Link>
        </div>
      )}

      {isSearching && (
        <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-slate-200">
          Resultados para{' '}
          <span className="font-semibold text-cyan-200">"{searchQuery}"</span>
          {' — '}
          <span className="tabular-nums text-cyan-300">{baseList.length}</span> títulos
        </div>
      )}

      {/* Vista filtrada / búsqueda / categoría */}
      {isFiltered || isSearching || isCatFiltered ? (
        <section className="mb-12">
          {(isFiltered || isCatFiltered) && !isSearching && (
            <p className="mb-5 pl-1 text-xs leading-relaxed text-slate-500">
              {isFiltered ? activeFilter.voice : `Mostrando obras del género ${catLabel}.`}
            </p>
          )}
          {baseList.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 px-4 py-10 text-center text-sm text-slate-400">
              No hay títulos que coincidan. Prueba otro filtro o término de búsqueda.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {baseList.map((manga, i) => (
                <MangaCard key={manga.id} manga={manga} index={i} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Vista normal: Continúa leyendo + secciones por género */
        <>
          <ContinueReadingSection />
          {BROWSE_SECTIONS.map((sec) => (
            <Section
              key={sec.category}
              title={sec.title}
              subtitle={sec.subtitle}
              category={sec.category}
              items={catalog}
            />
          ))}
        </>
      )}
    </div>
  )
}
