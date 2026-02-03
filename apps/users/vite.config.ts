import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: false
    }),
    react()
  ],

  define: {
    global: 'globalThis'
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'k-polygon-assets/components': path.resolve(__dirname, './assets/dist/components/index.js'),
      'k-polygon-assets/icons': path.resolve(__dirname, './assets/dist/icons/index.js'),
      'k-polygon-assets/utils': path.resolve(__dirname, './assets/dist/utils/index.js'),
      'k-polygon-assets': path.resolve(__dirname, './assets/dist/index.js')
    }
  },

  optimizeDeps: {
    include: ['k-polygon-assets', 'k-polygon-assets/components', 'k-polygon-assets/icons', 'k-polygon-assets/utils']
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('k-polygon-assets')) {
            return 'k-polygon-assets';
          }
        }
      }
    }
  }
});
