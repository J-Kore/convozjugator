import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SettingsProvider } from "./hooks/useSettings.jsx";
import "./styles/global.css";

// Punto de entrada: monta la app en #root (definido en index.html).
// SettingsProvider envuelve la app para compartir la configuración del
// estudiante (voz, verbos y tiempos) entre pantallas.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </StrictMode>
);
