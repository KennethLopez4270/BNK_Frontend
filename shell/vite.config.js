import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      remotes: {
        clientes: 'http://localhost:5173/assets/remoteEntry.js',
        prestamos: 'http://localhost:5177/assets/remoteEntry.js',
      },
      shared: ['vue']
    })
  ],
  server: {
    port: 5178
  }
})
