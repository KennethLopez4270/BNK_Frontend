import { createRouter, createWebHistory } from 'vue-router'
import TransferenciasHome from '../views/TransferenciasHome.vue'
import DetalleTransferencia from '../views/DetalleTransferencia.vue'
import HistorialTransferencias from '../views/HistorialTransferencias.vue'
import TransferirAOtroBanco from '../views/TransferirAOtroBanco.vue'
import TransferirATerceros from '../views/TransferirATerceros.vue'
import TransferirPropias from '../views/TransferirPropias.vue'
import ComprobanteTransferencia from '../views/ComprobanteTransferencia.vue'

const routes = [
  { path: '/', name: 'HomeTransferencias', component: TransferenciasHome },
  { path: '/detalle-transferencia/:id', name: 'DetalleTransferencia', component:DetalleTransferencia },
  { path: '/historial-transferencias', name: 'HistorialTransferencias', component:HistorialTransferencias},
  { path: '/transferir-otro-banco', name: 'TransferirAOtroBanco', component: TransferirAOtroBanco},
  { path: '/transferir-terceros', name: 'TransferirATerceros', component: TransferirATerceros},
  { path: '/transferir-propias', name: 'TransferirPropias', component:TransferirPropias},
  { path: '/comprobante-transferencia/:id', name: 'ComprobanteTransferencia', component: ComprobanteTransferencia}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router