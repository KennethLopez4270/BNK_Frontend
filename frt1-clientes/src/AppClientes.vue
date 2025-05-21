<!-- src/AppClientes.vue -->
<template>
  <div ref="mountPoint"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createApp } from 'vue'
import App from './App.vue' // debe contener <router-view />
import router from './router'

const mountPoint = ref(null)

onMounted(() => {
  const app = createApp(App)
  app.use(router)
  app.mount(mountPoint.value)
})
</script>
