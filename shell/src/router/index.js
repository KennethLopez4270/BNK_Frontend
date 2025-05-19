import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const ClientesApp = defineAsyncComponent(() => import('clientes/HomeClientes'))
const PrestamosApp = () => import('prestamos/HomePrestamos')

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('../views/Home.vue') },
  { path: '/clientes', component: ClientesApp },
  { path: '/prestamos', component: PrestamosApp },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
