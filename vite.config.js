import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 불필요한 alias 삭제
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // ❌ 아래는 제거!
      // stream: false,
      // crypto: false,
      // buffer: false,
    },
  },
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['stream', 'readable-stream', 'buffer', 'crypto'], // ⚠️ polyfill 제거용 exclude만 유지
  }
})


