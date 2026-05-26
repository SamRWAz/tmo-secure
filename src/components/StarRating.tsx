type StarRatingProps = {
  value: number
  onChange?: (stars: number) => void
  size?: 'sm' | 'md'
  label?: string
}

export function StarRating({
  value,
  onChange,
  size = 'md',
  label = 'Valoración',
}: StarRatingProps) {
  const interactive = Boolean(onChange)
  const starClass = size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <div className="flex flex-wrap items-center gap-2" role={interactive ? 'group' : undefined}>
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(value)
          const half = !filled && star - 0.5 <= value
          const Component = interactive ? 'button' : 'span'
          return (
            <Component
              key={star}
              type={interactive ? 'button' : undefined}
              onClick={interactive ? () => onChange?.(star) : undefined}
              className={`${starClass} transition ${interactive ? 'cursor-pointer hover:scale-110' : ''} ${filled ? 'text-amber-400' : half ? 'text-amber-400/50' : 'text-slate-600'}`}
              aria-label={interactive ? `${star} estrellas` : undefined}
            >
              ★
            </Component>
          )
        })}
      </div>
      <span className="text-sm font-semibold tabular-nums text-amber-200/95">
        {value.toFixed(1)}
      </span>
    </div>
  )
}
