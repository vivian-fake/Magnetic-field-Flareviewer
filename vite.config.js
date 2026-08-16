import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api gets forwarded to localhost:5000
      '/browse': {
        target:       'https://sdo.gsfc.nasa.gov/assets/img',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ”) // Remove /api prefix if backend doesn’t use it
      },
      // You can add multiple proxy rules for different services
      '/FLR?': {
        target:       'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get',
        changeOrigin: true,
      }
    }
  }
});