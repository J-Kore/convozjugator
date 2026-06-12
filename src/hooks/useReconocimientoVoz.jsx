import { useState, useRef, useEffect, useCallback } from "react";

// ─── HOOK DE RECONOCIMIENTO DE VOZ (iOS-seguro) ───────────────────────────
// Envuelve la Web Speech API en modo "pulsa y habla" (un disparo por pulsación).
// Funciona igual en Android, escritorio E iPhone/iPad.
//
// Interfaz pública (NO cambia, para no tocar GameScreen):
//   · soportado: si el navegador puede reconocer voz.
//   · escuchando: si está captando audio ahora mismo.
//   · iniciar(): empieza a escuchar; al obtener resultado llama a onResultado.
//   · detener(): para.
//
// CLAVES PARA iOS (WebKit), aprendidas en otras apps:
//   1. continuous:false e interimResults:false (true rompe WebKit).
//   2. En iOS hay que crear una instancia NUEVA en cada arranque: reutilizar
//      la instancia tras 'onend' la deja inservible y el siguiente start()
//      falla en silencio. En Android/escritorio se puede reutilizar.
//   3. Los errores 'no-speech' y 'aborted' son NORMALES (no fatales): no deben
//      tratarse como fallo. Solo 'not-allowed', 'service-not-allowed' y
//      'audio-capture' detienen de verdad.
//   iPadOS moderno se hace pasar por Mac: se detecta con maxTouchPoints > 1.

// Detección de plataforma (una sola vez).
const PLAT = (() => {
  if (typeof window === "undefined") {
    return { esIOS: false, SRClass: null, tieneSR: false };
  }
  const ua = navigator.userAgent || "";
  const esIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (/Mac/.test(navigator.platform || "") && (navigator.maxTouchPoints || 0) > 1);
  const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  return { esIOS, SRClass, tieneSR: !!SRClass };
})();

export function useReconocimientoVoz({ onResultado, idioma = "es-ES" } = {}) {
  const soportado = PLAT.tieneSR;
  const [escuchando, setEscuchando] = useState(false);
  const recRef = useRef(null);
  const onResultadoRef = useRef(onResultado);

  // Mantener la callback fresca sin recrear el reconocedor.
  useEffect(() => {
    onResultadoRef.current = onResultado;
  }, [onResultado]);

  // Fábrica: crea una instancia configurada de forma segura y le conecta los
  // handlers. Se usa tanto al montar como (en iOS) en cada iniciar().
  const crearReconocedor = useCallback(() => {
    const r = new PLAT.SRClass();
    r.lang = idioma;
    r.continuous = false;     // imprescindible: true rompe iOS/WebKit
    r.interimResults = false; // iOS no los gestiona de forma fiable
    r.maxAlternatives = 1;

    r.onstart = () => setEscuchando(true);

    r.onresult = (event) => {
      const res = event.results[event.results.length - 1];
      const texto = res && res[0] ? res[0].transcript : "";
      if (texto && texto.trim() && onResultadoRef.current) {
        onResultadoRef.current(texto);
      }
    };

    r.onend = () => setEscuchando(false);

    r.onerror = (event) => {
      // 'no-speech' y 'aborted' son normales (el usuario no dijo nada, o se
      // canceló): NO son fallo, dejamos que onend gestione el fin de escucha.
      const fatales = ["not-allowed", "service-not-allowed", "audio-capture"];
      if (fatales.includes(event.error)) {
        setEscuchando(false);
      }
    };

    return r;
  }, [idioma]);

  // Crear una instancia inicial (para Android/escritorio, que la reutilizan).
  useEffect(() => {
    if (!soportado) return;
    recRef.current = crearReconocedor();
    return () => {
      try {
        recRef.current?.abort();
      } catch {
        /* nada */
      }
    };
  }, [soportado, crearReconocedor]);

  const iniciar = useCallback(() => {
    if (!soportado || escuchando) return;
    try {
      // En iOS, instancia FRESCA en cada arranque: reutilizarla tras onend
      // la deja inservible. En Android/escritorio reusamos la existente.
      if (PLAT.esIOS) recRef.current = crearReconocedor();
      recRef.current.start();
    } catch {
      // start() puede lanzar si la instancia quedó en mal estado: reintentar
      // con una instancia nueva (cubre el caso iOS y casos límite).
      try {
        recRef.current = crearReconocedor();
        recRef.current.start();
      } catch {
        setEscuchando(false);
      }
    }
  }, [soportado, escuchando, crearReconocedor]);

  const detener = useCallback(() => {
    if (!recRef.current) return;
    try {
      recRef.current.stop();
    } catch {
      /* nada */
    }
    setEscuchando(false);
  }, []);

  return { soportado, escuchando, iniciar, detener };
}