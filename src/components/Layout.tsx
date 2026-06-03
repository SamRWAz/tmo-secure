import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { AuthModal } from './AuthModal'
import { DonateModal } from './DonateModal'
import { AdWatchModal } from './AdWatchModal'
import { SubscribeModal } from './SubscribeModal'
import { SearchBar } from './SearchBar'

const navLink =
  'rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-cyan-200'

const navLinkActive =
  'rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/35'

export function Layout() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const isPopNavigation = navigationType === 'POP'
  const isHome = location.pathname === '/'
  const isGuardian = location.pathname === '/guardian'
  const isAccount = location.pathname === '/cuenta'
  const isAbout = location.pathname === '/acerca'
  const { user, isLoggedIn, isActiveSubscription, addTokens } = useUser()
  const [authOpen, setAuthOpen] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)
  const [adWatchOpen, setAdWatchOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  return (
    <div className="relative flex min-h-dvh flex-col bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-slate-950"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,rgb(34_211_238_/_0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_20%,rgb(99_102_241_/_0.09),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_0%_80%,rgb(6_182_212_/_0.07),transparent_45%)]" />
        <div className="tmo-grid-bg absolute inset-0 opacity-[0.35]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-slate-950/75 shadow-[0_8px_32px_-8px_rgb(0_0_0_/_0.55)] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <Link
              to="/"
              className="group flex items-center gap-3 rounded-xl pr-2 outline-offset-2 transition-opacity hover:opacity-95"
            >
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/25 via-cyan-500/10 to-slate-900 ring-1 ring-cyan-400/40 shadow-[0_0_24px_-4px_rgb(34_211_238_/_0.35)]">
                <span className="text-xs font-black tracking-tight text-cyan-50">TMO</span>
              </span>
              <div className="text-left leading-tight">
                <p className="text-sm font-semibold tracking-tight text-white">TMO Secure</p>
                <p className="text-[11px] font-medium text-cyan-400/85">Lectura con Guardian</p>
              </div>
            </Link>
            <nav
              className="flex items-center gap-1 sm:hidden"
              aria-label="Principal móvil"
            >
              <Link className={isHome ? navLinkActive : navLink} to="/">
                Inicio
              </Link>
              <Link className={isGuardian ? navLinkActive : navLink} to="/guardian">
                Guardián
              </Link>
              <Link className={isAbout ? navLinkActive : navLink} to="/acerca">
                Acerca
              </Link>
              {isLoggedIn && user ? (
                <Link
                  className={isAccount ? navLinkActive : navLink}
                  to="/cuenta"
                >
                  {user.name.slice(0, 10)}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className={navLink}
                >
                  Entrar
                </button>
              )}
            </nav>
          </div>
          <SearchBar
            key={location.search}
            navigateOnSearch={!isHome}
            className="w-full flex-1 sm:max-w-md"
          />
          <nav
            className="hidden items-center gap-1 sm:flex sm:gap-2"
            aria-label="Principal"
          >
            <Link className={isHome ? navLinkActive : navLink} to="/">
              Inicio
            </Link>
            <Link className={isGuardian ? navLinkActive : navLink} to="/guardian">
              Guardián
            </Link>
            <Link className={isAbout ? navLinkActive : navLink} to="/acerca">
              Acerca
            </Link>

            {/* Tokens + suscripción (solo desktop logueado) */}
            {isLoggedIn && user && (
              <>
                {isActiveSubscription ? (
                  <button
                    type="button"
                    onClick={() => setSubscribeOpen(true)}
                    className="flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1.5 text-xs font-bold text-violet-200 ring-1 ring-violet-400/35 transition hover:bg-violet-500/25"
                    title="Suscripción activa"
                  >
                    ⭐ Premium
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSubscribeOpen(true)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-violet-500/40 hover:text-violet-200"
                  >
                    ⭐ Suscribirse
                  </button>
                )}
                <div className="flex items-center gap-0.5 rounded-full border border-slate-700 bg-slate-900/60 pl-3 pr-1 py-1">
                  <span className="text-xs font-semibold text-amber-200">🪙 {user.tokens}</span>
                  <button
                    type="button"
                    onClick={() => setAdWatchOpen(true)}
                    title="Ver un anuncio y ganar 3 tokens"
                    className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-bold text-amber-300 transition hover:bg-amber-500/35"
                  >
                    +
                  </button>
                </div>
              </>
            )}

            {isLoggedIn && user ? (
              <Link
                className={
                  isAccount
                    ? navLinkActive
                    : 'rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/35'
                }
                to="/cuenta"
              >
                {user.name}
              </Link>
            ) : (
              <button type="button" onClick={() => setAuthOpen(true)} className={navLink}>
                Entrar
              </button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      <AdWatchModal
        open={adWatchOpen}
        onClose={() => setAdWatchOpen(false)}
        onEarned={(t) => addTokens(t)}
      />
      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />

      <main className="relative flex-1">
        <motion.div
          key={location.pathname}
          initial={isPopNavigation ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10"
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="relative border-t border-white/[0.06] bg-slate-950/80 backdrop-blur-sm">
        {/* Franja de donaciones */}
        <div className="border-b border-white/[0.05] bg-gradient-to-r from-amber-500/[0.06] via-orange-500/[0.04] to-transparent">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-amber-200/90">
                ☕ Mantén TMO Secure gratuito
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                Sin publicidad ni datos vendidos. Solo donaciones voluntarias para cubrir
                servidores y validaciones de autores.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDonateOpen(true)}
              className="shrink-0 rounded-full bg-gradient-to-r from-amber-500/25 to-orange-500/15 px-5 py-2.5 text-sm font-bold text-amber-100 ring-1 ring-amber-400/40 transition hover:from-amber-500/35 hover:ring-amber-300/60 whitespace-nowrap"
            >
              Apoyar el proyecto →
            </button>
          </div>
        </div>

        {/* Columnas principales */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/25 via-cyan-500/10 to-slate-900 ring-1 ring-cyan-400/40 shadow-[0_0_20px_-4px_rgb(34_211_238_/_0.3)]">
                <span className="text-[11px] font-black tracking-tight text-cyan-50">TMO</span>
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">TMO Secure</p>
                <p className="text-[10px] text-cyan-400/75">Lectura con Guardian</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Plataforma de lectura de manga gratuita y sin ánimo de lucro. Todo el
              contenido está validado por sus autores.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Navegación
            </p>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Catálogo' },
                { to: '/guardian', label: 'Panel Guardian' },
                { to: '/acerca', label: 'Acerca de TMO' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-slate-400 transition hover:text-cyan-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Proyecto */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Proyecto
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/acerca" className="text-sm text-slate-400 transition hover:text-cyan-300">
                  Misión y valores
                </Link>
              </li>
              <li>
                <Link to="/acerca" className="text-sm text-slate-400 transition hover:text-cyan-300">
                  Validación de autores
                </Link>
              </li>
              {['Política de privacidad', 'Contacto'].map((label) => (
                <li key={label}>
                  <span className="cursor-default text-sm text-slate-500">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sostenibilidad */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Sostenibilidad
            </p>
            <p className="text-xs leading-relaxed text-slate-500">
              TMO Secure existe gracias a lectores como tú. No vendemos datos ni mostramos
              publicidad invasiva.
            </p>
            <button
              type="button"
              onClick={() => setDonateOpen(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/[0.08] px-3.5 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/15"
            >
              ❤️ Donar
            </button>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-white/[0.04] px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} TMO Secure · Demo educativa sin ánimo de lucro.
            </p>
            <p className="text-[11px] text-slate-700">
              El Guardian simula protecciones frente a patrones oscuros habituales en agregadores de manga.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
