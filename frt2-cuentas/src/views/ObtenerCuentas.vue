<template>
    <div class="container py-5 animate__animated animate__fadeIn">
      <div class="text-center mb-4">
        <h2 class="text-success fw-bold animate__animated animate__fadeInDown">Obtener cuentas</h2>
        <p class="text-muted">Filtra y selecciona una cuenta para verla a detalle</p>
      </div>
  
      <!-- Botón volver -->
      <div class="text-center mt-4">
        <button class="btn btn-secondary" @click="volver">
          <i class="bi bi-arrow-left me-1"></i>Volver
        </button>
      </div>
  
      <!-- Filtros -->
      <div class="card shadow-sm mb-4 p-3 border-0">
        <div class="row g-3">
          <div class="col-md-4">
            <input v-model="filtros.numeroCuenta" type="text" class="form-control" placeholder="Buscar por N° de cuenta" />
          </div>
          <div class="col-md-4">
            <input v-model="filtros.idCliente" type="text" class="form-control" placeholder="Buscar por ID de cliente" />
          </div>
          <div class="col-md-2">
            <select v-model="filtros.tipoCuenta" class="form-select">
              <option value="">Tipo</option>
              <option value="ahorro">Ahorro</option>
              <option value="corriente">Corriente</option>
            </select>
          </div>
          <div class="col-md-2">
            <select v-model="filtros.estado" class="form-select">
              <option value="">Estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Tabla -->
      <div v-if="cuentasFiltradas.length" class="table-responsive animate__animated animate__fadeInUp">
        <table class="table table-bordered table-hover align-middle shadow-sm">
          <thead class="table-light">
            <tr>
              <th>N° Cuenta</th>
              <th>ID Cliente</th>
              <th>Tipo</th>
              <th>Saldo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cuenta in cuentasFiltradas" :key="cuenta.account_number" @click="abrirDetalleCuenta(cuenta)" style="cursor:pointer">
              <td>{{ cuenta.account_number }}</td>
              <td>{{ cuenta.client_id }}</td>
              <td>{{ cuenta.account_type }}</td>
              <td>${{ cuenta.balance.toFixed(2) }}</td>
              <td>
                <span :class="cuenta.status === 'activo' ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ cuenta.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-else class="text-center text-muted animate__animated animate__fadeInUp">
        <p>No se encontraron cuentas con los filtros aplicados.</p>
      </div>
  
      <!-- Modal Detalle -->
      <div class="modal fade" id="modalDetalle" tabindex="-1" ref="modalDetalle">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-info">
            <div class="modal-header bg-info text-white">
              <h5 class="modal-title">Detalle de la cuenta</h5>
              <button class="btn-close btn-close-white" data-bs-dismiss="modal" />
            </div>
            <div class="modal-body" v-if="cuentaSeleccionada">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <strong>Número de cuenta:</strong> {{ cuentaSeleccionada.account_number }}
                </li>
                <li class="list-group-item">
                  <strong>ID Cliente:</strong> {{ cuentaSeleccionada.client_id }}
                </li>
                <li class="list-group-item">
                  <strong>Tipo de cuenta:</strong> {{ cuentaSeleccionada.account_type }}
                </li>
                <li class="list-group-item">
                  <strong>Saldo:</strong> ${{ cuentaSeleccionada.balance.toFixed(2) }}
                </li>
                <li class="list-group-item">
                  <strong>Estado:</strong> 
                  <span :class="cuentaSeleccionada.status === 'activo' ? 'badge bg-success' : 'badge bg-secondary'">
                    {{ cuentaSeleccionada.status }}
                  </span>
                </li>
                <li class="list-group-item">
                  <strong>Último Depósito:</strong> {{ cuentaSeleccionada.last_deposit || 'No disponible' }}
                </li>
                <li class="list-group-item">
                  <strong>Fecha de Creación:</strong> {{ cuentaSeleccionada.creation_date }}
                </li>
                <li class="list-group-item">
                  <strong>Última Extracción:</strong> {{ cuentaSeleccionada.last_withdrawal || 'No disponible' }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Modal } from 'bootstrap'
  
  const router = useRouter()
  
  const cuentas = ref([])
  const cuentaSeleccionada = ref(null)
  const filtros = ref({
    numeroCuenta: '',
    idCliente: '',
    tipoCuenta: '',
    estado: ''
  })
  
  const modalDetalle = ref(null)
  let modalDetalleInstancia = null
  
  onMounted(() => {
    cuentas.value = [
      { client_id: 1, account_number: '000123', account_type: 'ahorro', balance: 1500, status: 'activo', 
        last_deposit: '2025-05-01', creation_date: '2023-01-15', last_withdrawal: '2025-04-30' },
      { client_id: 2, account_number: '000456', account_type: 'corriente', balance: 230, status: 'inactivo', 
        last_deposit: '2025-03-25', creation_date: '2022-08-10', last_withdrawal: '2025-04-05' },
      { client_id: 3, account_number: '000789', account_type: 'ahorro', balance: 985, status: 'activo', 
        last_deposit: '2025-04-15', creation_date: '2022-09-20', last_withdrawal: '2025-04-18' }
    ]
  
    // Inicializa el modal detalle
    modalDetalleInstancia = new Modal(modalDetalle.value)
  })
  
  const cuentasFiltradas = computed(() => {
    return cuentas.value.filter(c => {
      return (
        (!filtros.value.numeroCuenta || c.account_number.includes(filtros.value.numeroCuenta)) &&
        (!filtros.value.idCliente || c.client_id.toString().includes(filtros.value.idCliente)) &&
        (!filtros.value.tipoCuenta || c.account_type === filtros.value.tipoCuenta) &&
        (!filtros.value.estado || c.status === filtros.value.estado)
      )
    })
  })
  
  const abrirDetalleCuenta = (cuenta) => {
    cuentaSeleccionada.value = cuenta
    modalDetalleInstancia.show()
  }
  
  const volver = () => router.push('/')
  </script>
  
  <style scoped>
  @import 'animate.css';
  
  .modal-body ul {
    padding-left: 0;
  }
  </style>
  