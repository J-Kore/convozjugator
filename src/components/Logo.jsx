import { FONT, S } from "../styles/tokens";

// ─── LOGOTIPO ConVozJugator ───────────────────────────────────────────────
// Nombre del juego en Orbitron, con "Voz" destacado en cyan (es lo que hace
// especial a la app: jugar con la voz). Carácter arcade, no el logo SILABOS.
export default function Logo({ size = 22 }) {
  return (
    <span
      style={{
        fontFamily: FONT.arcade,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "0.02em",
        lineHeight: 1,
        color: "#fff",
      }}
    >
      Con<span className="logo-shift" style={{ color: S.azul }}>Voz</span>jugator
    </span>
  );
}
