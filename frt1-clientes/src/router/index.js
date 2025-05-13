import { createRouter, createWebHistory } from 'vue-router'
import HomeClientes from '../views/HomeClientes.vue'
import CrearCliente from '../views/CrearCliente.vue'
import EliminarCliente from '../views/EliminarCliente.vue'
import ActualizarCliente from '../views/ActualizarCliente.vue'
import ObtenerClientes from '../views/ObtenerClientes.vue'

const routes = [
  { path: '/', name: 'HomeClientes', component: HomeClientes },
  { path: '/crear-cliente', name: 'CrearCliente', component: CrearCliente },
  { path: '/eliminar-cliente', name: 'EliminarCliente', component: EliminarCliente },
  { path: '/actualizar-cliente', name: 'ActualizarCliente', component: ActualizarCliente },
  { path: '/obtener-clientes', name: 'ObtenerClientes', component: ObtenerClientes },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
