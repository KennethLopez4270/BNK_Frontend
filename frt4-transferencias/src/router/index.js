import { createRouter, createWebHistory } from 'vue-router'
import HomeTransferencias from '../views/HomeTransferencias.vue'

const routes = [
  { path: '/', name: 'HomeTransferencias', component: HomeTransferencias }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router