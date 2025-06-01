// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true, // ✅ WebSocket 프록시만 살림
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // ❌ 불필요한 polyfill 제거
      stream: false,
      crypto: false,
      buffer: false,
    },
  },
  build: {
    sourcemap: true, // ✅ 디버깅을 위한 source map 유지
  },
  optimizeDeps: {
    exclude: ['stream', 'readable-stream', 'buffer', 'crypto'], // ❌ 문제 일으키는 것들 제거
  }
})

