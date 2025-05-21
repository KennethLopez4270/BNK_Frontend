import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const ClientesApp = () => import('clientes/AppClientes')

const HomePrestamos = () => import('prestamos/HomePrestamos')
const CrearPrestamo = () => import('prestamos/CrearPrestamo')
const ActualizarPrestamo = () => import('prestamos/ActualizarPrestamo')
const EliminarPrestamo = () => import('prestamos/EliminarPrestamo')
const ObtenerPrestamos = () => import('prestamos/ObtenerPrestamos')
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('../views/Home.vue') },

  { path: '/prestamos', component: HomePrestamos },
  { path: '/prestamos/crear', component: CrearPrestamo },
  { path: '/prestamos/actualizar', component: ActualizarPrestamo },
  { path: '/prestamos/eliminar', component: EliminarPrestamo },
  { path: '/prestamos/obtener', component: ObtenerPrestamos },

  { path: '/clientes/:subpath(.*)*', component: ClientesApp },
  { path: '/clientes', component: ClientesApp }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
