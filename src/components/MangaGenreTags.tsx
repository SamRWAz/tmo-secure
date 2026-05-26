import { Link } from 'react-router-dom'
import { getCategoryLabel } from '../data/categoryLabels'
import type { MangaCategory } from '../types/manga'

const TAG_COLORS: Partial<Record<MangaCategory, string>> = {
  action: 'bg-rose-500/15 text-rose-200 ring-rose-400/35 hover:bg-rose-500/25',
  romance: 'bg-pink-500/15 text-pink-200 ring-pink-400/35 hover:bg-pink-500/25',
  comedy: 'bg-amber-500/15 text-amber-100 ring-amber-400/35 hover:bg-amber-500/25',
  drama: 'bg-violet-500/15 text-violet-200 ring-violet-400/35 hover:bg-violet-500/25',
  fantasy: 'bg-indigo-500/15 text-indigo-200 ring-indigo-400/35 hover:bg-indigo-500/25',
  thriller: 'bg-orange-500/15 text-orange-200 ring-orange-400/35 hover:bg-orange-500/25',
  'sci-fi': 'bg-cyan-500/15 text-cyan-200 ring-cyan-400/35 hover:bg-cyan-500/25',
  'slice-of-life': 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/35 hover:bg-emerald-500/25',
}

type Props = {
  categories: MangaCategory[]
  /** Si true, cada tag es un enlace que filtra el catálogo por ese género */
  clickable?: boolean
}

export function MangaGenreTags({ categories, clickable = false }: Props) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Géneros">
      {categories.map((cat) => {
        const cls = `inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${TAG_COLORS[cat] ?? 'bg-slate-700/50 text-slate-200 ring-slate-600/50'}`
        return (
          <li key={cat}>
            {clickable ? (
              <Link to={`/?cat=${cat}`} className={cls}>
                {getCategoryLabel(cat)}
              </Link>
            ) : (
              <span className={cls}>{getCategoryLabel(cat)}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
