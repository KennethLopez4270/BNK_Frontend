// frt1-clientes/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'clientes',
      filename: 'remoteEntry.js',
      exposes: {
        './AppClientes': './src/AppClientes.vue'
      },
      shared: ['vue']
    })
  ],
  build: {
    target: 'esnext'
  },
  server: {
    port: 5173
  },
  optimizeDeps: {
    exclude: ['vue']
  }
})
