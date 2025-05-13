<template>
    <div class="container py-5 animate__animated animate__fadeIn">
      <div class="text-center mb-4">
        <h2 class="text-success fw-bold animate__animated animate__fadeInDown">Obtener cuentas</h2>
        <p class="text-muted">Filtra y selecciona una cuenta para verla a detalle</p>
      </div>
  
      <!-- Botón volver -->
      <div class="text-center mt-4">
        <button class="btn btn-secondary" @click="volver" :disabled="loading">
          <i class="bi bi-arrow-left me-1"></i>Volver
        </button>
      </div>
  
      <!-- Filtros -->
      <div class="card shadow-sm mb-4 p-3 border-0">
        <div class="row g-3">
          <div class="col-md-4">
            <input
              v-model="filtros.accountNumber"
              type="text"
              class="form-control"
              placeholder="Buscar por N° de cuenta"
            />
          </div>
          <div class="col-md-4">
            <input
              v-model="filtros.clientId"
              type="text"
              class="form-control"
              placeholder="Buscar por ID de cliente"
            />
          </div>
          <div class="col-md-2">
            <select v-model="filtros.accountType" class="form-select">
              <option value="">Tipo</option>
              <option value="ahorro">Ahorro</option>
              <option value="corriente">Corriente</option>
            </select>
          </div>
          <div class="col-md-2">
            <select v-model="filtros.status" class="form-select">
              <option value="">Estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Mensaje de carga o error -->
      <div v-if="loading" class="text-center text-muted animate__animated animate__fadeInUp">
        <p>Cargando cuentas...</p>
      </div>
      <div v-if="error" class="text-center text-danger animate__animated animate__fadeInUp">
        <p>{{ error }}</p>
      </div>
  
      <!-- Tabla -->
      <div v-else-if="cuentasFiltradas.length" class="table-responsive animate__animated animate__fadeInUp">
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
            <tr
              v-for="cuenta in cuentasFiltradas"
              :key="cuenta.id"
              @click="abrirDetalleCuenta(cuenta)"
              style="cursor: pointer"
            >
              <td>{{ cuenta.accountNumber }}</td>
              <td>{{ cuenta.clientId }}</td>
              <td>{{ cuenta.accountType }}</td>
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
                  <strong>Número de cuenta:</strong> {{ cuentaSeleccionada.accountNumber }}
                </li>
                <li class="list-group-item">
                  <strong>ID Cliente:</strong> {{ cuentaSeleccionada.clientId }}
                </li>
                <li class="list-group-item">
                  <strong>Tipo de cuenta:</strong> {{ cuentaSeleccionada.accountType }}
                </li>
                <li class="list-group-item">
                  <strong>Saldo:</strong> ${{ cuentaSeleccionada.balance.toFixed(2) }}
                </li>
                <li class="list-group-item">
                  <strong>Estado:</strong>
                  <span
                    :class="cuentaSeleccionada.status === 'activo' ? 'badge bg-success' : 'badge bg-secondary'"
                  >
                    {{ cuentaSeleccionada.status }}
                  </span>
                </li>
                <li class="list-group-item">
                  <strong>Último Depósito:</strong> {{ cuentaSeleccionada.lastDeposit || 'No disponible' }}
                </li>
                <li class="list-group-item">
                  <strong>Fecha de Creación:</strong> {{ cuentaSeleccionada.creationDate || 'No disponible' }}
                </li>
                <li class="list-group-item">
                  <strong>Última Extracción:</strong> {{ cuentaSeleccionada.lastWithdrawal || 'No disponible' }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Modal } from 'bootstrap';
  
  const router = useRouter();
  
  const cuentas = ref([]);
  const cuentaSeleccionada = ref(null);
  const filtros = ref({
    accountNumber: '',
    clientId: '',
    accountType: '',
    status: '',
  });
  const modalDetalle = ref(null);
  const loading = ref(false);
  const error = ref(null);
  let modalDetalleInstancia = null;
  
  onMounted(() => {
    modalDetalleInstancia = new Modal(modalDetalle.value);
    fetchCuentas();
  });
  
  const fetchCuentas = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch('http://localhost:8080/api/accounts', {
        method: 'GET',
        headers: {
          'Origin': 'http://localhost:5173', // Ajusta al origen de tu frontend
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
  
      cuentas.value = await response.json();
    } catch (err) {
      error.value = 'Error al cargar las cuentas: ' + err.message;
    } finally {
      loading.value = false;
    }
  };
  
  const cuentasFiltradas = computed(() => {
    return cuentas.value.filter((c) => {
      return (
        (!filtros.value.accountNumber || c.accountNumber.includes(filtros.value.accountNumber)) &&
        (!filtros.value.clientId || c.clientId.toString().includes(filtros.value.clientId)) &&
        (!filtros.value.accountType || c.accountType === filtros.value.accountType) &&
        (!filtros.value.status || c.status === filtros.value.status)
      );
    });
  });
  
  const abrirDetalleCuenta = (cuenta) => {
    cuentaSeleccionada.value = cuenta;
    modalDetalleInstancia.show();
  };
  
  const volver = () => router.push('/accounts');
  </script>
  
  <style scoped>
  @import 'animate.css';
  @import 'bootstrap-icons/font/bootstrap-icons.css';
  
  .modal-body ul {
    padding-left: 0;
  }
  </style>