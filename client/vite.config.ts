import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/Amazon_Equipo_1/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
