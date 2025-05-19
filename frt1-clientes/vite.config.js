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
        './PrestamosApp': './src/views/HomePrestamos.vue' // o cambiar este según se necesite
      },
      shared: ['vue']
    })
  ],
  build: {
    target: 'esnext'
  },
  server: {
    port: 5173
  }
})
