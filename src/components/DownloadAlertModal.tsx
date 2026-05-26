import { motion } from 'framer-motion'

type Props = {
  open: boolean
  onIgnore: () => void
  onReport: () => void
}

export function DownloadAlertModal({ open, onIgnore, onReport }: Props) {
  if (!open) return null
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dl-title"
      className="fixed inset-0 z-[82] flex items-end justify-center bg-slate-950/75 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl bg-slate-900 p-5 shadow-2xl ring-1 ring-rose-500/40"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      >
        <h2 id="dl-title" className="text-lg font-semibold text-rose-100">
          Alerta de descarga
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          ¡Cuidado! Se intentó activar una descarga automática. He detenido el proceso.
          ¿Deseas ignorarlo o ver el reporte?
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onIgnore}
            className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-100 ring-1 ring-slate-600 transition hover:bg-slate-700"
          >
            Ignorar
          </button>
          <button
            type="button"
            onClick={onReport}
            className="rounded-xl bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/40 transition hover:bg-cyan-400/25"
          >
            Ver reporte
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
