import { useRef, useCallback } from "react";

// ─── SONIDO ARCADE (Web Audio API) ────────────────────────────────────────
// Genera los efectos por código (sin archivos): "ding" de acierto, tono grave
// de error y pequeña fanfarria de insignia. Pensado para sustituirse en el
// futuro por archivos de audio sin cambiar quien lo usa: bastaría reemplazar
// el cuerpo de reproducir() por la carga/play de un <audio> o AudioBuffer.
//
// El AudioContext se crea de forma perezosa en el primer sonido, porque los
// navegadores bloquean el audio hasta que hay una interacción del usuario
// (aquí siempre la hay: pulsar el micro o un botón antes del primer efecto).

// Secuencias de notas (frecuencia en Hz, duración en s) por tipo de evento.
const SECUENCIAS = {
  acierto: [
    { f: 660, d: 0.09 },
    { f: 880, d: 0.12 }, // dos notas ascendentes: "ti-ri"
  ],
  error: [
    { f: 200, d: 0.18 },
    { f: 150, d: 0.18 }, // grave descendente: "buzz"
  ],
  insignia: [
    { f: 523, d: 0.12 }, // do
    { f: 659, d: 0.12 }, // mi
    { f: 784, d: 0.12 }, // sol
    { f: 1047, d: 0.26 }, // do agudo (fanfarria)
  ],
};

export function useSonido() {
  const ctxRef = useRef(null);

  const getCtx = () => {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctxRef.current) ctxRef.current = new AC();
    return ctxRef.current;
  };

  // Reproduce una secuencia de notas con envolvente suave (sin "clics").
  const reproducir = useCallback((tipo, activado) => {
    if (!activado) return;
    const ctx = getCtx();
    if (!ctx) return;
    // Algunos navegadores dejan el contexto "suspendido" hasta interacción.
    if (ctx.state === "suspended") ctx.resume();

    const notas = SECUENCIAS[tipo];
    if (!notas) return;

    let t = ctx.currentTime;
    for (const nota of notas) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tipo === "error" ? "sawtooth" : "square"; // square = retro arcade
      osc.frequency.value = nota.f;
      // Envolvente: ataque rápido y caída suave para que no chasquee.
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + nota.d);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + nota.d);
      t += nota.d;
    }
  }, []);

  return {
    acierto: (on) => reproducir("acierto", on),
    error: (on) => reproducir("error", on),
    insignia: (on) => reproducir("insignia", on),
  };
}
