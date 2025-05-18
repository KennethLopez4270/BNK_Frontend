import { createRouter, createWebHistory } from 'vue-router'
import HomePrestamos from '../views/HomePrestamos.vue'
import CrearPrestamo from '../views/CrearPrestamo.vue'
import ActualizarPrestamo from '../views/ActualizarPrestamo.vue'

const routes = [
  { path: '/', name: 'HomePrestamos', component: HomePrestamos },
  { path: '/crear-prestamo', name: 'CrearPrestamo', component: CrearPrestamo },
  { path: '/actualizar-prestamo', name: 'ActualizarPrestamo', component: ActualizarPrestamo },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router