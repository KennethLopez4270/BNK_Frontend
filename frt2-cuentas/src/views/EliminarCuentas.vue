<template>
    <div class="container py-5 animate__animated animate__fadeIn">
      <div class="text-center mb-4">
        <h2 class="text-danger fw-bold animate__animated animate__fadeInDown">Eliminar Cuenta</h2>
        <p class="text-muted">Filtra y selecciona una cuenta para eliminar</p>
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
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cuenta in cuentasFiltradas" :key="cuenta.id">
              <td>{{ cuenta.accountNumber }}</td>
              <td>{{ cuenta.clientId }}</td>
              <td>{{ cuenta.accountType }}</td>
              <td>${{ cuenta.balance.toFixed(2) }}</td>
              <td>
                <span :class="cuenta.status === 'activo' ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ cuenta.status }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmar(cuenta)"
                  :disabled="loading"
                >
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
              ¿Deseas eliminar la cuenta <strong>{{ cuentaSeleccionada?.accountNumber }}</strong>?
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-danger" @click="eliminarCuenta" :disabled="loading">
                {{ loading ? 'Eliminando...' : 'Eliminar' }}
              </button>
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
            <div class="modal-body">{{ errorMessage }}</div>
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
  const modalConfirmar = ref(null);
  const modalExito = ref(null);
  const modalError = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const errorMessage = ref('No se pudo eliminar la cuenta. Intenta más tarde.');
  
  onMounted(() => {
    fetchCuentas();
  });
  
  const fetchCuentas = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch('http://localhost:8082/api/accounts', {
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
  
  const confirmar = (cuenta) => {
    cuentaSeleccionada.value = cuenta;
    new Modal(modalConfirmar.value).show();
  };
  
  const eliminarCuenta = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`http://localhost:8080/api/accounts/${cuentaSeleccionada.value.id}`, {
        method: 'DELETE',
        headers: {
          'Origin': 'http://localhost:5173',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
  
      cuentas.value = cuentas.value.filter((c) => c.id !== cuentaSeleccionada.value.id);
      Modal.getInstance(modalConfirmar.value).hide();
      new Modal(modalExito.value).show();
      cuentaSeleccionada.value = null;
    } catch (err) {
      errorMessage.value =
        err.message.includes('400')
          ? 'Datos inválidos. Verifica e intenta nuevamente.'
          : err.message || 'No se pudo eliminar la cuenta. Intenta más tarde.';
      Modal.getInstance(modalConfirmar.value).hide();
      new Modal(modalError.value).show();
    } finally {
      loading.value = false;
    }
  };
  
  const volver = () => router.push('/accounts');
  </script>
  
  <style scoped>
  @import 'animate.css';
  @import 'bootstrap-icons/font/bootstrap-icons.css';
  </style>