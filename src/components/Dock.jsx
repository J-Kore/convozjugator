import { S, hexA, FONT } from "../styles/tokens";

// ─── DOCK DE NAVEGACIÓN (arcade) ──────────────────────────────────────────
// Barra inferior con las 4 secciones. El ítem activo se ilumina en su color
// de acento con glow. Etiquetas en Orbitron para el carácter de videojuego.

const ICONS = {
  inicio: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22 L9 12 L15 12 L15 22" />,
  jugar: <path d="M6 12h4 M8 10v4 M15 11h.01 M18 13h.01 M17.32 5H6.68a4 4 0 0 0-3.98 3.59c-.006.05-.01.1-.02.17C2.604 9.5 2 13.5 2 15a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.5-1.5h7l1.5 1.5c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.5-.604-5.5-.68-6.24-.01-.07-.013-.12-.02-.17A4 4 0 0 0 17.32 5z" />,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  ajustes: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
};

const ITEMS = [
  { id: "inicio", label: "Inicio", color: S.fuxia },
  { id: "jugar", label: "Jugar", color: S.morado },
  { id: "chat", label: "Chat", color: S.azul },
  { id: "ajustes", label: "Ajustes", color: S.amarillo },
];

export default function Dock({ active, onNavigate }) {
  return (
    <nav
      style={{
        flexShrink: 0,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "0.6rem 0.5rem",
        paddingBottom: "calc(0.6rem + env(safe-area-inset-bottom))",
        background: hexA(S.bg, 0.78),
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        borderTop: `1px solid ${hexA(S.morado, 0.22)}`,
        position: "relative",
        zIndex: 10,
      }}
    >
      {ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 10px",
              color: isActive ? item.color : "rgba(255,255,255,0.7)",
              transform: isActive ? "translateY(-2px)" : "none",
              transition: "color 0.2s ease, transform 0.2s ease",
            }}
          >
            <svg
              width={25}
              height={25}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: isActive ? `drop-shadow(0 0 6px ${hexA(item.color, 0.8)})` : "none" }}
            >
              {ICONS[item.id]}
            </svg>
            <span
              style={{
                fontFamily: FONT.arcade,
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
