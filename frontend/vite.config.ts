import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', 'axios'], // Add axios here
  },
  server: {
    proxy: {
      '/media': {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/media/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      external: ['axios'], // Explicitly mark axios as external
    },
  },
});