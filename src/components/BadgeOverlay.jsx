import { S, FONT, hexA } from "../styles/tokens";
import { TIEMPOS } from "../data/progresion";

// ─── CELEBRACIÓN DE INSIGNIA ──────────────────────────────────────────────
// Overlay a pantalla completa que para el juego un instante para celebrar el
// logro: medalla con destello, número de insignia y lo recién desbloqueado.
// Se cierra solo tras unos segundos o al tocar. No tapa de forma permanente.

const etiquetaTiempo = (id) => TIEMPOS.find((t) => t.id === id)?.label ?? id;

export default function BadgeOverlay({ insignia, desbloqueos, onCerrar }) {
  const { verbos = [], tiempos = [] } = desbloqueos || {};

  return (
    <div
      onClick={onCerrar}
      role="dialog"
      aria-label="Nueva insignia conseguida"
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "1.5rem", padding: "2rem",
        background: hexA(S.bg, 0.92),
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        cursor: "pointer",
        animation: "fadeInUp 0.3s ease",
      }}
    >
      {/* Destello + medalla */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Rayos de destello */}
        <div className="badge-rays" style={{ position: "absolute", width: "220px", height: "220px", borderRadius: "50%", background: `conic-gradient(${hexA(S.amarillo, 0.0)}, ${hexA(S.amarillo, 0.35)}, ${hexA(S.amarillo, 0.0)}, ${hexA(S.fuxia, 0.35)}, ${hexA(S.amarillo, 0.0)})` }} />
        {/* Halo */}
        <div style={{ position: "absolute", width: "150px", height: "150px", borderRadius: "50%", background: `radial-gradient(circle, ${hexA(S.amarillo, 0.4)}, transparent 70%)` }} />
        {/* Medalla */}
        <div
          className="badge-pop"
          style={{
            position: "relative", width: "110px", height: "110px", borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${S.amarillo}, #c98a00)`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: `3px solid ${hexA("#ffffff", 0.6)}`,
            boxShadow: `0 0 40px ${hexA(S.amarillo, 0.7)}`,
          }}
        >
          <span style={{ fontSize: "34px", lineHeight: 1 }}>🏅</span>
          <span style={{ fontFamily: FONT.arcade, fontWeight: 900, fontSize: "16px", color: "#3a2700", marginTop: "2px" }}>
            {insignia}
          </span>
        </div>
      </div>

      {/* Título */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: FONT.arcade, fontWeight: 900, fontSize: "1.6rem", letterSpacing: "0.06em", textTransform: "uppercase", background: `linear-gradient(135deg, ${S.amarillo}, ${S.fuxia})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ¡Insignia {insignia}!
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>Has desbloqueado contenido nuevo</p>
      </div>

      {/* Desbloqueos */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
        {verbos.length > 0 && (
          <Desbloqueo color={S.fuxia} titulo={verbos.length === 1 ? "Nuevo verbo" : "Nuevos verbos"} items={verbos} />
        )}
        {tiempos.length > 0 && (
          <Desbloqueo color={S.morado} titulo={tiempos.length === 1 ? "Nuevo tiempo" : "Nuevos tiempos"} items={tiempos.map(etiquetaTiempo)} />
        )}
      </div>

      <p style={{ fontFamily: FONT.arcade, fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
        Toca para continuar
      </p>
    </div>
  );
}

function Desbloqueo({ color, titulo, items }) {
  return (
    <div style={{ background: hexA(color, 0.12), border: `1px solid ${hexA(color, 0.4)}`, borderRadius: "12px", padding: "12px 14px" }}>
      <div style={{ fontFamily: FONT.arcade, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color, marginBottom: "6px" }}>
        {titulo}
      </div>
      <div style={{ fontSize: "15px", color: "#fff", fontWeight: 500, textTransform: "capitalize" }}>
        {items.join(" · ")}
      </div>
    </div>
  );
}
