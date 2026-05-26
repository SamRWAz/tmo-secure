import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReadingHistory } from '../context/ReadingHistoryContext'
import { useUser } from '../context/UserContext'
import { useGuardian } from '../context/GuardianContext'
import {
  askGuardian,
  isGuardianAiCloudEnabled,
  type ChatMessage,
  type MangaSuggestion,
} from '../lib/guardianAi'
import { loadChatMessages, saveChatMessages } from '../lib/chatStorage'
import { getSpeciesMeta, type GuardianSpecies } from '../data/guardianSpecies'

function buildWelcomeMessage(
  species: GuardianSpecies,
  hasHistory: boolean,
  userName?: string,
): ChatMessage[] {
  const meta = getSpeciesMeta(species)
  const greet = userName ? `Hola, ${userName}.` : 'Hola.'
  const histLine = hasHistory
    ? ' Tengo tu historial de lectura.'
    : ' Tu historial está vacío hasta que abras un capítulo.'
  return [
    {
      id: 'welcome',
      role: 'guardian',
      text: `${meta.emoji} ${greet} Soy tu Guardian.${histLine} Prueba: «recomiéndame algo de acción».`,
      createdAt: 0,
    },
  ]
}

export function GuardianChat() {
  const { species, autonomy, setBunkerOpen } = useGuardian()
  const { hasHistory } = useReadingHistory()
  const { user, userId, isLoggedIn } = useUser()
  const userName = user?.name

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadChatMessages(userId)
    if (saved) return [...buildWelcomeMessage(species, hasHistory, userName), ...saved]
    return buildWelcomeMessage(species, hasHistory, userName)
  })
  const [suggestions, setSuggestions] = useState<MangaSuggestion[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const cloud = isGuardianAiCloudEnabled()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, suggestions])

  useEffect(() => {
    const withoutWelcome = messages.filter((m) => m.id !== 'welcome')
    if (withoutWelcome.length > 0) saveChatMessages(userId, withoutWelcome)
  }, [messages, userId])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      createdAt: Date.now(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    setSuggestions([])

    try {
      const reply = await askGuardian(text, species, autonomy, messages, {
        userName,
        userId,
      })
      setMessages((m) => [
        ...m,
        {
          id: `g-${Date.now()}`,
          role: 'guardian',
          text: reply.text,
          createdAt: Date.now(),
        },
      ])
      setSuggestions(reply.suggestions)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-800/80 px-3 py-2">
        <p className="text-[10px] text-slate-500">
          {cloud ? 'IA en la nube' : 'Modo local inteligente'}
          {isLoggedIn && userName ? ` · ${userName}` : ' · invitado'}
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cyan-500/20 text-cyan-50 ring-1 ring-cyan-400/30'
                  : 'bg-slate-800/90 text-slate-200 ring-1 ring-slate-700/80'
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {suggestions.map((s) => (
              <Link
                key={s.id}
                to={`/manga/${s.id}`}
                onClick={() => setBunkerOpen(false)}
                className="rounded-full bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-200 ring-1 ring-cyan-400/35 transition hover:bg-cyan-500/25"
              >
                {s.title}
              </Link>
            ))}
          </div>
        )}
        {loading && (
          <p className="text-xs italic text-slate-500">El Guardian está pensando…</p>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="shrink-0 border-t border-slate-800 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej: recomiéndame algo de acción…"
            disabled={loading}
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-xl bg-cyan-500/25 px-3 py-2 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-400/40 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}
