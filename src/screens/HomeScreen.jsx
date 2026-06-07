import Logo from "../components/Logo";
import Seal from "../components/Seal";
import { S, FONT, GRADIENT_PRIMARY, hexA } from "../styles/tokens";

// ─── PANTALLA DE INICIO (arcade · sin scroll) ─────────────────────────────
// Diseñada para entrar en una pantalla sin scroll: huecos contenidos y reparto
// elástico (justify-content: space-between) para que el contenido respire en
// pantallas altas y se compacte con gracia en las bajas. El padding vertical
// usa clamp para ceder espacio en móviles pequeños.
export default function HomeScreen({ onNavigate }) {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "space-between", textAlign: "center",
        flex: 1, minHeight: 0,
        gap: "clamp(0.75rem, 2.5vh, 1.5rem)",
        padding: "clamp(1rem, 3vh, 2rem) 1.5rem",
      }}
    >
      {/* Bloque superior: insignia de mando + título + descripción */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(0.75rem, 2vh, 1.25rem)" }}>
        <div
          style={{
            width: "clamp(64px, 16vw, 84px)", height: "clamp(64px, 16vw, 84px)",
            borderRadius: "22px",
            background: hexA(S.morado, 0.08),
            border: `1px solid ${hexA(S.morado, 0.3)}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 40px -10px ${hexA(S.morado, 0.5)}`, flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="46" height="46" fill={S.azul} style={{ filter: `drop-shadow(0 0 10px ${hexA(S.azul, 0.6)})`, width: "55%", height: "55%" }}>
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
          </svg>
        </div>

        <h1>
          <Logo size={28} />
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.55, maxWidth: "300px" }}>
          Conjuga verbos en español <strong style={{ color: S.azul, fontWeight: 600 }}>con tu voz</strong>. Gana puntos, sube de nivel y desbloquea verbos y tiempos.
        </p>
      </div>

      {/* Bloque central: pasos + botones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.75rem, 2vh, 1.25rem)", width: "100%", maxWidth: "300px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Step n="1" color={S.fuxia} text="Ajusta los verbos y tiempos a practicar" />
          <Step n="2" color={S.azul} text="Juega conjugando en voz alta" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <button
            className="btn"
            onClick={() => onNavigate("jugar")}
            style={{
              fontFamily: FONT.arcade, fontSize: "14px", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff",
              background: GRADIENT_PRIMARY, padding: "15px", borderRadius: "14px",
              border: "none", cursor: "pointer", boxShadow: `0 0 24px -6px ${hexA(S.fuxia, 0.8)}`,
            }}
          >
            ▶ Empezar
          </button>
          <button
            className="btn"
            onClick={() => onNavigate("ajustes")}
            style={{
              fontFamily: FONT.arcade, fontSize: "12px", fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)",
              background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
              padding: "13px", borderRadius: "14px", cursor: "pointer",
            }}
          >
            Configurar
          </button>
        </div>
      </div>

      {/* Firma SILABOS al pie */}
      <Seal />
    </div>
  );
}

function Step({ n, color, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", textAlign: "left" }}>
      <span
        style={{
          flexShrink: 0, width: "26px", height: "26px", borderRadius: "8px",
          background: hexA(color, 0.12), border: `1px solid ${hexA(color, 0.4)}`,
          color, fontFamily: FONT.arcade, fontWeight: 700, fontSize: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {n}
      </span>
      <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.65)" }}>{text}</span>
    </div>
  );
}
