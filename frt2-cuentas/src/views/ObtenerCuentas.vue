<template>
  <div class="obtener-cuentas-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Obtener Cuentas</h1>
      <p class="descripcion">
        Filtra y selecciona una cuenta para verla a detalle
      </p>
    </section>

    <!-- Filtros -->
    <section class="filtros animate__animated animate__fadeIn" style="animation-delay: 0.1s">
      <div class="filtros-container">
        <div class="filtros-grid">
          <div class="form-group">
            <label class="form-label"><i class="bi bi-credit-card"></i> N° de cuenta</label>
            <input
              v-model="filtros.accountNumber"
              type="text"
              class="form-control"
              placeholder="Ej: 1001-0001"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label"><i class="bi bi-person-badge"></i> ID de cliente</label>
            <input
              v-model="filtros.clientId"
              type="text"
              class="form-control"
              placeholder="Ej: 12345"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label"><i class="bi bi-wallet2"></i> Tipo de cuenta</label>
            <select v-model="filtros.accountType" class="form-control">
              <option value="">Todos los tipos</option>
              <option value="ahorro">Ahorro</option>
              <option value="corriente">Corriente</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label"><i class="bi bi-circle-fill"></i> Estado</label>
            <select v-model="filtros.status" class="form-control">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Mensaje de carga o error -->
    <div v-if="loading" class="cargando animate__animated animate__fadeIn">Cargando cuentas...</div>
    <div v-if="error" class="error animate__animated animate__fadeIn">{{ error }}</div>

    <!-- Tabla -->
    <section class="tabla-container animate__animated animate__fadeIn" style="animation-delay: 0.2s" v-else>
      <div v-if="cuentasFiltradas.length" class="tabla-scroll">
        <table class="tabla-cuentas">
          <thead>
            <tr>
              <th><i class="bi bi-credit-card"></i> N° Cuenta</th>
              <th><i class="bi bi-person-badge"></i> ID Cliente</th>
              <th><i class="bi bi-wallet2"></i> Tipo</th>
              <th><i class="bi bi-cash-stack"></i> Saldo</th>
              <th><i class="bi bi-circle-fill"></i> Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(cuenta, index) in cuentasFiltradas" 
              :key="cuenta.id"
              @click="abrirDetalleCuenta(cuenta)"
              class="fila-seleccionable animate__animated animate__fadeInUp"
              :style="`animation-delay: ${index * 0.05}s`"
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

      <div v-else class="sin-resultados animate__animated animate__fadeIn">
        No hay cuentas que coincidan con los filtros.
      </div>
    </section>

    <!-- Modal Detalle -->
    <div v-if="mostrarModalDetalle" class="modal-overlay" @click="mostrarModalDetalle = false">
      <div class="modal-contenido animate__animated animate__zoomIn" @click.stop>
        <h3 class="modal-titulo">
          <i class="bi bi-info-circle"></i> Detalle de la cuenta
        </h3>
        
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

        <div class="modal-footer">
          <button @click="mostrarModalDetalle = false" class="btn-accion">
            <i class="bi bi-x-circle"></i> Cerrar
          </button>
        </div>
      </div>
    </div>

    <footer class="footer animate__animated animate__fadeIn" style="animation-delay: 0.3s">
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.obtener-cuentas-app {
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
  padding: 60px 20px 40px;
  text-align: center;
  position: relative;
  width: 100%;
  max-width: 1000px;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 20px;
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
  max-width: 1000px;
  margin-bottom: 30px;
}

.filtros-container {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 1rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-control {
  width: 100%;
  height: 45px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(61, 237, 151, 0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #3ded97;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.3);
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233ded97'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
}

.tabla-container {
  width: 100%;
  max-width: 1000px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.tabla-scroll {
  overflow-x: auto;
}

.tabla-cuentas {
  width: 100%;
  border-collapse: collapse;
}

.tabla-cuentas th {
  padding: 15px;
  text-align: left;
  color: #3ded97;
  font-weight: 600;
  border-bottom: 2px solid rgba(61, 237, 151, 0.3);
  user-select: none;
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.9);
  z-index: 1;
}

.tabla-cuentas td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(61, 237, 151, 0.1);
}

.fila-seleccionable {
  cursor: pointer;
  transition: all 0.3s;
}

.fila-seleccionable:hover {
  background-color: rgba(61, 237, 151, 0.1);
}

.estado {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
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
  color: #a0a8c0;
  font-size: 1.1rem;
}

.cargando {
  text-align: center;
  padding: 30px;
  color: #a0a8c0;
  font-size: 1.1rem;
}

.error {
  text-align: center;
  padding: 30px;
  color: #ff6b6b;
  font-size: 1.1rem;
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
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  box-shadow: 0 0 30px rgba(61, 237, 151, 0.2);
}

.modal-titulo {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #3ded97;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.detalle-cuenta {
  text-align: left;
  margin-bottom: 30px;
  background: rgba(15, 23, 42, 0.5);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(61, 237, 151, 0.1);
}

.detalle-item:last-child {
  border-bottom: none;
}

.detalle-etiqueta {
  color: #3ded97;
  font-weight: 600;
}

.detalle-valor {
  color: #fff;
  text-align: right;
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2a9d8f);
  color: #fff;
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

.btn-accion:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(61, 237, 151, 0.4);
}

.footer {
  margin-top: 50px;
  padding: 20px 0;
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
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filtros-grid {
    grid-template-columns: 1fr;
  }
  
  .detalle-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .detalle-valor {
    text-align: left;
  }
  
  .tabla-cuentas th,
  .tabla-cuentas td {
    padding: 10px 5px;
    font-size: 0.9rem;
  }
  
  .hero {
    padding: 40px 20px 30px;
  }
  
  .titulo {
    font-size: 2rem;
  }
  
  .descripcion {
    font-size: 1rem;
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
    padding: 20px 15px;
  }
}
</style>
