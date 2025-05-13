<template>
  <div class="obtener-cuentas">
    <section class="hero">
      <h1 class="titulo">Obtener Cuentas</h1>
      <p class="descripcion">
        Filtra y selecciona una cuenta para verla a detalle
      </p>
    </section>

    <!-- Botón volver -->
    <div class="boton-volver">
      <button @click="volver" class="btn-accion btn-secundario">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
    </div>

    <!-- Filtros -->
    <section class="filtros">
      <div class="filtros-container">
        <div class="filtros-grid">
          <input
            v-model="filtros.numeroCuenta"
            type="text"
            class="input-filtro"
            placeholder="Buscar por N° de cuenta"
          />
          <input
            v-model="filtros.idCliente"
            type="text"
            class="input-filtro"
            placeholder="Buscar por ID de cliente"
          />
          <select v-model="filtros.tipoCuenta" class="select-filtro">
            <option value="">Tipo de cuenta</option>
            <option value="ahorro">Ahorro</option>
            <option value="corriente">Corriente</option>
          </select>
          <select v-model="filtros.estado" class="select-filtro">
            <option value="">Estado</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Tabla -->
    <section class="tabla-container">
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
              :key="cuenta.account_number" 
              @click="abrirDetalleCuenta(cuenta)"
              class="fila-cuenta"
            >
              <td>{{ cuenta.account_number }}</td>
              <td>{{ cuenta.client_id }}</td>
              <td>{{ cuenta.account_type }}</td>
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
        No se encontraron cuentas con los filtros aplicados.
      </div>
    </section>

    <!-- Modal Detalle -->
    <div v-if="mostrarModalDetalle" class="modal-overlay">
      <div class="modal-contenido modal-info">
        <div class="modal-header">
          <h3>Detalle de la cuenta</h3>
          <button @click="mostrarModalDetalle = false" class="btn-cerrar">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="cuentaSeleccionada">
          <div class="detalle-item">
            <span class="detalle-label">Número de cuenta:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.account_number }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-label">ID Cliente:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.client_id }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-label">Tipo de cuenta:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.account_type }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-label">Saldo:</span>
            <span class="detalle-valor">${{ cuentaSeleccionada.balance.toFixed(2) }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-label">Estado:</span>
            <span :class="`estado ${cuentaSeleccionada.status}`">
              {{ cuentaSeleccionada.status }}
            </span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-label">Último Depósito:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.last_deposit || 'No disponible' }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-label">Fecha de Creación:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.creation_date }}</span>
          </div>
          
          <div class="detalle-item">
            <span class="detalle-label">Última Extracción:</span>
            <span class="detalle-valor">{{ cuentaSeleccionada.last_withdrawal || 'No disponible' }}</span>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="mostrarModalDetalle = false" class="btn-accion">
            Cerrar
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cuentas = ref([])
const cuentaSeleccionada = ref(null)
const mostrarModalDetalle = ref(false)
const filtros = ref({
  numeroCuenta: '',
  idCliente: '',
  tipoCuenta: '',
  estado: ''
})

onMounted(() => {
  cuentas.value = [
    { 
      client_id: 1, 
      account_number: '000123', 
      account_type: 'ahorro', 
      balance: 1500, 
      status: 'activo',
      last_deposit: '2025-05-01', 
      creation_date: '2023-01-15', 
      last_withdrawal: '2025-04-30' 
    },
    { 
      client_id: 2, 
      account_number: '000456', 
      account_type: 'corriente', 
      balance: 230, 
      status: 'inactivo',
      last_deposit: '2025-03-25', 
      creation_date: '2022-08-10', 
      last_withdrawal: '2025-04-05' 
    },
    { 
      client_id: 3, 
      account_number: '000789', 
      account_type: 'ahorro', 
      balance: 985, 
      status: 'activo',
      last_deposit: '2025-04-15', 
      creation_date: '2022-09-20', 
      last_withdrawal: '2025-04-18' 
    }
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

const abrirDetalleCuenta = (cuenta) => {
  cuentaSeleccionada.value = cuenta
  mostrarModalDetalle.value = true
}

const volver = () => router.push('/')
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
  color: #28a745;
  margin-bottom: 15px;
}

.descripcion {
  font-size: 1.2rem;
  color: #ccc;
}

.boton-volver {
  margin-bottom: 30px;
  width: 100%;
  max-width: 1000px;
  text-align: left;
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

.input-filtro, .select-filtro {
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

.tabla-cuentas th, .tabla-cuentas td {
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

.fila-cuenta {
  cursor: pointer;
  transition: background-color 0.3s;
}

.fila-cuenta:hover {
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

.sin-resultados {
  text-align: center;
  padding: 30px;
  color: #ccc;
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
}

.modal-contenido {
  background: linear-gradient(to bottom, #122523, #000);
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  border: 1px solid #3ded97;
  box-shadow: 0 0 30px rgba(61, 237, 151, 0.3);
  overflow: hidden;
}

.modal-info {
  border-color: #17a2b8;
  box-shadow: 0 0 30px rgba(23, 162, 184, 0.3);
}

.modal-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.modal-header h3 {
  font-size: 1.5rem;
  color: #3ded97;
  margin: 0;
}

.btn-cerrar {
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
}

.btn-cerrar:hover {
  color: #fff;
}

.modal-body {
  padding: 20px;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detalle-item:last-child {
  border-bottom: none;
}

.detalle-label {
  color: #3ded97;
  font-weight: 600;
}

.detalle-valor {
  color: #fff;
}

.modal-footer {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #333;
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
}

.btn-accion:hover {
  background-color: #1abc5c;
}

.btn-secundario {
  background-color: #6c757d;
  box-shadow: 0 0 10px #6c757d;
}

.btn-secundario:hover {
  background-color: #5a6268;
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
  
  .tabla-cuentas th, 
  .tabla-cuentas td {
    padding: 10px 5px;
    font-size: 0.9rem;
  }
  
  .detalle-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .detalle-label,
  .detalle-valor {
    width: 100%;
  }
}
</style>