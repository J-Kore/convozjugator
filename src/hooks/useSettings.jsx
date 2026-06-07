import { createContext, useContext, useState, useEffect } from "react";
import { VERBOS_INICIALES, TIEMPOS_INICIALES } from "../data/progresion";
import { insigniasPara, contenidoDesbloqueado } from "../data/progresionLogica";

// ─── ESTADO COMPARTIDO DE AJUSTES ─────────────────────────────────────────
// Guarda la configuración del estudiante (voz on/off, verbos y tiempos
// seleccionados) y la comparte con el resto de la app. La pantalla de Juego
// (Fase 3) leerá de aquí qué practicar.
//
// PERSISTENCIA: la selección se guarda en localStorage para recordarla al
// recargar. Se envuelve en try/catch por si el navegador la tiene bloqueada
// (modo incógnito estricto, etc.); en ese caso la app sigue funcionando, solo
// que no recuerda entre sesiones.

const STORAGE_KEY = "convozjugator:ajustes";
const SettingsContext = createContext(null);

// Lee el estado guardado, o devuelve los valores iniciales si no hay nada.
function cargarEstadoInicial() {
  const porDefecto = {
    voz: true,
    sonido: true,
    verbos: VERBOS_INICIALES,
    tiempos: TIEMPOS_INICIALES,
    puntos: 0,
  };
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (!guardado) return porDefecto;
    const parsed = JSON.parse(guardado);
    // Validación defensiva: si el dato guardado está corrupto, usa defaults.
    return {
      voz: typeof parsed.voz === "boolean" ? parsed.voz : porDefecto.voz,
      sonido: typeof parsed.sonido === "boolean" ? parsed.sonido : porDefecto.sonido,
      verbos: Array.isArray(parsed.verbos) ? parsed.verbos : porDefecto.verbos,
      tiempos: Array.isArray(parsed.tiempos) ? parsed.tiempos : porDefecto.tiempos,
      puntos: Number.isFinite(parsed.puntos) ? parsed.puntos : porDefecto.puntos,
    };
  } catch {
    return porDefecto;
  }
}

export function SettingsProvider({ children }) {
  const [voz, setVoz] = useState(() => cargarEstadoInicial().voz);
  const [sonido, setSonido] = useState(() => cargarEstadoInicial().sonido);
  const [verbos, setVerbos] = useState(() => cargarEstadoInicial().verbos);
  const [tiempos, setTiempos] = useState(() => cargarEstadoInicial().tiempos);
  const [puntos, setPuntos] = useState(() => cargarEstadoInicial().puntos);

  // Persiste cualquier cambio. El try/catch evita romper si localStorage falla.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ voz, sonido, verbos, tiempos, puntos }));
    } catch {
      // Silencioso: la app funciona igual, solo no persiste.
    }
  }, [voz, sonido, verbos, tiempos, puntos]);

  // Alterna un elemento dentro de un array (seleccionar/deseleccionar).
  const toggle = (lista, set) => (item) =>
    set(lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item]);

  // Suma puntos (al acertar por voz). Devuelve cuántas insignias hay antes y
  // después, para que el juego pueda anunciar desbloqueos.
  const sumarPuntos = (cantidad) => {
    setPuntos((p) => p + cantidad);
  };

  // Reinicia el progreso de juego: pone los puntos a 0 (y por tanto las
  // insignias y los desbloqueos). MANTIENE la selección de verbos/tiempos y
  // los ajustes de voz/sonido: reiniciar es "volver a empezar la partida",
  // no perder las preferencias.
  const reiniciarProgreso = () => {
    setPuntos(0);
  };

  // Progreso derivado de los puntos (no se guarda aparte: se calcula).
  const insignias = insigniasPara(puntos);
  const desbloqueado = contenidoDesbloqueado(insignias);

  const value = {
    voz,
    setVoz,
    sonido,
    setSonido,
    verbos,
    tiempos,
    toggleVerbo: toggle(verbos, setVerbos),
    toggleTiempo: toggle(tiempos, setTiempos),
    setVerbos,
    setTiempos,
    // Estado de juego / progreso
    puntos,
    sumarPuntos,
    reiniciarProgreso,
    insignias,
    desbloqueado, // { verbos: [...], tiempos: [...] } según insignias
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// Hook para consumir el estado de ajustes desde cualquier pantalla.
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings debe usarse dentro de <SettingsProvider>");
  return ctx;
}
