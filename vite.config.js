import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 👈 allows external/local network access
    port: 3000,       // 👈 optional for local only
  },
  build: {
    outDir: 'dist',   // 👈 this is the default Vercel expects
  },
})
