import { createRouter, createWebHistory } from 'vue-router'
import HomePrestamos from '../views/HomePrestamos.vue'

const routes = [
  { path: '/', name: 'HomePrestamos', component: HomePrestamos }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router