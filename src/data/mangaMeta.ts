import type { Manga } from '../types/manga'

type MetaFields = Pick<
  Manga,
  'extendedSynopsis' | 'baseRating' | 'ratingCount'
>

export const MANGA_META: Record<string, MetaFields> = {
  'neon-samurai': {
    extendedSynopsis:
      'En Neo-Kyō, las corporaciones controlan la luz y la lluvia. Hiroshi, un ronin cibernético sin memoria del pasado, patrulla callejones donde cada reflejo puede ser una trampa publicitaria disfrazada de portal. Cuando descubre que el núcleo de la ciudad oculta un protocolo que redirige a lectores inocentes, deberá elegir entre venganza y proteger a quienes aún confían en las rutas “limpias”. Acción trepidante, conspiración y escenas de persecución bajo neón.',
    baseRating: 4.6,
    ratingCount: 2840,
  },
  'guardian-code': {
    extendedSynopsis:
      'Neko-OS es una IA doméstica que aprende del comportamiento de su dueña: distingue ayuda real de botones engañosos, ventanas emergentes y enlaces que prometen “el capítulo siguiente” pero abren otra pestaña. Entre chistes felinos y lecciones de ciberseguridad, la serie explora cómo la tecnología puede cuidar sin ser invasiva. Ideal si te gusta la comedia ligera con mensaje y referencias directas al Guardian de TMO Secure.',
    baseRating: 4.8,
    ratingCount: 1920,
  },
  'void-library': {
    extendedSynopsis:
      'Cada tomo en la Biblioteca del Vacío abre una dimensión distinta. El bibliotecario novato debe cerrar portales antes de que consuman los estantes — y a los lectores atrapados en bucles de redirección infinita. Thriller fantástico con reglas claras, puzzles dimensionales y un clímax donde el protagonista decide qué historias merecen seguir existiendo.',
    baseRating: 4.4,
    ratingCount: 1560,
  },
  'cat-signal': {
    extendedSynopsis:
      'Un gato callejero emite señales que solo ciertos lectores perciben: vibraciones en la UI, parpadeos en la esquina del panel. Entre sketches cómicos y misterio suave, la serie pregunta quién controla el feed cuando nadie mira. Perfecta para descansar entre lecturas intensas, con capítulos cortos y tono slice-of-life con guiño thriller.',
    baseRating: 4.5,
    ratingCount: 980,
  },
  'steel-orbit': {
    extendedSynopsis:
      'Adolescentes pilotos defienden la órbita terrestre frente a un enemigo que nunca muestra su forma completa — solo interferencias y rutas corruptas en los sistemas de navegación. Mechas, lealtad de escuadrón y batallas donde cada victoria desbloquea fragmentos de verdad sobre la guerra. Acción sci-fi con corazón y escenas de despliegue espectacular.',
    baseRating: 4.3,
    ratingCount: 2100,
  },
  'ink-memories': {
    extendedSynopsis:
      'Dos excompañeros de secundaria se reencuentran en una imprenta familiar que guarda cartas nunca enviadas. Entre olor a tinta y silencios cómodos, reconstruyen lo que dejaron sin decir. Romance maduro y drama íntimo, sin artificios: cada capítulo avanza por gestos pequeños, errores del pasado y la decisión de volver a confiar.',
    baseRating: 4.7,
    ratingCount: 1340,
  },
  'phantom-detective': {
    extendedSynopsis:
      'Un detective solo ve huellas de crímenes que “aún no ocurrieron”. Cada caso lo acerca a su propio borrado en los archivos de la ciudad. Thriller psicológico con giros, preguntas sobre destino y escenas de investigación que juegan con el tiempo. Recomendado si te gustan los misterios que aprietan hasta el último panel.',
    baseRating: 4.5,
    ratingCount: 1780,
  },
  'summer-haze': {
    extendedSynopsis:
      'Un verano que no termina en un pueblo costero: el reloj avanza distinto para cada habitante y los recuerdos se superponen como capas de niebla. Romance contemplativo, paseos al atardecer y secretos compartidos en el muelle. La serie celebra los momentos quietos sin perder el hilo emocional entre los protagonistas.',
    baseRating: 4.6,
    ratingCount: 890,
  },
  'drift-kings': {
    extendedSynopsis:
      'Carreras clandestinas con apuestas digitales: cada victoria desbloquea un archivo cifrado en la nube. El equipo protagonista descubre que los patrocinadores manipulan rutas GPS y enlaces de streaming para desviar audiencias. Acción sobre ruedas, tensión en curvas cerradas y un arco sobre confianza cuando el premio no es solo dinero.',
    baseRating: 4.2,
    ratingCount: 1650,
  },
  'echo-garden': {
    extendedSynopsis:
      'En un jardín botánico remoto, las plantas repiten en voz baja el último secreto que escucharon. La protagonista, botánica tímida, aprende a escuchar sin juzgar mientras cierra ciclos entre humanos y naturaleza. Fantasía suave, slice-of-life y pinceladas de misterio que invitan a releer cada diálogo.',
    baseRating: 4.4,
    ratingCount: 720,
  },
  'cyber-healer': {
    extendedSynopsis:
      'Médicos con nanobots éticos debaten hasta dónde curar sin convertirse en vigilantes corporativos. Cada capítulo plantea un dilema: consentimiento, datos del paciente y quién controla el historial clínico en la nube. Sci-fi médico con tono thriller y reflexión sobre tecnología al servicio de las personas.',
    baseRating: 4.5,
    ratingCount: 1100,
  },
  'ghost-band': {
    extendedSynopsis:
      'Una banda de ensayo solo puede tocar covers de canciones que nadie recuerda haber existido. Entre ensayos fallidos y risas, descubren que la música fantasma conecta con lectores perdidos en sitios espejo. Comedia musical con toques sobrenaturales y amistad de grupo auténtica.',
    baseRating: 4.3,
    ratingCount: 640,
  },
}

const DEFAULT_META: MetaFields = {
  extendedSynopsis: '',
  baseRating: 4.0,
  ratingCount: 100,
}

export function applyMangaMeta<T extends { id: string; synopsis: string }>(
  manga: T,
): T & MetaFields {
  const meta = MANGA_META[manga.id] ?? DEFAULT_META
  return {
    ...manga,
    extendedSynopsis: meta.extendedSynopsis || manga.synopsis,
    baseRating: meta.baseRating,
    ratingCount: meta.ratingCount,
  }
}
