import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Sin base: la app se sirve en la raíz de su propio Vercel.
// El ruteo a /convozjugator/ lo hace el vercel.json de SILABOS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
