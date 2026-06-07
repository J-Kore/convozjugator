import { useState } from "react";
import { S, FONT, hexA } from "../styles/tokens";
import { conjugaciones } from "../data/conjugaciones";
import { TIEMPOS } from "../data/progresion";
import { useSettings } from "../hooks/useSettings";

// ─── PANTALLA DE AJUSTES (arcade · funcional) ─────────────────────────────
// El estudiante elige qué practicar. Lo disponible (desbloqueado por progreso)
// es seleccionable; el resto se muestra bloqueado con candado.

// Lista completa de verbos del diccionario, ordenada alfabéticamente.
const TODOS_VERBOS = Object.keys(conjugaciones).sort((a, b) => a.localeCompare(b, "es"));

export default function SettingsScreen() {
  const { voz, setVoz, sonido, setSonido, verbos, tiempos, toggleVerbo, toggleTiempo, setVerbos, setTiempos, desbloqueado, reiniciarProgreso } = useSettings();

  // Confirmación del reinicio de progreso (evita borrados accidentales).
  const [confirmando, setConfirmando] = useState(false);

  // Disponibles = lo desbloqueado por el progreso (crece con las insignias).
  const VERBOS_DISPONIBLES = desbloqueado.verbos;
  const TIEMPOS_DISPONIBLES = desbloqueado.tiempos;

  return (
    <div className="animate-fade-in" style={{ padding: "1.5rem 1.25rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h2 style={{ fontFamily: FONT.arcade, fontSize: "1.3rem", fontWeight: 700, textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Configuración
      </h2>

      {/* Toggle de voz */}
      <section style={panelStyle(S.azul)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={tituloPanel(S.azul)}>Entrada por voz</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
              {voz ? "El micrófono estará disponible al jugar." : "Solo escribirás las respuestas."}
            </p>
          </div>
          <Toggle on={voz} onClick={() => setVoz(!voz)} color={S.azul} />
        </div>
      </section>

      {/* Toggle de sonido */}
      <section style={panelStyle(S.verde)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={tituloPanel(S.verde)}>Sonido</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
              {sonido ? "Efectos de acierto, error e insignia activados." : "Sin efectos de sonido."}
            </p>
          </div>
          <Toggle on={sonido} onClick={() => setSonido(!sonido)} color={S.verde} />
        </div>
      </section>

      {/* Verbos */}
      <section style={panelStyle(S.fuxia)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.85rem" }}>
          <h3 style={tituloPanel(S.fuxia)}>Verbos</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <MiniBtn onClick={() => setVerbos(VERBOS_DISPONIBLES)} color={S.fuxia}>Todos</MiniBtn>
            <MiniBtn onClick={() => setVerbos([])} color="rgba(255,255,255,0.4)">Ninguno</MiniBtn>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {TODOS_VERBOS.map((v) => {
            const bloqueado = !VERBOS_DISPONIBLES.includes(v);
            return (
              <Chip key={v} label={v} bloqueado={bloqueado} activo={verbos.includes(v)} color={S.fuxia} onClick={() => !bloqueado && toggleVerbo(v)} />
            );
          })}
        </div>
      </section>

      {/* Tiempos */}
      <section style={panelStyle(S.morado)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.85rem" }}>
          <h3 style={tituloPanel(S.morado)}>Tiempos verbales</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <MiniBtn onClick={() => setTiempos(TIEMPOS_DISPONIBLES)} color={S.morado}>Todos</MiniBtn>
            <MiniBtn onClick={() => setTiempos([])} color="rgba(255,255,255,0.4)">Ninguno</MiniBtn>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
          {TIEMPOS.map((t) => {
            const bloqueado = !TIEMPOS_DISPONIBLES.includes(t.id);
            return (
              <Chip key={t.id} label={t.label} bloqueado={bloqueado} activo={tiempos.includes(t.id)} color={S.morado} onClick={() => !bloqueado && toggleTiempo(t.id)} />
            );
          })}
        </div>
      </section>

      {/* Reiniciar progreso (acción destructiva, con confirmación) */}
      <section style={{ ...panelStyle(S.rojo), marginTop: "0.5rem" }}>
        <h3 style={tituloPanel(S.rojo)}>Reiniciar progreso</h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "4px", marginBottom: "0.85rem" }}>
          Pone los puntos e insignias a cero. Mantiene tus verbos, tiempos y ajustes.
        </p>
        {!confirmando ? (
          <button
            onClick={() => setConfirmando(true)}
            style={{ width: "100%", fontFamily: FONT.arcade, fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: S.rojo, background: "transparent", border: `1px solid ${hexA(S.rojo, 0.4)}`, borderRadius: "10px", padding: "12px", cursor: "pointer" }}
          >
            Reiniciar
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>¿Seguro? Esto no se puede deshacer.</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => { reiniciarProgreso(); setConfirmando(false); }}
                style={{ flex: 1, fontFamily: FONT.arcade, fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", background: S.rojo, border: "none", borderRadius: "10px", padding: "12px", cursor: "pointer" }}
              >
                Sí, reiniciar
              </button>
              <button
                onClick={() => setConfirmando(false)}
                style={{ flex: 1, fontFamily: FONT.arcade, fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "12px", cursor: "pointer" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Chip({ label, bloqueado, activo, color, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={bloqueado}
      aria-pressed={activo}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px",
        fontFamily: FONT.body, fontSize: "13px", fontWeight: 500,
        padding: "10px 12px", borderRadius: "10px", cursor: bloqueado ? "not-allowed" : "pointer",
        textTransform: "capitalize", textAlign: "left",
        color: bloqueado ? "rgba(255,255,255,0.3)" : activo ? "#fff" : "rgba(255,255,255,0.7)",
        background: activo && !bloqueado ? hexA(color, 0.18) : "rgba(255,255,255,0.04)",
        border: `1px solid ${activo && !bloqueado ? color : "rgba(255,255,255,0.1)"}`,
        boxShadow: activo && !bloqueado ? `0 0 14px -4px ${color}` : "none",
        transition: "all 0.15s ease",
      }}
    >
      <span>{label}</span>
      {bloqueado && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Bloqueado">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )}
    </button>
  );
}

function Toggle({ on, onClick, color }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      aria-label="Entrada por voz"
      style={{
        width: "48px", height: "28px", borderRadius: "999px", border: "none", cursor: "pointer",
        background: on ? color : "rgba(255,255,255,0.15)",
        boxShadow: on ? `0 0 14px -3px ${color}` : "none",
        position: "relative", transition: "background 0.2s, box-shadow 0.2s", flexShrink: 0,
      }}
    >
      <span style={{ position: "absolute", top: "3px", left: on ? "23px" : "3px", width: "22px", height: "22px", borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </button>
  );
}

function MiniBtn({ children, onClick, color }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT.body, fontSize: "12px", fontWeight: 600, color }}>
      {children}
    </button>
  );
}

function panelStyle(color) {
  return { background: S.bgSoft, border: `1px solid ${hexA(color, 0.25)}`, borderRadius: "14px", padding: "1.25rem" };
}

function tituloPanel(color) {
  return { fontFamily: FONT.arcade, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color };
}
