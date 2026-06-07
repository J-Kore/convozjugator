// ─── CONFIGURACIÓN DE PROGRESIÓN ──────────────────────────────────────────
// Define qué está disponible al empezar y qué se desbloquea con el progreso.
// La MECÁNICA de desblooqueo (ganar puntos) se conecta en la Fase 3; aquí solo
// se declaran los datos: qué es básico y qué está bloqueado de inicio.
//
// Pensado para crecer: en el futuro, un verbo/tiempo podrá bloquearse por
// "premium" (suscripción) además de por "progreso", sin reescribir esto:
// bastará añadir el motivo en el objeto correspondiente.

// Verbos regulares con los que se arranca (disponibles sin desbloquear).
// Set sensato: -ar, -er, -ir regulares de uso muy frecuente.
export const VERBOS_INICIALES = [
  "hablar",
  "estudiar",
  "comer",
  "aprender",
  "vivir",
  "abrir",
];

// Tiempos verbales disponibles de inicio. El resto se desbloquea con progreso.
// Empezamos por los dos primeros que se enseñan en ELE.
export const TIEMPOS_INICIALES = ["presente", "pretérito indefinido"];

// Orden y etiqueta legible de los 8 tiempos del diccionario.
// El orden refleja una progresión didáctica razonable (de A1 hacia arriba).
export const TIEMPOS = [
  { id: "presente", label: "Presente" },
  { id: "pretérito indefinido", label: "Pretérito indefinido" },
  { id: "pretérito imperfecto", label: "Pretérito imperfecto" },
  { id: "futuro", label: "Futuro" },
  { id: "pretérito perfecto compuesto", label: "Pretérito perfecto" },
  { id: "condicional", label: "Condicional" },
  { id: "presente de subjuntivo", label: "Presente de subjuntivo" },
  { id: "imperfecto de subjuntivo", label: "Imperfecto de subjuntivo" },
];
