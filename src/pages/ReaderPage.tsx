import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  getAdjacentChapter,
  getChapter,
  getManga,
} from '../data/catalog'
import { inspectChapterRoute } from '../lib/inspectRoute'
import { buildChapterPanelUrls } from '../lib/mangaPages'
import { useReadingHistory } from '../context/ReadingHistoryContext'
import { Reader } from '../components/Reader'
import { InspectionOverlay } from '../components/InspectionOverlay'
import { DownloadAlertModal } from '../components/DownloadAlertModal'
import { useGuardian } from '../context/GuardianContext'
import type { Chapter } from '../types/manga'

export function ReaderPage() {
  const { id: mangaId = '', chapterId = '' } = useParams()
  const navigate = useNavigate()
  const manga = getManga(mangaId)
  const chapter = getChapter(mangaId, chapterId)
  const {
    scrollVelocityThreshold,
    registerBlockedDownload,
    resetChapterStats,
    setBunkerOpen,
    setThreatActive,
    setStatusMessage,
    flashRedirectSanitized,
  } = useGuardian()
  const { recordChapterRead } = useReadingHistory()

  const [inspecting, setInspecting] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [scrollArmToken, setScrollArmToken] = useState(0)

  useEffect(() => {
    if (!manga || !chapter) return
    resetChapterStats()
    recordChapterRead(manga.id, chapter.id, chapter.number, chapter.title)
    if (chapter.unsafeRoute) {
      flashRedirectSanitized(`Cap. «${chapter.title}»`)
      setStatusMessage(
        'Había una redirección simulada en esta ruta: la eliminé. El contenido se muestra aquí sin sacarte del visor.',
      )
    } else {
      setStatusMessage(
        `Registré «${manga.title}» cap. ${chapter.number} en tu historial. Abre el Guardian para recomendaciones.`,
      )
    }
  }, [
    manga,
    chapter,
    recordChapterRead,
    resetChapterStats,
    flashRedirectSanitized,
    setStatusMessage,
  ])

  const pageUrls = useMemo(() => {
    if (!manga || !chapter) return []
    return buildChapterPanelUrls(manga.id, chapter.id, 7)
  }, [manga, chapter])

  const goChapter = useCallback(
    async (target: Chapter | undefined) => {
      if (!manga || !target) return
      setInspecting(true)
      const result = await inspectChapterRoute(target)
      setInspecting(false)
      if (result === 'sanitized') {
        setStatusMessage(
          'Intercepté una cadena de redirección de mentira: te dejo el capítulo en el mismo visor.',
        )
      }
      navigate(`/manga/${manga.id}/read/${target.id}`)
    },
    [manga, navigate, setStatusMessage],
  )

  const onNext = useCallback(() => {
    const next = getAdjacentChapter(mangaId, chapterId, 'next')
    void goChapter(next)
  }, [chapterId, goChapter, mangaId])

  const onPrev = useCallback(() => {
    const prev = getAdjacentChapter(mangaId, chapterId, 'prev')
    void goChapter(prev)
  }, [chapterId, goChapter, mangaId])

  const onFastScroll = useCallback(() => {
    registerBlockedDownload()
    setDownloadOpen(true)
  }, [registerBlockedDownload])

  if (!manga || !chapter) {
    return (
      <div className="rounded-2xl bg-slate-900 p-8 text-center ring-1 ring-slate-800">
        <p className="text-slate-300">Capítulo no disponible.</p>
        <Link to="/" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const hasNext = Boolean(getAdjacentChapter(mangaId, chapterId, 'next'))
  const hasPrev = Boolean(getAdjacentChapter(mangaId, chapterId, 'prev'))

  return (
    <div>
      <AnimatePresence>
        {inspecting && <InspectionOverlay visible />}
      </AnimatePresence>
      <AnimatePresence>
        {downloadOpen && (
          <DownloadAlertModal
            open={downloadOpen}
            onIgnore={() => {
              setDownloadOpen(false)
              setScrollArmToken((t) => t + 1)
              setThreatActive(false)
            }}
            onReport={() => {
              setDownloadOpen(false)
              setScrollArmToken((t) => t + 1)
              setBunkerOpen(true)
              setThreatActive(false)
            }}
          />
        )}
      </AnimatePresence>

      <Reader
        title={manga.title}
        chapterLabel={`Capítulo ${chapter.number}: ${chapter.title}`}
        pageUrls={pageUrls}
        onRequestNext={onNext}
        onRequestPrev={onPrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onFastScroll={onFastScroll}
        scrollVelocityThreshold={scrollVelocityThreshold}
        scrollArmToken={scrollArmToken}
      />

      <p className="mt-4 text-center text-xs text-slate-500">
        Prueba un scroll muy rápido para ver la alerta anti-descarga. Ajusta la
        sensibilidad y tu mascota del guardián en Guardián.
      </p>
    </div>
  )
}
