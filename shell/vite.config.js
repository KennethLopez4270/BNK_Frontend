import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})

federation({
  remotes: {
    prestamos: 'http://localhost:5177/assets/remoteEntry.js',
  }
})
