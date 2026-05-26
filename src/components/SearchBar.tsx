import { useId, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

type SearchBarProps = {
  /** Si true, al buscar navega a inicio con ?q= */
  navigateOnSearch?: boolean
  className?: string
}

export function SearchBar({ navigateOnSearch = false, className = '' }: SearchBarProps) {
  const inputId = useId()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [value, setValue] = useState(urlQuery)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (navigateOnSearch) {
      if (q) navigate(`/?q=${encodeURIComponent(q)}`)
      else navigate('/')
      return
    }
    const next = new URLSearchParams(searchParams)
    if (q) next.set('q', q)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  function clearSearch() {
    setValue('')
    if (navigateOnSearch) {
      navigate('/')
      return
    }
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    setSearchParams(next, { replace: true })
  }

  return (
    <form onSubmit={submit} className={className} role="search">
      <label htmlFor={inputId} className="sr-only">
        Buscar manga
      </label>
      <div className="relative flex items-center">
        <span
          className="pointer-events-none absolute left-3.5 text-slate-500"
          aria-hidden
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar por título, autor o género…"
          className="w-full min-w-0 rounded-2xl border border-white/[0.08] bg-slate-900/80 py-2.5 pl-10 pr-10 text-sm text-slate-100 shadow-inner shadow-black/20 placeholder:text-slate-500 ring-1 ring-slate-800/80 transition focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 sm:min-w-[220px] sm:max-w-md"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  )
}
