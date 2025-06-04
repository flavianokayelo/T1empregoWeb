import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Caminho absoluto para carregar os assets corretamente
  plugins: [react()],
})
