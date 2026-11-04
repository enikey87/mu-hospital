import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  // GitHub Pages использует путь репозитория, разработка — корень.
  base: mode === "production" ? "/mu-hospital/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
  },
}));
