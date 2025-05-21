// src/bootstrap.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // tu router de Clientes

export function mount(el) {
  const app = createApp(App)
  app.use(router)
  app.mount(el)
}
