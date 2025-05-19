// frt5-prestamos/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'prestamos',
      filename: 'remoteEntry.js',
      exposes: {
        './HomePrestamos': './src/views/HomePrestamos.vue', './PrestamosApp': './src/AppPrestamos.vue'
      },
      shared: ['vue']
    })
  ],
  build: {
    target: 'esnext'
  },
  server: {
    port: 5177,
    fs: {
    allow: ['.'] // asegura que vite sirva archivos fuera de src/
  }
  },
  optimizeDeps: {
    exclude: ['vue']
  }
})
// frt5-prestamos/vite.config.js
