// ─── TOKENS DE DISEÑO · ConVozJugator (identidad ARCADE) ──────────────────
// Hereda de SILABOS la paleta neón y el espíritu, pero con carácter propio
// de videojuego: tipografía arcade (Orbitron) + rejilla synthwave.

export const S = {
  bg: "#0A0A12",       // fondo casi negro
  bgPanel: "#0D0D1A",  // paneles / "carcasa" del teléfono
  bgSoft: "rgba(255,255,255,0.04)", // superficies translúcidas (inputs, tarjetas)
  fuxia: "#FF2DA6",
  morado: "#A855F7",
  azul: "#00C8FF",
  amarillo: "#FACC15",
  verde: "#39FF14",    // acierto / micrófono
  rojo: "#FF3B6B",     // error / micrófono escuchando
};

// Tipografía: Orbitron (display arcade) para marcador/títulos/verbo,
// DM Sans (heredada de SILABOS) para texto de lectura e inputs.
export const FONT = {
  arcade: "'Orbitron', sans-serif",
  body: "'DM Sans', sans-serif",
};

// hex (#RRGGBB) → rgba con alpha. Para resplandores y superficies translúcidas.
export function hexA(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Gradiente primario de marca (botón de acción principal).
export const GRADIENT_PRIMARY = `linear-gradient(135deg, ${S.fuxia}, ${S.morado})`;

// Rejilla synthwave de fondo. Se aplica como backgroundImage en el contenedor.
export const GRID_BG = {
  backgroundImage: `
    linear-gradient(${hexA(S.morado, 0.05)} 1px, transparent 1px),
    linear-gradient(90deg, ${hexA(S.morado, 0.05)} 1px, transparent 1px)
  `,
  backgroundSize: "40px 40px",
};
