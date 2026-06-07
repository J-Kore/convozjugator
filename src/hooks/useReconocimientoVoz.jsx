import { useState, useRef, useEffect, useCallback } from "react";

// ─── HOOK DE RECONOCIMIENTO DE VOZ ────────────────────────────────────────
// Envuelve la Web Speech API (SpeechRecognition). Expone:
//   · soportado: si el navegador puede reconocer voz (Chrome/Edge/Android sí;
//     Safari/iPhone y Firefox no, de forma fiable).
//   · escuchando: si está captando audio ahora mismo.
//   · iniciar(): empieza a escuchar; al obtener resultado llama a onResultado.
//   · detener(): para.
//
// La detección de soporte permite que el juego oculte el campo de texto donde
// hay voz y lo muestre como alternativa donde no la hay (esquema A+C acordado).

export function useReconocimientoVoz({ onResultado, idioma = "es-ES" } = {}) {
  // El constructor está prefijado en algunos navegadores.
  const SpeechRecognition =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const soportado = !!SpeechRecognition;
  const [escuchando, setEscuchando] = useState(false);
  const recRef = useRef(null);
  const onResultadoRef = useRef(onResultado);

  // Mantener la callback fresca sin recrear el reconocedor.
  useEffect(() => {
    onResultadoRef.current = onResultado;
  }, [onResultado]);

  // Crear el reconocedor una sola vez.
  useEffect(() => {
    if (!soportado) return;
    const rec = new SpeechRecognition();
    rec.lang = idioma;
    rec.interimResults = false; // solo el resultado final
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onresult = (event) => {
      const texto = event.results[0]?.[0]?.transcript ?? "";
      if (onResultadoRef.current) onResultadoRef.current(texto);
    };
    rec.onend = () => setEscuchando(false);
    rec.onerror = () => setEscuchando(false);

    recRef.current = rec;
    return () => {
      try { rec.abort(); } catch { /* nada */ }
    };
  }, [soportado, idioma, SpeechRecognition]);

  const iniciar = useCallback(() => {
    if (!soportado || !recRef.current || escuchando) return;
    try {
      recRef.current.start();
      setEscuchando(true);
    } catch {
      // start() lanza si ya estaba activo; lo ignoramos.
    }
  }, [soportado, escuchando]);

  const detener = useCallback(() => {
    if (!recRef.current) return;
    try { recRef.current.stop(); } catch { /* nada */ }
    setEscuchando(false);
  }, []);

  return { soportado, escuchando, iniciar, detener };
}
