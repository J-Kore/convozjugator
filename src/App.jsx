import { useState } from "react";
import Dock from "./components/Dock";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { S, GRID_BG } from "./styles/tokens";

// ─── COMPONENTE RAÍZ ──────────────────────────────────────────────────────
// App tipo móvil: rejilla synthwave de fondo (estática, ligera) + zona de
// pantalla con scroll propio + dock inferior. Navegación por estado local.
//
// FASE 1 (arcade): andamiaje navegable. La lógica de cada pantalla llega
// en sus fases. Se sustituyó el campo estelar por la rejilla synthwave:
// mismo aire neón, mucho más ligera en móvil y con carácter de videojuego.
export default function App() {
  const [screen, setScreen] = useState("inicio");

  const SCREENS = {
    inicio: <HomeScreen onNavigate={setScreen} />,
    jugar: <GameScreen />,
    chat: <ChatScreen />,
    ajustes: <SettingsScreen />,
  };

  // Inicio y Juego están pensadas para entrar sin scroll: su contenido es
  // acotado. Chat y Ajustes crecen (mensajes, lista de verbos) y llevan scroll.
  const SIN_SCROLL = screen === "inicio" || screen === "jugar";

  return (
    <div
      style={{
        position: "relative", height: "100%",
        display: "flex", flexDirection: "column",
        background: S.bg,
        ...GRID_BG, // rejilla synthwave de fondo
      }}
    >
      {/* Línea de neón superior (carácter arcade) */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, ${S.fuxia}, ${S.morado}, ${S.azul})`, flexShrink: 0 }} />

      {/* En pantallas sin scroll, el contenido ocupa el alto exacto y se reparte
          de forma elástica. overflow 'auto' queda como salvaguarda para móviles
          muy pequeños: solo aparece scroll si el contenido de verdad no cabe. */}
      <main style={{ flex: 1, overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: SIN_SCROLL ? 0 : "min-content" }}>
          {SCREENS[screen]}
        </div>
      </main>

      <Dock active={screen} onNavigate={setScreen} />
    </div>
  );
}
