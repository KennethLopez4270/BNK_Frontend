import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Funcionario from '../views/Funcionario.vue'
import Cliente from '../views/Cliente.vue'
import LoginFuncionario from '../views/LoginFuncionario.vue'
import LoginCliente from '../views/LoginCliente.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/funcionario', name: 'Funcionario', component: Funcionario },
  { path: '/cliente', name: 'Cliente', component: Cliente },
  { path: '/login-funcionario', name: 'LoginFuncionario', component: LoginFuncionario },
  { path: '/login-cliente', name: 'LoginCliente', component: LoginCliente }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router