import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const STEPS = [
  {
    icon: '✍️',
    title: 'El autor crea la obra',
    body: 'El creador sube o indica la obra que quiere compartir de forma libre. Sin intermediarios comerciales.',
  },
  {
    icon: '🔍',
    title: 'Revisión y contacto',
    body: 'TMO Secure contacta al autor para verificar identidad y obtener permiso escrito de distribución no comercial.',
  },
  {
    icon: '✅',
    title: 'Validación y sello',
    body: 'Generamos un ID de validación único y publicamos la obra con el sello "Licencia verificada". El autor puede revocarla en cualquier momento.',
  },
  {
    icon: '🛡️',
    title: 'Guardian la protege',
    body: 'El Guardian monitorea cada sesión de lectura para bloquear patrones oscuros, descargas no autorizadas y redirecciones maliciosas.',
  },
]

const VALUES = [
  { icon: '🚫', label: 'Sin publicidad invasiva' },
  { icon: '📵', label: 'Sin venta de datos' },
  { icon: '💰', label: 'Sin cargo al lector' },
  { icon: '✍️', label: 'Autores siempre con control' },
  { icon: '🔓', label: 'Código abierto a revisión' },
  { icon: '🌍', label: 'Acceso libre global' },
]

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero */}
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/80 p-8 shadow-[0_24px_60px_-24px_rgb(0_0_0_/_0.65)] ring-1 ring-cyan-500/12 sm:p-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-400/90">
            TMO Secure · Misión
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Manga gratuito,{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">
              honesto y seguro
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300/95">
            TMO Secure nació para demostrar que se puede leer manga de forma gratuita
            sin sacrificar la privacidad del lector ni los derechos del creador.
          </p>
        </div>
      </motion.div>

      {/* Por qué existimos */}
      <motion.section
        className="mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
          ¿Por qué existe TMO Secure?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          La mayoría de plataformas de manga gratuitas sobreviven a base de publicidad
          agresiva, redirecciones maliciosas y recolección masiva de datos. El lector
          acaba pagando con su atención y su privacidad.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Creemos que hay otro camino: obras validadas directamente por sus autores,
          una IA guardiána que protege cada sesión de lectura, y un modelo sostenido
          por donaciones voluntarias —nunca por publicidad invasiva ni por la venta
          de datos.
        </p>
      </motion.section>

      {/* Valores */}
      <motion.section
        className="mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
          Nuestros compromisos
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {VALUES.map((v) => (
            <li
              key={v.label}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-slate-900/50 px-3.5 py-3 text-sm text-slate-200"
            >
              <span className="text-base" aria-hidden>
                {v.icon}
              </span>
              {v.label}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Cómo funciona la validación */}
      <motion.section
        className="mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
          Cómo validamos las obras
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Cada obra del catálogo tiene un proceso de validación con el autor original.
          No publicamos contenido sin consentimiento explícito y por escrito.
        </p>
        <ol className="mt-5 space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-white/[0.07] text-base">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  <span className="mr-1.5 text-xs text-slate-600">{i + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* El Guardian */}
      <motion.section
        className="mt-10 rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.06] p-6 ring-1 ring-cyan-400/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/90">
          El Guardian
        </p>
        <h2 className="mt-1.5 text-lg font-bold text-white">
          Tu asistente de lectura inteligente
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          El Guardian es un agente de IA que acompaña cada sesión de lectura. Detecta
          scroll sospechoso que los agregadores usan para descargar archivos de fondo,
          neutraliza redirecciones a páginas externas y guarda un historial de lo que
          lees para recomendarte contenido similar.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Todo el historial se guarda localmente en tu dispositivo. Si no consientes,
          el Guardian sigue activo pero no retiene datos personales.
        </p>
        <Link
          to="/guardian"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/35 transition hover:bg-cyan-500/25"
        >
          Configurar mi Guardian →
        </Link>
      </motion.section>

      {/* Sostenibilidad */}
      <motion.section
        className="mt-10 rounded-3xl border border-amber-500/20 bg-amber-500/[0.05] p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
          Sostenibilidad
        </p>
        <h2 className="mt-1.5 text-lg font-bold text-white">
          ¿Cómo se mantiene la plataforma?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          TMO Secure no genera ingresos por publicidad ni vende datos. Los costes de
          servidores, almacenamiento y el proceso de validación de autores se cubren
          íntegramente con <span className="font-semibold text-amber-200">donaciones voluntarias</span> de lectores
          que valoran la plataforma.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Si lees regularmente y quieres contribuir, cualquier aportación —por pequeña
          que sea— marca la diferencia.
        </p>
      </motion.section>

      {/* CTA final */}
      <motion.div
        className="mt-10 flex flex-col items-center gap-3 pb-4 sm:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/25 to-teal-600/15 px-5 py-2.5 text-sm font-bold text-cyan-50 ring-2 ring-cyan-400/45 transition hover:ring-cyan-300/60"
        >
          Explorar el catálogo →
        </Link>
        <Link
          to="/guardian"
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
        >
          Configurar Guardian
        </Link>
      </motion.div>
    </div>
  )
}
