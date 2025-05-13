<template>
    <div class="container py-5 animate__animated animate__fadeIn">
      <div class="text-center mb-4">
        <h2 class="text-danger fw-bold animate__animated animate__fadeInDown">Eliminar Cuenta</h2>
        <p class="text-muted">Filtra y selecciona una cuenta para eliminar</p>
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
            <input
              v-model="filtros.numeroCuenta"
              type="text"
              class="form-control"
              placeholder="Buscar por N° de cuenta"
            />
          </div>
          <div class="col-md-4">
            <input
              v-model="filtros.idCliente"
              type="text"
              class="form-control"
              placeholder="Buscar por ID de cliente"
            />
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
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cuenta in cuentasFiltradas" :key="cuenta.account_number">
              <td>{{ cuenta.account_number }}</td>
              <td>{{ cuenta.client_id }}</td>
              <td>{{ cuenta.account_type }}</td>
              <td>${{ cuenta.balance.toFixed(2) }}</td>
              <td>
                <span :class="cuenta.status === 'activo' ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ cuenta.status }}
                </span>
              </td>
              <td>
                <button class="btn btn-outline-danger btn-sm" @click="confirmar(cuenta)">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-else class="text-center text-muted animate__animated animate__fadeInUp">
        <p>No se encontraron cuentas con los filtros aplicados.</p>
      </div>
  
      <!-- Modales -->
      <div class="modal fade" id="modalConfirmar" tabindex="-1" ref="modalConfirmar">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-warning">
            <div class="modal-header bg-warning text-dark">
              <h5 class="modal-title">¿Eliminar cuenta?</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" />
            </div>
            <div class="modal-body">
              ¿Deseas eliminar la cuenta <strong>{{ cuentaSeleccionada?.account_number }}</strong>?
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-danger" @click="eliminarCuenta">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="modal fade" id="modalExito" tabindex="-1" ref="modalExito">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-success">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title">Cuenta eliminada</h5>
              <button class="btn-close btn-close-white" data-bs-dismiss="modal" />
            </div>
            <div class="modal-body">La cuenta fue eliminada correctamente.</div>
          </div>
        </div>
      </div>
  
      <div class="modal fade" id="modalError" tabindex="-1" ref="modalError">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-danger">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title">Error</h5>
              <button class="btn-close btn-close-white" data-bs-dismiss="modal" />
            </div>
            <div class="modal-body">No se pudo eliminar la cuenta. Intenta más tarde.</div>
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
  
  const modalConfirmar = ref(null)
  const modalExito = ref(null)
  const modalError = ref(null)
  
  onMounted(() => {
    cuentas.value = [
      { client_id: 1, account_number: '000123', account_type: 'ahorro', balance: 1500, status: 'activo' },
      { client_id: 2, account_number: '000456', account_type: 'corriente', balance: 230, status: 'inactivo' },
      { client_id: 3, account_number: '000789', account_type: 'ahorro', balance: 985, status: 'activo' }
    ]
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
  
  const confirmar = (cuenta) => {
    cuentaSeleccionada.value = cuenta
    new Modal(modalConfirmar.value).show()
  }
  
  const eliminarCuenta = () => {
    try {
      cuentas.value = cuentas.value.filter(
        c => c.account_number !== cuentaSeleccionada.value.account_number
      )
      Modal.getInstance(modalConfirmar.value).hide()
      new Modal(modalExito.value).show()
    } catch (e) {
      Modal.getInstance(modalConfirmar.value).hide()
      new Modal(modalError.value).show()
    }
  }
  
  const volver = () => router.push('/')
  </script>
  
  <style scoped>
  @import 'animate.css';
  </style>
  