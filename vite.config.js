import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 4173, // Puerto para desarrollo
  },
  preview: {
    port: process.env.PORT || 4173, // Puerto para producción
  },
  base: '/', // Asegura que las rutas sean relativas
  build: {
    outDir: 'dist'
  }
});
