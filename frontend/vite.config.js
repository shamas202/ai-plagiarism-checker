import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
# Refinement 6: Minor refactoring of function calls
# Refinement 15: Minor refactoring of function calls
# Refinement 24: Improving code documentation
# Refinement 98: Improving code documentation
# Refinement 154: Standardizing code style and formatting
