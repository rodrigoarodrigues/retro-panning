import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // necessário para Docker
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_WORKER_URL ?? 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
