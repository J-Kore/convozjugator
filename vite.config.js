import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite para React.
// `command` vale "serve" en desarrollo (npm run dev) y "build" al compilar.
// Aplicamos la subruta SOLO al compilar para producción, para que la app se
// sirva bien desde silabos.es/convozjugator/ sin romper las rutas de archivos.
// En desarrollo local, la base sigue siendo "/" (cómodo: localhost:5173/).
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/convozjugator/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // abre el navegador automáticamente al arrancar
  },
}));
