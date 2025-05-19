<template>
  <router-view />
</template>

<script setup>
import router from './router'
import { createApp } from 'vue'

const app = createApp({})
app.use(router)
</script>