import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

//const ClientesApp = defineAsyncComponent(() => import('clientes/ClientesApp'))
const PrestamosApp = defineAsyncComponent(() => import('prestamos/PrestamosApp'))

const routes = [
  //{ path: '/clientes', component: ClientesApp },
  { path: '/prestamos', component: PrestamosApp }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
