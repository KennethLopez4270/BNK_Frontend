<template>
  <div class="obtener-cuentas">
    <section class="hero">
      <h1 class="titulo">Obtener Cuentas</h1>
      <p class="descripcion">
        Filtra y selecciona una cuenta para verla a detalle
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
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="cuenta in cuentasFiltradas" 
              :key="cuenta.id"
              @click="abrirDetalleCuenta(cuenta)"
              class="fila-seleccionable"
            >
              <td>{{ cuenta.accountNumber }}</td>
              <td>{{ cuenta.clientId }}</td>
              <td>{{ cuenta.accountType }}</td>
              <td>${{ cuenta.balance.toFixed(2) }}</td>
              <td>
                <span :class="`estado ${cuenta.status}`">
                  {{ cuenta.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="sin-resultados">
        No hay cuentas que coincidan con los filtros.
      </div>
    </section>

    <!-- Botón volver -->
    <div class="boton-volver">
      <button @click="volver" class="btn-accion btn-secundario" :disabled="loading">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
    </div>

    <!-- Modal Detalle -->
    <div v-if="mostrarModalDetalle" class="modal-overlay" @click="mostrarModalDetalle = false">
      <div class="modal-contenido modal-info" @click.stop>
        <h3>Detalle de la cuenta</h3>
        
        <div class="detalle-cuenta" v-if="cuentaSeleccionada">
          <div class="detalle-item">
            <span class="detalle-etiqueta">Número de cuenta:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.accountNumber }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-etiqueta">ID Cliente:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.clientId }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-etiqueta">Tipo de cuenta:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.accountType }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-etiqueta">Saldo:</span>
            <span class="detalle-valor">${{ cuentaSeleccionada.balance.toFixed(2) }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-etiqueta">Estado:</span>
            <span :class="`estado ${cuentaSeleccionada.status}`">
              {{ cuentaSeleccionada.status }}
            </span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-etiqueta">Último Depósito:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.lastDeposit || 'No disponible' }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-etiqueta">Fecha de Creación:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.creationDate || 'No disponible' }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-etiqueta">Última Extracción:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.lastWithdrawal || 'No disponible' }}</span>
          </div>
        </div>

        <button @click="mostrarModalDetalle = false" class="btn-accion">
          Cerrar
        </button>
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
const mostrarModalDetalle = ref(false);
const loading = ref(false);
const error = ref(null);

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
  mostrarModalDetalle.value = true;
};

const volver = () => router.push('/');
</script>

<style scoped>
.obtener-cuentas {
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
  user-select: none;
}

.fila-seleccionable {
  cursor: pointer;
  transition: background-color 0.3s;
}

.fila-seleccionable:hover {
  background-color: rgba(61, 237, 151, 0.1);
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

.sin-resultados {
  text-align: center;
  padding: 30px;
  color: #ccc;
  font-size: 1.1rem;
}

.cargando {
  text-align: center;
  padding: 30px;
  color: #ccc;
  font-size: 1.1rem;
}

.error {
  text-align: center;
  padding: 30px;
  color: #ff4d4d;
  font-size: 1.1rem;
}

.boton-volver {
  margin-bottom: 30px;
}

.btn-accion {
  background-color: #3ded97;
  color: #fff;
  padding: 12px 25px;
  font-size: 1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 0 10px #3ded97;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-accion:hover {
  background-color: #24d26a;
}

.btn-secundario {
  background-color: #6c757d;
  box-shadow: 0 0 10px #6c757d;
}

.btn-secundario:hover {
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

.modal-info {
  border-color: #17a2b8;
  box-shadow: 0 0 30px rgba(23, 162, 184, 0.3);
}

.modal-contenido h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #3ded97;
}

.detalle-cuenta {
  text-align: left;
  margin-bottom: 30px;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #333;
}

.detalle-etiqueta {
  color: #3ded97;
  font-weight: 600;
}

.detalle-valor {
  color: #fff;
}

.footer {
  margin-top: auto;
  padding: 30px 0;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
}

@media (max-width: 768px) {
  .filtros-grid {
    grid-template-columns: 1fr;
  }
  
  .detalle-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .tabla-cuentas th,
  .tabla-cuentas td {
    padding: 10px 5px;
    font-size: 0.9rem;
  }
}
</style>