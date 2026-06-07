import { useState, useEffect, useCallback, useRef } from "react";
import { S, FONT, GRADIENT_PRIMARY, hexA } from "../styles/tokens";
import { useSettings } from "../hooks/useSettings";
import { useReconocimientoVoz } from "../hooks/useReconocimientoVoz";
import { useSonido } from "../hooks/useSonido";
import BadgeOverlay from "../components/BadgeOverlay";
import { generarPregunta, esCorrecta } from "../data/motorJuego";
import { progresoHaciaSiguiente, nuevosDesbloqueos, PUNTOS_POR_VOZ, RACHA_MINIMA } from "../data/progresionLogica";
import { TIEMPOS } from "../data/progresion";

// ─── PANTALLA DE JUEGO (arcade · Fase 3: funcional) ───────────────────────
// Mecánica acordada: conjugar por voz (+1) o escrito (0 pts). Rachas visuales.
// Insignias desbloquean verbos/tiempos. Feedback con punch. TTS para "Escuchar".
// Sonido arcade (acierto/error/insignia) y overlay de celebración de insignia.

const etiquetaTiempo = (id) => TIEMPOS.find((t) => t.id === id)?.label ?? id;

export default function GameScreen() {
  const { voz, sonido, puntos, sumarPuntos, insignias, desbloqueado } = useSettings();
  const sfx = useSonido();

  // Material disponible según el progreso. Lo guardamos en un ref que se lee
  // SOLO al pedir una pregunta nueva (al montar y al pulsar Siguiente). Así, si
  // ganas una insignia a mitad de pregunta y el material crece, la pregunta
  // actual NO se regenera de golpe: los nuevos verbos/tiempos entran a partir
  // de la siguiente pregunta. (Arreglo del bug de "cambio de verbo al ganar
  // insignia".)
  const materialRef = useRef({ verbos: desbloqueado.verbos, tiempos: desbloqueado.tiempos });
  materialRef.current = { verbos: desbloqueado.verbos, tiempos: desbloqueado.tiempos };

  const [pregunta, setPregunta] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [feedback, setFeedback] = useState(null); // { tipo: 'ok'|'error', texto }
  const [racha, setRacha] = useState(0);
  const [celebracion, setCelebracion] = useState(null); // { insignia, desbloqueos }
  const [ayudaUsada, setAyudaUsada] = useState(false); // se pulsó "Escuchar"
  const inputRef = useRef(null);

  // Genera una pregunta nueva leyendo el material vigente en ese instante.
  const siguiente = useCallback(() => {
    const { verbos, tiempos } = materialRef.current;
    setPregunta(generarPregunta(verbos, tiempos));
    setRespuesta("");
    setFeedback(null);
    setAyudaUsada(false);
  }, []);

  // Primera pregunta, solo al montar la pantalla.
  useEffect(() => {
    const { verbos, tiempos } = materialRef.current;
    setPregunta(generarPregunta(verbos, tiempos));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Procesa una respuesta (venga de voz o de texto).
  const comprobar = useCallback(
    (texto, porVoz) => {
      if (!pregunta || feedback) return;
      const acierto = esCorrecta(texto, pregunta);
      if (acierto) {
        const nuevaRacha = racha + 1;
        setRacha(nuevaRacha);
        sfx.acierto(sonido);
        // Puntúa SOLO si es por voz Y no se usó la ayuda "Escuchar" en esta
        // pregunta. El anuncio de desbloqueo lo gestiona el useEffect de insignias.
        const puntua = porVoz && !ayudaUsada;
        if (puntua) {
          sumarPuntos(PUNTOS_POR_VOZ);
        }
        let mensaje;
        if (puntua) mensaje = `¡${pregunta.correcta}! +${PUNTOS_POR_VOZ}`;
        else if (ayudaUsada) mensaje = `¡${pregunta.correcta}! (sin puntos: usaste Escuchar)`;
        else mensaje = `¡${pregunta.correcta}! (escribe por voz para puntuar)`;
        setFeedback({ tipo: "ok", texto: mensaje });
      } else {
        setRacha(0);
        sfx.error(sonido);
        setFeedback({ tipo: "error", texto: `Era: ${pregunta.correcta}` });
      }
    },
    [pregunta, feedback, racha, sumarPuntos, ayudaUsada, sfx, sonido]
  );

  // Al ganar insignia: disparar la celebración (overlay) y su sonido.
  const insigniasPrev = useRef(insignias);
  useEffect(() => {
    if (insignias > insigniasPrev.current) {
      const nuevos = nuevosDesbloqueos(insigniasPrev.current, insignias);
      setCelebracion({ insignia: insignias, desbloqueos: nuevos });
      sfx.insignia(sonido);
    }
    insigniasPrev.current = insignias;
  }, [insignias, sfx, sonido]);

  // Reconocimiento de voz.
  const onResultadoVoz = useCallback((texto) => {
    setRespuesta(texto);
    comprobar(texto, true);
  }, [comprobar]);
  const { soportado: vozSoportada, escuchando, iniciar, detener } = useReconocimientoVoz({ onResultado: onResultadoVoz });

  // ¿Mostramos el campo de texto? Esquema A+C: si la voz está activada en
  // Ajustes Y el navegador la soporta, ocultamos el texto (o hablas o nada).
  // Si la voz no se soporta (iPhone) o está desactivada, mostramos el texto.
  const mostrarTexto = !voz || !vozSoportada;

  // TTS: pronunciar la conjugación correcta ("Escuchar"). Marca la pregunta
  // como "ayudada": a partir de aquí, acertarla no puntúa.
  const escuchar = useCallback(() => {
    if (!pregunta || typeof window === "undefined" || !window.speechSynthesis) return;
    setAyudaUsada(true);
    const u = new SpeechSynthesisUtterance(`${pregunta.pronombre.split("/")[0]} ${pregunta.correcta}`);
    u.lang = "es-ES";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, [pregunta]);

  const prog = progresoHaciaSiguiente(puntos);

  // Sin material (no debería pasar, pero defensivo).
  if (!desbloqueado.verbos.length || !desbloqueado.tiempos.length) {
    return (
      <div className="animate-fade-in" style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
        No hay verbos o tiempos disponibles. Ve a Ajustes.
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, minHeight: 0, gap: "clamp(0.75rem, 2vh, 1.25rem)", padding: "clamp(1rem, 2.5vh, 1.5rem) 1.25rem" }}
    >
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "1.1rem" }}>
          <HudStat icon="★" value={puntos} color={S.amarillo} label="Puntos" />
          <HudStat icon="◆" value={insignias} color={S.azul} label="Insignias" />
        </div>
        {racha >= RACHA_MINIMA && (
          <span style={{ fontFamily: FONT.arcade, fontWeight: 700, fontSize: "13px", color: S.fuxia, textShadow: `0 0 10px ${hexA(S.fuxia, 0.7)}` }}>
            🔥 RACHA x{racha}
          </span>
        )}
      </div>

      {/* Barra hacia la próxima insignia */}
      <div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", width: `${Math.round(prog.ratio * 100)}%`, background: `linear-gradient(90deg, ${S.fuxia}, ${S.azul})`, borderRadius: "999px", boxShadow: `0 0 12px ${hexA(S.fuxia, 0.6)}`, transition: "width 0.4s" }} />
        </div>
        <p style={{ fontSize: "10px", color: S.azul, textAlign: "center", marginTop: "5px" }}>
          {prog.faltan} {prog.faltan === 1 ? "punto" : "puntos"} para la próxima insignia
        </p>
      </div>

      {/* Celebración de insignia (overlay a pantalla) */}
      {celebracion && (
        <BadgeOverlay
          insignia={celebracion.insignia}
          desbloqueos={celebracion.desbloqueos}
          onCerrar={() => setCelebracion(null)}
        />
      )}

      {/* Verbo objetivo */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT.arcade, fontSize: "9px", letterSpacing: "0.2em", color: S.morado, marginBottom: "10px" }}>
          CONJUGA SIN DECIR EL PRONOMBRE
        </div>
        <h2 style={{ fontFamily: FONT.arcade, fontWeight: 900, fontSize: "clamp(2rem, 11vw, 2.8rem)", letterSpacing: "0.02em", lineHeight: 1, background: `linear-gradient(180deg, #fff 0%, ${S.azul} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", filter: `drop-shadow(0 0 18px ${hexA(S.azul, 0.5)})`, marginBottom: "10px", wordBreak: "break-word", textTransform: "uppercase" }}>
          {pregunta?.verbo ?? "—"}
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)" }}>
          {pregunta?.pronombre} · <span style={{ color: S.fuxia, fontWeight: 600 }}>{pregunta ? etiquetaTiempo(pregunta.tiempo) : ""}</span>
        </p>
      </div>

      {/* Micrófono */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <button
          className={escuchando ? "mic-listening" : "mic-idle"}
          aria-label={escuchando ? "Escuchando" : "Pulsa y habla"}
          onClick={() => (escuchando ? detener() : iniciar())}
          disabled={!vozSoportada || !!feedback}
          style={{
            width: "clamp(76px, 22vw, 92px)", height: "clamp(76px, 22vw, 92px)", borderRadius: "50%", border: "none",
            background: escuchando ? `radial-gradient(circle at 35% 30%, ${S.rojo}, #b3002d)` : `radial-gradient(circle at 35% 30%, ${S.verde}, #1fa30a)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: vozSoportada && !feedback ? "pointer" : "not-allowed", opacity: vozSoportada ? 1 : 0.4, flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="38" height="38" fill={escuchando ? "#2a0008" : "#06210a"} style={{ width: "42%", height: "42%" }}>
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
          </svg>
        </button>
        <span style={{ fontFamily: FONT.arcade, fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)" }}>
          {!vozSoportada ? "VOZ NO DISPONIBLE" : escuchando ? "ESCUCHANDO…" : "PULSA Y HABLA"}
        </span>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={feedback.tipo === "error" ? "shake" : "pop"} style={{ textAlign: "center", fontFamily: FONT.arcade, fontWeight: 700, fontSize: "16px", letterSpacing: "0.04em", color: feedback.tipo === "ok" ? S.verde : S.rojo, textShadow: `0 0 14px ${hexA(feedback.tipo === "ok" ? S.verde : S.rojo, 0.6)}` }}>
          {feedback.texto}
        </div>
      )}

      {/* Texto (solo si la voz no aplica) + acciones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mostrarTexto && (
          <input
            ref={inputRef}
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !feedback) comprobar(respuesta, false); }}
            placeholder="Escribe tu respuesta"
            disabled={!!feedback}
            style={{ width: "100%", background: S.bgSoft, border: `1px solid ${hexA(S.azul, 0.25)}`, borderRadius: "14px", padding: "14px 18px", fontSize: "16px", color: "#fff", textAlign: "center", fontFamily: FONT.body, outline: "none" }}
          />
        )}
        <div style={{ display: "flex", gap: "12px" }}>
          {feedback ? (
            <button className="btn" onClick={siguiente} style={btnStyle({ background: GRADIENT_PRIMARY, glow: hexA(S.fuxia, 0.8) })}>
              Siguiente ▶
            </button>
          ) : (
            <>
              {mostrarTexto && (
                <button className="btn" onClick={() => comprobar(respuesta, false)} style={btnStyle({ background: GRADIENT_PRIMARY, glow: hexA(S.fuxia, 0.8) })}>
                  Verificar
                </button>
              )}
              <button className="btn" onClick={escuchar} style={btnStyle({ background: "transparent", border: `1px solid ${hexA(S.azul, 0.4)}`, color: ayudaUsada ? "rgba(255,255,255,0.4)" : S.azul })}>
                {ayudaUsada ? "✦ Sin puntos" : "✦ Escuchar"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HudStat({ icon, value, color, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: FONT.arcade, fontWeight: 700, fontSize: "18px", color, textShadow: `0 0 10px ${hexA(color, 0.6)}` }}>
        <span style={{ fontSize: "14px" }}>{icon}</span> {value}
      </div>
      {label && (
        <span style={{ fontFamily: FONT.arcade, fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: hexA(color, 0.7) }}>
          {label}
        </span>
      )}
    </div>
  );
}

function btnStyle({ background, border = "none", color = "#fff", glow }) {
  return { flex: 1, fontFamily: FONT.arcade, fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color, background, border, borderRadius: "14px", padding: "15px", cursor: "pointer", boxShadow: glow ? `0 0 22px -6px ${glow}` : "none" };
}