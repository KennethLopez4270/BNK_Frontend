import { createRouter, createWebHistory } from 'vue-router'
import HomeCuentas from '../views/HomeCuentas.vue'
import CrearCuenta from '../views/CrearCuenta.vue'
import ActualizarCuenta from '../views/ActualizarCuenta.vue'
import EliminarCuentas from '../views/EliminarCuentas.vue'
import ObtenerCuentas from '../views/ObtenerCuentas.vue'
import Depositar from '../views/Depositar.vue'
import Extraer from '../views/Extraer.vue'

const routes = [
  { path: '/', name: 'HomeCuentas', component: HomeCuentas },
  { path: '/crear-cuenta', name: 'CrearCuenta', component: CrearCuenta },
  { path: '/actualizar-cuenta', name: 'ActualizarCuenta', component: ActualizarCuenta },
  { path: '/eliminar-cuentas', name: 'EliminarCuentas', component: EliminarCuentas },
  { path: '/obtener-cuentas', name: 'ObtenerCuentas', component: ObtenerCuentas },
  { path: '/depositar', name: 'Depositar', component: Depositar },
  { path: '/extraer', name: 'Extraer', component: Extraer }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
