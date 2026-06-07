// ─── MOTOR DEL JUEGO (puro, sin React) ────────────────────────────────────
// Genera preguntas (verbo + pronombre + tiempo al azar) y comprueba respuestas.
// La comparación tolera tildes, mayúsculas y espacios, porque el reconocimiento
// de voz no siempre acentúa y el estudiante no debe fallar por una tilde al
// hablar. Se valida la forma verbal, no la ortografía de la tilde.

import { conjugaciones } from "./conjugaciones";

// Los 5 pronombres del diccionario (no incluye "vosotros").
export const PRONOMBRES = ["yo", "tú", "él/ella", "nosotros", "ellos/ellas"];

// Normaliza para comparar: minúsculas, sin tildes, sin signos, espacios simples.
export function normalizar(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita diacríticos (tildes)
    .replace(/[¿?¡!.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Devuelve la conjugación correcta para verbo/pronombre/tiempo, o null si no
// existe. Estructura del diccionario: verbo → pronombre → { tiempo: forma }.
export function formaCorrecta(verbo, tiempo, idxPronombre) {
  const pronombre = PRONOMBRES[idxPronombre];
  const forma = conjugaciones?.[verbo]?.[pronombre]?.[tiempo];
  return typeof forma === "string" ? forma : null;
}

// Genera una pregunta al azar a partir de los verbos y tiempos disponibles.
// Devuelve null si no hay material suficiente (sin verbos o sin tiempos).
export function generarPregunta(verbos, tiempos, rnd = Math.random) {
  if (!verbos?.length || !tiempos?.length) return null;

  // Intentamos varias veces por si una combinación no existe en el diccionario.
  for (let intento = 0; intento < 30; intento++) {
    const verbo = verbos[Math.floor(rnd() * verbos.length)];
    const tiempo = tiempos[Math.floor(rnd() * tiempos.length)];
    const idxPronombre = Math.floor(rnd() * PRONOMBRES.length);
    const correcta = formaCorrecta(verbo, tiempo, idxPronombre);
    if (correcta) {
      return { verbo, tiempo, idxPronombre, pronombre: PRONOMBRES[idxPronombre], correcta };
    }
  }
  return null;
}

// Comprueba si la respuesta del estudiante coincide con la forma correcta.
// El estudiante NO debe decir el pronombre (regla del juego), pero si lo dice,
// lo toleramos: aceptamos tanto "comía" como "yo comía".
export function esCorrecta(respuesta, pregunta) {
  if (!pregunta) return false;
  const r = normalizar(respuesta);
  const correcta = normalizar(pregunta.correcta);
  if (!r) return false;
  if (r === correcta) return true;
  // Tolerar que incluya el pronombre delante (p.ej. "yo hablo").
  const conPronombre = normalizar(`${pregunta.pronombre.split("/")[0]} ${pregunta.correcta}`);
  if (r === conPronombre) return true;
  // Tolerar pronombres pegados comunes que el ASR pueda añadir.
  const sinPron = r.replace(/^(yo|tu|el|ella|nosotros|nosotras|vosotros|vosotras|ellos|ellas)\s+/, "");
  return sinPron === correcta;
}
