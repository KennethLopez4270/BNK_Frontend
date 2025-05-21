<template>
  <div class="actualizar-cuenta">
    <button @click="volver" class="back-button animate__animated animate__fadeIn">
      <i class="bi bi-arrow-left"></i> Volver
    </button>
    
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Actualizar Cuenta</h1>
      <p class="descripcion">
        Busca una cuenta, edítala y guarda los cambios
      </p>
    </section>

    <!-- Filtros -->
    <section class="filtros animate__animated animate__fadeIn" style="animation-delay: 0.1s">
      <div class="filtros-container">
        <div class="filtros-grid">
          <div class="input-group animate__animated animate__fadeIn" style="animation-delay: 0.2s">
            <span class="input-group-text"><i class="bi bi-credit-card"></i></span>
            <input
              v-model="filtros.accountNumber"
              type="text"
              class="form-control"
              placeholder="N° de cuenta"
            />
          </div>
          
          <div class="input-group animate__animated animate__fadeIn" style="animation-delay: 0.3s">
            <span class="input-group-text"><i class="bi bi-person-badge"></i></span>
            <input
              v-model="filtros.clientId"
              type="text"
              class="form-control"
              placeholder="ID de cliente"
            />
          </div>
          
          <div class="input-group animate__animated animate__fadeIn" style="animation-delay: 0.4s">
            <span class="input-group-text"><i class="bi bi-wallet2"></i></span>
            <select v-model="filtros.accountType" class="form-control">
              <option value="">Tipo de cuenta</option>
              <option value="ahorro">Ahorro</option>
              <option value="corriente">Corriente</option>
            </select>
          </div>
          
          <div class="input-group animate__animated animate__fadeIn" style="animation-delay: 0.5s">
            <span class="input-group-text"><i class="bi bi-power"></i></span>
            <select v-model="filtros.status" class="form-control">
              <option value="">Estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Mensaje de carga o error -->
    <div v-if="loading" class="cargando animate__animated animate__fadeIn">
      <div class="spinner"></div>
      Cargando cuentas...
    </div>
    <div v-if="error" class="error animate__animated animate__shakeX">
      <i class="bi bi-exclamation-triangle"></i> {{ error }}
    </div>

    <!-- Tabla -->
    <section class="tabla-container animate__animated animate__fadeIn" style="animation-delay: 0.6s" v-else>
      <div v-if="cuentasFiltradas.length" class="tabla-scroll">
        <table class="tabla-cuentas">
          <thead>
            <tr>
              <th @click="ordenarPor('accountNumber')">
                <span>N° Cuenta <i class="bi bi-arrow-down-up"></i></span>
              </th>
              <th @click="ordenarPor('clientId')">
                <span>ID Cliente <i class="bi bi-arrow-down-up"></i></span>
              </th>
              <th @click="ordenarPor('accountType')">
                <span>Tipo <i class="bi bi-arrow-down-up"></i></span>
              </th>
              <th @click="ordenarPor('balance')">
                <span>Saldo <i class="bi bi-arrow-down-up"></i></span>
              </th>
              <th @click="ordenarPor('status')">
                <span>Estado <i class="bi bi-arrow-down-up"></i></span>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="cuenta in cuentasFiltradas" 
              :key="cuenta.id"
              class="animate__animated animate__fadeIn"
              :style="`animation-delay: ${0.05 * cuentasFiltradas.indexOf(cuenta)}s`"
            >
              <td>{{ cuenta.accountNumber }}</td>
              <td>{{ cuenta.clientId }}</td>
              <td>{{ cuenta.accountType === 'ahorro' ? 'Ahorro' : 'Corriente' }}</td>
              <td>${{ cuenta.balance.toFixed(2) }}</td>
              <td>
                <span :class="`estado ${cuenta.status}`">
                  {{ cuenta.status === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="acciones">
                <button
                  class="btn-accion btn-editar"
                  @click="seleccionarCuenta(cuenta)"
                >
                  <i class="bi bi-pencil"></i> Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="sin-resultados animate__animated animate__fadeIn">
        <i class="bi bi-search"></i>
        <p>No hay cuentas que coincidan con los filtros.</p>
      </div>
    </section>

    <!-- Formulario de edición -->
    <section v-if="cuentaSeleccionada" class="formulario-edicion animate__animated animate__fadeInUp">
      <div class="formulario-container">
        <h2 class="subtitulo">
          <i class="bi bi-pencil-square"></i> Editar Cuenta {{ cuentaSeleccionada.accountNumber }}
        </h2>

        <form @submit.prevent="guardarCambios" class="form-editar">
          <div class="form-columnas">
            <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.1s">
              <label class="form-label"><i class="bi bi-wallet2"></i> Tipo de Cuenta</label>
              <div class="input-group">
                <select v-model="cuentaSeleccionada.accountType" class="form-control">
                  <option value="ahorro">Ahorro</option>
                  <option value="corriente">Corriente</option>
                </select>
              </div>
            </div>

            <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.2s">
              <label class="form-label"><i class="bi bi-cash-coin"></i> Saldo</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input
                  type="number"
                  v-model="cuentaSeleccionada.balance"
                  min="0"
                  step="0.01"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.3s">
            <label class="form-label"><i class="bi bi-power"></i> Estado</label>
            <div class="input-group">
              <select v-model="cuentaSeleccionada.status" class="form-control">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="botones-form animate__animated animate__fadeIn" style="animation-delay: 0.4s">
            <button type="submit" class="btn-guardar" :disabled="loading">
              <i class="bi bi-check-circle"></i> {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button
              type="button"
              @click="confirmarEliminacion"
              class="btn-eliminar"
              :disabled="loading"
            >
              <i class="bi bi-trash"></i> Eliminar Cuenta
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Modales -->
    <div v-if="mostrarModalExito" class="modal-overlay" @click="mostrarModalExito = false">
      <div class="modal-contenido modal-exito animate__animated animate__zoomIn" @click.stop>
        <div class="modal-icono-exito">
          <i class="bi bi-check-circle"></i>
        </div>
        <h3>¡Actualización exitosa!</h3>
        <p>La cuenta fue actualizada correctamente.</p>
        <button @click="mostrarModalExito = false" class="btn-accion">
          Aceptar
        </button>
      </div>
    </div>

    <div v-if="mostrarModalError" class="modal-overlay" @click="mostrarModalError = false">
      <div class="modal-contenido modal-error animate__animated animate__zoomIn" @click.stop>
        <div class="modal-icono-error">
          <i class="bi bi-x-circle"></i>
        </div>
        <h3>Error</h3>
        <p>{{ errorMessage }}</p>
        <button @click="mostrarModalError = false" class="btn-accion">
          Aceptar
        </button>
      </div>
    </div>

    <div v-if="mostrarModalConfirmar" class="modal-overlay" @click="mostrarModalConfirmar = false">
      <div class="modal-contenido modal-advertencia animate__animated animate__zoomIn" @click.stop>
        <div class="modal-icono-advertencia">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3>¿Eliminar cuenta?</h3>
        <p>
          ¿Deseas eliminar la cuenta <strong>{{ cuentaSeleccionada?.accountNumber }}</strong>?
          Esta acción es irreversible.
        </p>
        <div class="botones-modal">
          <button @click="mostrarModalConfirmar = false" class="btn-secundario">
            Cancelar
          </button>
          <button @click="eliminarCuenta" class="btn-eliminar">
            <i class="bi bi-trash"></i> Confirmar
          </button>
        </div>
      </div>
    </div>

    <footer class="footer animate__animated animate__fadeIn">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import 'animate.css';

const router = useRouter();

const cuentas = ref([]);
const cuentaSeleccionada = ref(null);
const orden = ref({ campo: 'accountNumber', direccion: 'asc' });
const filtros = ref({
  accountNumber: '',
  clientId: '',
  accountType: '',
  status: '',
});
const mostrarModalExito = ref(false);
const mostrarModalError = ref(false);
const mostrarModalConfirmar = ref(false);
const loading = ref(false);
const error = ref(null);
const errorMessage = ref('Ocurrió un error al guardar los cambios.');

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
        'Origin': 'http://localhost:5173',
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

const ordenarPor = (campo) => {
  if (orden.value.campo === campo) {
    orden.value.direccion = orden.value.direccion === 'asc' ? 'desc' : 'asc';
  } else {
    orden.value.campo = campo;
    orden.value.direccion = 'asc';
  }
};

const cuentasFiltradas = computed(() => {
  let resultado = cuentas.value.filter((c) => {
    return (
      (!filtros.value.accountNumber || c.accountNumber.includes(filtros.value.accountNumber)) &&
      (!filtros.value.clientId || c.clientId.toString().includes(filtros.value.clientId)) &&
      (!filtros.value.accountType || c.accountType === filtros.value.accountType) &&
      (!filtros.value.status || c.status === filtros.value.status)
    );
  });

  // Ordenar
  if (orden.value.campo) {
    resultado.sort((a, b) => {
      if (a[orden.value.campo] < b[orden.value.campo]) {
        return orden.value.direccion === 'asc' ? -1 : 1;
      }
      if (a[orden.value.campo] > b[orden.value.campo]) {
        return orden.value.direccion === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  return resultado;
});

const seleccionarCuenta = (cuenta) => {
  cuentaSeleccionada.value = { ...cuenta };
};

const guardarCambios = async () => {
  try {
    loading.value = true;
    error.value = null;
    const payload = {
      clientId: cuentaSeleccionada.value.clientId,
      accountNumber: cuentaSeleccionada.value.accountNumber,
      accountType: cuentaSeleccionada.value.accountType,
      balance: parseFloat(cuentaSeleccionada.value.balance) || 0,
      status: cuentaSeleccionada.value.status,
    };

    const response = await fetch(`http://localhost:8082/api/accounts/${cuentaSeleccionada.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const updatedCuenta = await response.json();
    const index = cuentas.value.findIndex((c) => c.id === cuentaSeleccionada.value.id);
    if (index !== -1) {
      cuentas.value[index] = updatedCuenta;
    }

    mostrarModalExito.value = true;
    cuentaSeleccionada.value = null;
  } catch (err) {
    errorMessage.value =
      err.message.includes('400')
        ? 'Datos inválidos. Verifica los campos e intenta nuevamente.'
        : err.message || 'Error al guardar los cambios.';
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
  }
};

const confirmarEliminacion = () => {
  mostrarModalConfirmar.value = true;
};

const eliminarCuenta = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await fetch(`http://localhost:8082/api/accounts/${cuentaSeleccionada.value.id}`, {
      method: 'DELETE',
      headers: {
        'Origin': 'http://localhost:5173',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    cuentas.value = cuentas.value.filter((c) => c.id !== cuentaSeleccionada.value.id);
    cuentaSeleccionada.value = null;
    mostrarModalConfirmar.value = false;
    mostrarModalExito.value = true;
  } catch (err) {
    errorMessage.value = 'Error al eliminar la cuenta: ' + err.message;
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
  }
};

const volver = () => router.push('/');
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.actualizar-cuenta {
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
  z-index: 10;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-3px);
}

.hero {
  padding: 80px 20px 50px;
  text-align: center;
  position: relative;
  width: 100%;
  max-width: 1200px;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3ded97, transparent);
}

.titulo {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #3ded97, #2fa8f8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(61, 237, 151, 0.3);
  letter-spacing: 1px;
}

.descripcion {
  font-size: 1.2rem;
  color: #a0a8c0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.filtros {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 30px;
}

.filtros-container {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 20px;
  border: 1px solid rgba(61, 237, 151, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid rgba(61, 237, 151, 0.2);
}

.input-group:hover {
  border-color: rgba(61, 237, 151, 0.4);
}

.input-group-text {
  padding: 0 15px;
  background: rgba(61, 237, 151, 0.2);
  color: #3ded97;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.form-control {
  flex: 1;
  height: 50px;
  padding: 0 15px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.3);
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233ded97'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 20px;
}

.tabla-container {
  width: 100%;
  max-width: 1200px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.tabla-scroll {
  overflow-x: auto;
  border-radius: 15px;
}

.tabla-cuentas {
  width: 100%;
  border-collapse: collapse;
}

.tabla-cuentas th,
.tabla-cuentas td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tabla-cuentas th {
  color: #3ded97;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all 0.3s;
}

.tabla-cuentas th:hover {
  background: rgba(61, 237, 151, 0.1);
}

.tabla-cuentas th span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tabla-cuentas tbody tr {
  transition: all 0.3s;
}

.tabla-cuentas tbody tr:hover {
  background-color: rgba(61, 237, 151, 0.05);
  transform: translateX(5px);
}

.estado {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.estado.activo {
  background: rgba(61, 237, 151, 0.2);
  color: #3ded97;
}

.estado.inactivo {
  background: rgba(108, 117, 125, 0.2);
  color: #a0a8c0;
}

.acciones {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.sin-resultados {
  text-align: center;
  padding: 50px;
  color: #a0a8c0;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.sin-resultados i {
  font-size: 2rem;
  color: #3ded97;
  opacity: 0.7;
}

.cargando,
.error {
  text-align: center;
  padding: 30px;
  color: #a0a8c0;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.error {
  color: #ff4d4d;
}

.error i {
  font-size: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(61, 237, 151, 0.3);
  border-radius: 50%;
  border-top-color: #3ded97;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.formulario-edicion {
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
}

.formulario-container {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(61, 237, 151, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.subtitulo {
  font-size: 1.8rem;
  color: #3ded97;
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.form-editar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.form-grupo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 1.1rem;
  color: #fff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.botones-form {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-accion, .btn-secundario, .btn-guardar, .btn-eliminar, .btn-editar {
  padding: 12px 25px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2a9d8f);
  color: #fff;
  box-shadow: 0 4px 15px rgba(61, 237, 151, 0.3);
}

.btn-accion:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(61, 237, 151, 0.4);
}

.btn-accion:disabled {
  background: #6b7280;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-secundario {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secundario:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.btn-guardar {
  background: linear-gradient(135deg, #3ded97, #2a9d8f);
  color: #fff;
  box-shadow: 0 4px 15px rgba(61, 237, 151, 0.3);
}

.btn-guardar:hover {
  background: linear-gradient(135deg, #2dcc7f, #1e8c6e);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(61, 237, 151, 0.4);
}

.btn-eliminar {
  background: linear-gradient(135deg, #ff4d4d, #f72585);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3);
}

.btn-eliminar:hover {
  background: linear-gradient(135deg, #e04444, #d5176e);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 77, 77, 0.4);
}

.btn-editar {
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: #fff;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
}

.btn-editar:hover {
  background: linear-gradient(135deg, #3a56d4, #2f0a8a);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-contenido {
  background: rgba(15, 23, 42, 0.95);
  padding: 40px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-exito {
  border: 1px solid rgba(61, 237, 151, 0.5);
}

.modal-error {
  border: 1px solid rgba(244, 63, 94, 0.5);
}

.modal-advertencia {
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.modal-icono-exito,
.modal-icono-error,
.modal-icono-advertencia {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.modal-icono-exito {
  background: linear-gradient(135deg, rgba(61, 237, 151, 0.2), transparent);
  color: #3ded97;
}

.modal-icono-error {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.2), transparent);
  color: #f43f5e;
}

.modal-icono-advertencia {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), transparent);
  color: #ffc107;
}

.modal-contenido h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #fff;
}

.modal-contenido p {
  margin-bottom: 30px;
  color: #a0a8c0;
  font-size: 1.1rem;
}

.modal-contenido strong {
  color: #ff4d4d;
}

.botones-modal {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.footer {
  margin-top: auto;
  padding: 30px 0;
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  position: relative;
  width: 100%;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(61, 237, 151, 0.5), transparent);
}

@media (max-width: 992px) {
  .filtros-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .form-columnas {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .filtros-grid {
    grid-template-columns: 1fr;
  }

  .botones-form,
  .botones-modal {
    flex-direction: column;
  }

  .tabla-cuentas th,
  .tabla-cuentas td {
    padding: 12px 8px;
    font-size: 0.9rem;
  }

  .hero {
    padding: 60px 20px 40px;
  }

  .titulo {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .back-button {
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    font-size: 0.9rem;
  }

  .modal-contenido {
    padding: 30px 20px;
  }

  .btn-accion, .btn-secundario, .btn-guardar, .btn-eliminar, .btn-editar {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>
