<template>
    <div class="actualizar-cuenta">
      <section class="hero">
        <h1 class="titulo">Actualizar Cuenta</h1>
        <p class="descripcion">
          Busca una cuenta, edítala y guarda los cambios
        </p>
      </section>
  
      <!-- Filtros -->
      <section class="filtros">
        <div class="filtros-container">
          <div class="filtros-grid">
            <input
              v-model="filtros.accountNumber"
              type="text"
              class="input-filtro"
              placeholder="N° de cuenta"
            />
            <input
              v-model="filtros.clientId"
              type="text"
              class="input-filtro"
              placeholder="ID de cliente"
            />
            <select v-model="filtros.accountType" class="select-filtro">
              <option value="">Tipo de cuenta</option>
              <option value="ahorro">Ahorro</option>
              <option value="corriente">Corriente</option>
            </select>
            <select v-model="filtros.status" class="select-filtro">
              <option value="">Estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </section>
  
      <!-- Mensaje de carga o error -->
      <div v-if="loading" class="cargando">Cargando cuentas...</div>
      <div v-if="error" class="error">{{ error }}</div>
  
      <!-- Tabla -->
      <section class="tabla-container" v-else>
        <div v-if="cuentasFiltradas.length" class="tabla-scroll">
          <table class="tabla-cuentas">
            <thead>
              <tr>
                <th>N° Cuenta</th>
                <th>ID Cliente</th>
                <th>Tipo</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cuenta in cuentasFiltradas" :key="cuenta.id">
                <td>{{ cuenta.accountNumber }}</td>
                <td>{{ cuenta.clientId }}</td>
                <td>{{ cuenta.accountType }}</td>
                <td>${{ cuenta.balance.toFixed(2) }}</td>
                <td>
                  <span :class="`estado ${cuenta.status}`">
                    {{ cuenta.status }}
                  </span>
                </td>
                <td class="acciones">
                  <button
                    class="btn-accion btn-pequeno"
                    @click="seleccionarCuenta(cuenta)"
                  >
                    <i class="bi bi-pencil"></i> Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div v-else class="sin-resultados">
          No hay cuentas que coincidan con los filtros.
        </div>
      </section>
  
      <!-- Formulario de edición -->
      <section v-if="cuentaSeleccionada" class="formulario-edicion">
        <div class="formulario-container">
          <h2 class="subtitulo">
            Editar Cuenta {{ cuentaSeleccionada.accountNumber }}
          </h2>
  
          <form @submit.prevent="guardarCambios" class="form-editar">
            <div class="form-columnas">
              <div class="form-grupo">
                <label>Tipo de Cuenta</label>
                <select v-model="cuentaSeleccionada.accountType" class="input-field">
                  <option value="ahorro">Ahorro</option>
                  <option value="corriente">Corriente</option>
                </select>
              </div>
  
              <div class="form-grupo">
                <label>Saldo</label>
                <input
                  type="number"
                  v-model="cuentaSeleccionada.balance"
                  min="0"
                  step="0.01"
                  class="input-field"
                />
              </div>
            </div>
  
            <div class="form-grupo">
              <label>Estado</label>
              <select v-model="cuentaSeleccionada.status" class="input-field">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
  
            <div class="botones-form">
              <button type="submit" class="btn-accion btn-guardar" :disabled="loading">
                <i class="bi bi-check-circle"></i> {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
              <button
                type="button"
                @click="confirmarEliminacion"
                class="btn-accion btn-eliminar"
                :disabled="loading"
              >
                <i class="bi bi-trash"></i> Eliminar Cuenta
              </button>
            </div>
          </form>
        </div>
      </section>
  
      <!-- Botón volver -->
      <div class="boton-volver">
        <button @click="volver" class="btn-accion btn-secundario">
          <i class="bi bi-arrow-left"></i> Volver
        </button>
      </div>
  
      <!-- Mensajes de confirmación -->
      <div v-if="mostrarModalExito" class="modal-overlay" @click="mostrarModalExito = false">
        <div class="modal-contenido modal-exito" @click.stop>
          <h3>Cambios guardados</h3>
          <p>La cuenta fue actualizada correctamente.</p>
          <button @click="mostrarModalExito = false" class="btn-accion">
            Aceptar
          </button>
        </div>
      </div>
  
      <div v-if="mostrarModalError" class="modal-overlay" @click="mostrarModalError = false">
        <div class="modal-contenido modal-error" @click.stop>
          <h3>Error</h3>
          <p>{{ errorMessage }}</p>
          <button @click="mostrarModalError = false" class="btn-accion">
            Aceptar
          </button>
        </div>
      </div>
  
      <div v-if="mostrarModalConfirmar" class="modal-overlay" @click="mostrarModalConfirmar = false">
        <div class="modal-contenido modal-advertencia" @click.stop>
          <h3>¿Eliminar cuenta?</h3>
          <p>
            ¿Deseas eliminar la cuenta <strong>{{ cuentaSeleccionada?.accountNumber }}</strong>?
            Esta acción es irreversible.
          </p>
          <div class="botones-modal">
            <button @click="mostrarModalConfirmar = false" class="btn-accion btn-cancelar">
              Cancelar
            </button>
            <button @click="eliminarCuenta" class="btn-accion btn-eliminar">
              Eliminar
            </button>
          </div>
        </div>
      </div>
  
      <footer class="footer">
        © 2025 Gestión Premium. Todos los derechos reservados.
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const cuentas = ref([]);
  const cuentaSeleccionada = ref(null);
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
  
  const volver = () => router.push('/accounts');
  </script>
  
  <style scoped>
  .actualizar-cuenta {
    font-family: 'Segoe UI', sans-serif;
    color: #fff;
    background: linear-gradient(to bottom, #122523, #000);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .hero {
    padding: 60px 20px 40px;
    text-align: center;
  }
  
  .titulo {
    font-size: 2.5rem;
    font-weight: 800;
    color: #3ded97;
    margin-bottom: 15px;
  }
  
  .descripcion {
    font-size: 1.2rem;
    color: #ccc;
  }
  
  .filtros {
    width: 100%;
    max-width: 1000px;
    margin-bottom: 30px;
  }
  
  .filtros-container {
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(61, 237, 151, 0.1);
  }
  
  .filtros-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .input-filtro,
  .select-filtro {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #3ded97;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 1rem;
  }
  
  .select-filtro {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233ded97'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 20px;
  }
  
  .tabla-container {
    width: 100%;
    max-width: 1000px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 0 20px rgba(61, 237, 151, 0.1);
  }
  
  .tabla-scroll {
    overflow-x: auto;
  }
  
  .tabla-cuentas {
    width: 100%;
    border-collapse: collapse;
  }
  
  .tabla-cuentas th,
  .tabla-cuentas td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  
  .tabla-cuentas th {
    color: #3ded97;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }
  
  .tabla-cuentas tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .estado {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .estado.activo {
    background-color: rgba(40, 167, 69, 0.2);
    color: #28a745;
  }
  
  .estado.inactivo {
    background-color: rgba(108, 117, 125, 0.2);
    color: #6c757d;
  }
  
  .acciones {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .sin-resultados {
    text-align: center;
    padding: 30px;
    color: #ccc;
    font-size: 1.1rem;
  }
  
  .cargando,
  .error {
    text-align: скорее всего, вы имели в виду "center";
    padding: 30px;
    color: #ccc;
    font-size: 1.1rem;
  }
  
  .error {
    color: #dc3545;
  }
  
  .formulario-edicion {
    width: 100%;
    max-width: 800px;
    margin-bottom: 30px;
  }
  
  .formulario-container {
    background: rgba(0, 0, 0, 0.7);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(61, 237, 151, 0.1);
  }
  
  .subtitulo {
    font-size: 1.8rem;
    color: #3ded97;
    margin-bottom: 30px;
    text-align: center;
  }
  
  .form-editar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-columnas {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .form-grupo {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-grupo label {
    color: #3ded97;
    font-weight: 600;
  }
  
  .input-field {
    padding: 12px 15px;
    border: 1px solid #3ded97;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 1rem;
    width: 100%;
  }
  
  .botones-form {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .boton-volver {
    margin-bottom: 30px;
  }
  
  .btn-accion {
    background-color: #24d26a;
    color: #fff;
    padding: 12px 25px;
    font-size: 1rem;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 0 10px #24d26a;
    transition: 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .btn-accion:hover {
    background-color: #1abc5c;
  }
  
  .btn-pequeno {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
  
  .btn-guardar {
    background-color: #28a745;
    box-shadow: 0 0 10px #28a745;
  }
  
  .btn-guardar:hover {
    background-color: #218838;
  }
  
  .btn-eliminar {
    background-color: #dc3545;
    box-shadow: 0 0 10px #dc3545;
  }
  
  .btn-eliminar:hover {
    background-color: #c82333;
  }
  
  .btn-secundario {
    background-color: #6c757d;
    box-shadow: 0 0 10px #6c757d;
  }
  
  .btn-secundario:hover {
    background-color: #5a6268;
  }
  
  .btn-cancelar {
    background-color: #6c757d;
    box-shadow: 0 0 10px #6c757d;
  }
  
  .btn-cancelar:hover {
    background-color: #5a6268;
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
  }
  
  .modal-contenido {
    background: linear-gradient(to bottom, #122523, #000);
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    border: 1px solid #3ded97;
    box-shadow: 0 0 30px rgba(61, 237, 151, 0.3);
    text-align: center;
  }
  
  .modal-exito {
    border-color: #28a745;
    box-shadow: 0 0 30px rgba(40, 167, 69, 0.3);
  }
  
  .modal-error {
    border-color: #dc3545;
    box-shadow: 0 0 30px rgba(220, 53, 69, 0.3);
  }
  
  .modal-advertencia {
    border-color: #ffc107;
    box-shadow: 0 0 30px rgba(255, 193, 7, 0.3);
  }
  
  .modal-contenido h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #3ded97;
  }
  
  .modal-contenido p {
    margin-bottom: 30px;
    color: #ccc;
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
    color: #888;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .form-columnas {
      grid-template-columns: 1fr;
    }
  
    .filtros-grid {
      grid-template-columns: 1fr;
    }
  
    .botones-form {
      flex-direction: column;
    }
  
    .botones-modal {
      flex-direction: column;
    }
  
    .tabla-cuentas th,
    .tabla-cuentas td {
      padding: 10px 5px;
      font-size: 0.9rem;
    }
  }
  </style>