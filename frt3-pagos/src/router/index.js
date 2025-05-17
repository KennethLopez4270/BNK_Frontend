import { createRouter, createWebHistory } from 'vue-router'
import HomePagos from '../views/HomePagos.vue'

const routes = [
  { path: '/', name: 'HomePagos', component: HomePagos }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router