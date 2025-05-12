//index.js

import { createRouter, createWebHistory } from 'vue-router'
import HomeFrt1 from '../views/HomeFrt1.vue'

const routes = [
  { path: '/', name: 'HomeFrt1', component: HomeFrt1 }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// eslint-disable-next-line no-irregular-whitespace
export default router