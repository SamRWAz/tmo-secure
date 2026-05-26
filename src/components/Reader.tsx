import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'
import { VerifiedPawIcon } from './VerifiedPawIcon'

type Props = {
  title: string
  chapterLabel: string
  pageUrls: string[]
  onRequestNext: () => void
  onRequestPrev: () => void
  hasNext: boolean
  hasPrev: boolean
  onFastScroll: () => void
  scrollVelocityThreshold: number
  /** Incrementar desde el padre al cerrar el modal para volver a armar el detector */
  scrollArmToken: number
}

export function Reader({
  title,
  chapterLabel,
  pageUrls,
  onRequestNext,
  onRequestPrev,
  hasNext,
  hasPrev,
  onFastScroll,
  scrollVelocityThreshold,
  scrollArmToken,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const lastY = useRef(0)
  const lastT = useRef(0)
  const armed = useRef(true)

  useEffect(() => {
    lastY.current = scrollerRef.current?.scrollTop ?? 0
    lastT.current = performance.now()
    armed.current = true
  }, [pageUrls])

  useEffect(() => {
    armed.current = true
  }, [scrollArmToken])

  const onScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el || !armed.current) return
    const now = performance.now()
    const y = el.scrollTop
    const dy = Math.abs(y - lastY.current)
    const dt = Math.max(now - lastT.current, 1)
    const velocity = dy / dt
    lastY.current = y
    lastT.current = now

    if (velocity > scrollVelocityThreshold * 100 && dy > 120) {
      armed.current = false
      onFastScroll()
    }
  }, [onFastScroll, scrollVelocityThreshold])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const handler = () => onScroll()
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [onScroll])

  return (
    <div className="flex min-h-[70dvh] flex-col">
      <header className="mb-5 flex flex-col gap-4 rounded-3xl border border-white/[0.06] bg-slate-900/35 p-5 shadow-[0_16px_48px_-24px_rgb(0_0_0_/_0.5)] ring-1 ring-slate-800/40 backdrop-blur-sm sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400/95">
            Visor protegido
          </p>
          <h1 className="mt-1.5 text-balance text-lg font-bold tracking-tight text-white sm:text-xl">
            {title}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-400">{chapterLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={onRequestPrev}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-slate-950/60 px-3.5 py-2.5 text-sm font-semibold text-slate-200 shadow-sm transition enabled:hover:border-cyan-500/30 enabled:hover:bg-slate-800/90 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <VerifiedPawIcon />
            Capítulo anterior
          </button>
          <button
            type="button"
            disabled={!hasNext}
            onClick={onRequestNext}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-cyan-500/25 to-cyan-600/15 px-3.5 py-2.5 text-sm font-bold text-cyan-50 shadow-[0_0_20px_-6px_rgb(34_211_238_/_0.35)] ring-1 ring-cyan-400/45 transition enabled:hover:ring-cyan-300/55 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <VerifiedPawIcon />
            Siguiente capítulo
          </button>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="reader-safe-bottom max-h-[calc(100dvh-12rem)] overflow-y-auto rounded-3xl border border-white/[0.05] bg-slate-950/35 shadow-inner shadow-black/30 ring-1 ring-slate-800/50 sm:max-h-[calc(100dvh-10rem)]"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-2.5 px-2 py-4 sm:gap-3.5 sm:px-5 sm:py-5">
          {pageUrls.map((src, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.35), duration: 0.25 }}
              className="overflow-hidden rounded-xl bg-black/50 shadow-[0_12px_40px_-16px_rgb(0_0_0_/_0.65)] ring-1 ring-white/[0.06]"
            >
              <img
                src={src}
                alt={`Página ${i + 1}`}
                className="block w-full object-contain"
                loading={i < 2 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </div>
  )
}
