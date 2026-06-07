// ─── LÓGICA DE PROGRESIÓN (pura, sin React) ───────────────────────────────
// Reglas del esquema acordado:
//   · Voz acierto: +1 punto. Escrito acierto: 0 puntos (no progresa).
//   · 1ª insignia a los 5 puntos; después, cada 10.
//   · Cada insignia → 3 verbos nuevos (regulares primero).
//   · Cada 3 insignias → esos 3 verbos son irregulares (sube el reto).
//   · Cada 5 insignias → 1 tiempo verbal nuevo.
// Funciones puras: dado un nº de puntos/insignias, calculan el estado. Esto
// hace la mecánica fácil de verificar y de afinar (los números están aquí).

import { conjugaciones } from "./conjugaciones";
import { VERBOS_INICIALES, TIEMPOS_INICIALES, TIEMPOS } from "./progresion";

export const PUNTOS_POR_VOZ = 1;
export const PUNTOS_POR_ESCRITO = 0;
export const RACHA_MINIMA = 3; // a partir de aquí se muestra "racha xN"

// Umbral de puntos para alcanzar la insignia número n (n = 1, 2, 3...).
// 1ª a los 10; luego +15 cada vez: 10, 25, 40, 55...
export function umbralInsignia(n) {
  if (n <= 0) return 0;
  return 10 + (n - 1) * 15;
}

// Nº de insignias que corresponden a una cantidad de puntos.
export function insigniasPara(puntos) {
  let n = 0;
  while (puntos >= umbralInsignia(n + 1)) n++;
  return n;
}

// Puntos que faltan para la próxima insignia y progreso 0–1 hacia ella.
export function progresoHaciaSiguiente(puntos) {
  const insignias = insigniasPara(puntos);
  const base = umbralInsignia(insignias);          // umbral ya alcanzado
  const siguiente = umbralInsignia(insignias + 1); // próximo umbral
  const tramo = siguiente - base;
  const avance = puntos - base;
  return {
    insignias,
    faltan: siguiente - puntos,
    ratio: tramo > 0 ? avance / tramo : 0,
  };
}

// ── Clasificación de verbos por regularidad ──
// Determinar regularidad "de verdad" requeriría análisis morfológico; para el
// juego basta una lista curada de los irregulares frecuentes del diccionario.
const IRREGULARES = new Set([
  "ser", "estar", "ir", "haber", "tener", "hacer", "poder", "querer", "decir",
  "venir", "poner", "salir", "traer", "caber", "saber", "ver", "dar", "caer",
  "conducir", "traducir", "producir", "introducir", "lucir", "construir",
  "destruir", "huir", "valer", "oír", "volver", "morir", "dormir", "pedir",
  "sentir", "preferir", "hervir", "freír", "encontrar", "cerrar", "empezar",
  "perder", "jugar", "nacer", "imprimir", "cubrir", "abrir", "escribir", "romper",
]);

export function esIrregular(verbo) {
  return IRREGULARES.has(verbo);
}

// Listas ordenadas de verbos para el desbloqueo (excluyendo los iniciales).
// Regulares primero (se entregan en los packs normales), irregulares después
// (se entregan en los packs de "cada 3 insignias").
const RESTANTES = Object.keys(conjugaciones)
  .filter((v) => !VERBOS_INICIALES.includes(v))
  .sort((a, b) => a.localeCompare(b, "es"));

const REGULARES_POOL = RESTANTES.filter((v) => !esIrregular(v));
const IRREGULARES_POOL = RESTANTES.filter((v) => esIrregular(v));

// Tiempos que se pueden desbloquear (los que no son iniciales), en orden.
const TIEMPOS_POOL = TIEMPOS.map((t) => t.id).filter((id) => !TIEMPOS_INICIALES.includes(id));

// Dado un nº de insignias, calcula TODO lo desbloqueado (verbos y tiempos).
// Determinista: las mismas insignias dan siempre el mismo contenido.
export function contenidoDesbloqueado(insignias) {
  const verbos = [...VERBOS_INICIALES];
  const tiempos = [...TIEMPOS_INICIALES];

  let regIdx = 0; // puntero en pool de regulares
  let irrIdx = 0; // puntero en pool de irregulares

  for (let n = 1; n <= insignias; n++) {
    // Cada 3 insignias, el pack es de irregulares; el resto, regulares.
    const esPackIrregular = n % 3 === 0;
    const pool = esPackIrregular ? IRREGULARES_POOL : REGULARES_POOL;
    const idxRef = esPackIrregular ? irrIdx : regIdx;

    const pack = pool.slice(idxRef, idxRef + 3);
    pack.forEach((v) => { if (!verbos.includes(v)) verbos.push(v); });

    if (esPackIrregular) irrIdx += 3; else regIdx += 3;

    // Cada 5 insignias, 1 tiempo nuevo.
    if (n % 5 === 0) {
      const tiempoIdx = Math.floor(n / 5) - 1;
      const nuevo = TIEMPOS_POOL[tiempoIdx];
      if (nuevo && !tiempos.includes(nuevo)) tiempos.push(nuevo);
    }
  }

  return { verbos, tiempos };
}

// Compara contenido antes/después para anunciar lo recién desbloqueado.
export function nuevosDesbloqueos(insigniasAntes, insigniasDespues) {
  const antes = contenidoDesbloqueado(insigniasAntes);
  const despues = contenidoDesbloqueado(insigniasDespues);
  return {
    verbos: despues.verbos.filter((v) => !antes.verbos.includes(v)),
    tiempos: despues.tiempos.filter((t) => !antes.tiempos.includes(t)),
  };
}
