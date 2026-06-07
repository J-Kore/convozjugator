import { FONT } from "../styles/tokens";

// ─── FIRMA SILABOS ────────────────────────────────────────────────────────
// El logo completo de SILABOS (SVG animado: constelación + palabra + tagline)
// como firma al pie de Inicio. Encabezado con "Un proyecto de", para dejar
// claro el orden: el producto manda arriba, la marca matriz firma abajo.
//
// El SVG está en /public y se referencia con <img>: la animación CSS interna
// se reproduce sola al cargar, escala nítido y no infla el JSX.
export default function Seal() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        paddingBottom: "0.25rem",
      }}
    >
      <span
        style={{
          fontFamily: FONT.body,
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Un proyecto de
      </span>
      <img
        src="/silabos-logo.svg"
        alt="SILABOS — Pedagogía · IA · ELE"
        style={{ width: "clamp(130px, 38vw, 150px)", height: "auto", display: "block" }}
      />
    </div>
  );
}
