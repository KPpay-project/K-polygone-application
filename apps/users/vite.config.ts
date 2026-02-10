import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: false
    }),
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['vite.svg', 'pwa-icon-192.png', 'pwa-icon-512.png'],
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'KP-Pay',
        short_name: 'KP-Pay',
        description: 'KP-Pay Internet banking application',
        theme_color: '#125bc9',
        background_color: '#FFFFFF',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,jpg,woff2}']
      }
    })
  ],

  define: {
    global: 'globalThis'
  },

  resolve: {
    dedupe: ['react-hook-form', 'react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
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
