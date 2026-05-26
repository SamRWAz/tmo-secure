import { useState } from 'react'

type MangaCoverProps = {
  mangaId: string
  src: string
  svgFallback?: string
  alt: string
  className?: string
  title?: string
}

type CoverStep = 'png' | 'svg' | 'failed'

/** Portada PNG de public/manga/covers/; SVG solo si falta el PNG */
export function MangaCover({
  mangaId,
  src,
  svgFallback = `/manga/covers/${mangaId}.svg`,
  alt,
  className = '',
  title,
}: MangaCoverProps) {
  const [step, setStep] = useState<CoverStep>('png')

  if (step === 'failed') {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm font-semibold text-slate-300">{title ?? alt}</span>
      </div>
    )
  }

  const currentSrc = step === 'png' ? src : svgFallback

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (step === 'png') setStep('svg')
        else setStep('failed')
      }}
    />
  )
}
