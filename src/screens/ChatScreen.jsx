import { S, FONT, GRADIENT_PRIMARY, hexA } from "../styles/tokens";

// ─── PANTALLA DE CHAT (arcade · Fase 1: maqueta) ──────────────────────────
// La integración con IA (Gemini ahora, Claude después) llega en la Fase 4.
export default function ChatScreen() {
  return (
    <div className="animate-fade-in" style={{ padding: "1.5rem 1.25rem 2rem", display: "flex", flexDirection: "column", gap: "1rem", minHeight: "100%" }}>
      <h2 style={{ fontFamily: FONT.arcade, fontSize: "1.15rem", fontWeight: 700, textAlign: "center", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        Asistente <span style={{ color: S.azul }}>✦</span>
      </h2>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflowY: "auto" }}>
        <Bubble from="ai">¡Hola! Soy tu asistente de conjugación. ¿En qué puedo ayudarte hoy?</Bubble>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          disabled
          placeholder="Escribe tu mensaje… (Fase 4)"
          style={{ flex: 1, background: S.bgSoft, border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "12px 16px", fontSize: "15px", color: "#fff", fontFamily: FONT.body, outline: "none" }}
        />
        <button
          disabled
          aria-label="Enviar"
          style={{ width: "46px", height: "46px", borderRadius: "50%", flexShrink: 0, background: GRADIENT_PRIMARY, border: "none", color: "#fff", cursor: "not-allowed", opacity: 0.5, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px -4px ${hexA(S.fuxia, 0.8)}` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Bubble({ from, children }) {
  const isAI = from === "ai";
  return (
    <div
      style={{
        maxWidth: "82%", alignSelf: isAI ? "flex-start" : "flex-end",
        padding: "0.7rem 1rem", borderRadius: "1.25rem",
        borderBottomLeftRadius: isAI ? "0.4rem" : "1.25rem",
        borderBottomRightRadius: isAI ? "1.25rem" : "0.4rem",
        fontSize: "14px", lineHeight: 1.5, color: "#fff", fontFamily: FONT.body,
        background: isAI ? "rgba(255,255,255,0.07)" : GRADIENT_PRIMARY,
        border: isAI ? "1px solid rgba(255,255,255,0.1)" : "none",
      }}
    >
      {children}
    </div>
  );
}
