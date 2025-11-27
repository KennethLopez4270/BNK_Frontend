<template>
  <div class="prestamos-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Consulta de Préstamos</h1>
      <p class="descripcion">Visualiza y filtra todos los préstamos del sistema</p>
    </section>

    <section class="filtros-container animate__animated animate__fadeInUp">
      <div class="filtros">
        <div class="input-group">
          <i class="bi bi-search icono-input"></i>
          <input
            v-model="filtroCliente"
            type="text"
            class="input-busqueda"
            placeholder="Buscar por ID de cliente"
          />
        </div>
      </div>
    </section>

    <div v-if="loading" class="cargando">
      <i class="bi bi-arrow-repeat"></i> Cargando préstamos...
    </div>
    
    <div v-if="error" class="mensaje error">
      <i class="bi bi-exclamation-triangle"></i> {{ error }}
    </div>

    <!-- QUITAR el v-else -->
    <section class="tabla-container animate__animated animate__fadeInUp">
      <div v-if="prestamosFiltrados.length" class="tabla-scroll">
        <table class="tabla-prestamos">
          <thead>
            <tr>
              <th 
                v-for="columna in columnas" 
                :key="columna.campo" 
                @click="ordenarPor(columna.campo)"
                class="sortable-header"
              >
                <div class="header-content">
                  <span>{{ columna.titulo }}</span>
                  <i class="bi" :class="{
                    'bi-arrow-up': campoOrden === columna.campo && orden === 'asc',
                    'bi-arrow-down': campoOrden === columna.campo && orden === 'desc'
                  }"></i>
                </div>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prestamo in prestamosFiltrados" :key="prestamo.id">
              <td>{{ prestamo.id }}</td>
              <td>{{ prestamo.clientId }}</td>
              <td>{{ formatCurrency(prestamo.loanAmount) }}</td>
              <td>{{ prestamo.interestRate }}%</td>
              <td>{{ prestamo.termMonths }} meses</td>
              <td>{{ formatCurrency(prestamo.monthlyPayment) }}</td>
              <td>
                <span :class="`estado ${prestamo.status.toLowerCase()}`">
                  <i :class="`bi ${getEstadoIcon(prestamo.status)}`"></i>
                  {{ formatEstado(prestamo.status) }}
                </span>
              </td>
              <td class="acciones">
                <button 
                  class="btn-accion btn-pequeno"
                  @click="verDetalles(prestamo)"
                >
                  <i class="bi bi-eye"></i> Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loading" class="sin-resultados">
        <i class="bi bi-exclamation-circle"></i> No se encontraron préstamos con los filtros aplicados
      </div>
    </section>

    <div class="boton-volver">
      <button @click="volver" class="btn-accion btn-secundario">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
    </div>

    <div v-if="mostrarModal" class="modal-overlay" @click="mostrarModal = false">
      <div class="modal-contenido" @click.stop>
        <h3>Detalles del Préstamo #{{ prestamoSeleccionado?.id }}</h3>
        
        <div class="detalles-prestamo" v-if="prestamoSeleccionado">
          <div class="detalle-item">
            <span class="detalle-etiqueta">Cliente ID:</span>
            <span class="detalle-valor">{{ prestamoSeleccionado.clientId }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Monto:</span>
            <span class="detalle-valor">{{ formatCurrency(prestamoSeleccionado.loanAmount) }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Tasa de interés:</span>
            <span class="detalle-valor">{{ prestamoSeleccionado.interestRate }}%</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Plazo:</span>
            <span class="detalle-valor">{{ prestamoSeleccionado.termMonths }} meses</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Cuota mensual:</span>
            <span class="detalle-valor">{{ formatCurrency(prestamoSeleccionado.monthlyPayment) }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Fecha inicio:</span>
            <span class="detalle-valor">{{ formatFecha(prestamoSeleccionado.startDate) }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Fecha fin:</span>
            <span class="detalle-valor">{{ formatFecha(prestamoSeleccionado.endDate) }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Estado:</span>
            <span :class="`estado ${prestamoSeleccionado.status.toLowerCase()}`">
              <i :class="`bi ${getEstadoIcon(prestamoSeleccionado.status)}`"></i>
              {{ formatEstado(prestamoSeleccionado.status) }}
            </span>
          </div>
        </div>

        <button @click="mostrarModal = false" class="btn-accion">
          <i class="bi bi-x-lg"></i> Cerrar
        </button>
      </div>
    </div>

    <footer class="footer animate__animated animate__fadeIn">
      © 2025 Banco Digital. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'animate.css'

const router = useRouter()
const API_BASE = 'http://localhost:8085/api'

// Columnas de la tabla (usando nombres camelCase del Swagger)
const columnas = [
  { titulo: 'ID Préstamo', campo: 'id' },
  { titulo: 'ID Cliente', campo: 'clientId' },
  { titulo: 'Monto', campo: 'loanAmount' },
  { titulo: 'Tasa %', campo: 'interestRate' },
  { titulo: 'Plazo', campo: 'termMonths' },
  { titulo: 'Cuota', campo: 'monthlyPayment' },
  { titulo: 'Estado', campo: 'status' }
]

// Datos reactivos
const prestamos = ref([])
const filtroCliente = ref('')
const loading = ref(false)
const error = ref(null)
const mostrarModal = ref(false)
const prestamoSeleccionado = ref(null)
const campoOrden = ref('id')
const orden = ref('asc')
const usandoDatosFicticios = ref(false)

// Datos de ejemplo más completos (en formato camelCase)
const datosEstaticos = [
  {
    id: 1,
    clientId: 101,
    loanAmount: 5000,
    interestRate: 5.5,
    termMonths: 12,
    monthlyPayment: 429.08,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: 'ACTIVO'
  },
  {
    id: 2,
    clientId: 102,
    loanAmount: 10000,
    interestRate: 7.0,
    termMonths: 24,
    monthlyPayment: 447.73,
    startDate: '2023-02-15',
    endDate: '2025-02-15',
    status: 'ACTIVO'
  },
  {
    id: 3,
    clientId: 103,
    loanAmount: 7500,
    interestRate: 6.2,
    termMonths: 18,
    monthlyPayment: 438.25,
    startDate: '2023-03-10',
    endDate: '2024-09-10',
    status: 'PENDIENTE'
  },
  {
    id: 4,
    clientId: 104,
    loanAmount: 15000,
    interestRate: 8.5,
    termMonths: 36,
    monthlyPayment: 473.82,
    startDate: '2023-01-20',
    endDate: '2025-12-20',
    status: 'ACTIVO'
  },
  {
    id: 5,
    clientId: 105,
    loanAmount: 3000,
    interestRate: 4.5,
    termMonths: 6,
    monthlyPayment: 507.51,
    startDate: '2023-04-05',
    endDate: '2023-10-05',
    status: 'PAGADO'
  },
  {
    id: 6,
    clientId: 106,
    loanAmount: 12000,
    interestRate: 9.0,
    termMonths: 48,
    monthlyPayment: 298.62,
    startDate: '2023-05-12',
    endDate: '2027-05-12',
    status: 'ACTIVO'
  },
  {
    id: 7,
    clientId: 107,
    loanAmount: 8000,
    interestRate: 5.8,
    termMonths: 12,
    monthlyPayment: 688.49,
    startDate: '2023-06-20',
    endDate: '2024-06-20',
    status: 'RECHAZADO'
  }
]

onMounted(() => {
  obtenerPrestamos()
})

const obtenerPrestamos = async () => {
  try {
    loading.value = true
    error.value = null
    usandoDatosFicticios.value = false
    
    const response = await fetch(`${API_BASE}/loans`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error al obtener préstamos: ${response.status}`)
    }

    const data = await response.json()
    prestamos.value = data
    
  } catch (err) {
    console.error('Error al conectar con el backend:', err)
    // Usar datos ficticios directamente
    prestamos.value = datosEstaticos
    usandoDatosFicticios.value = true
    error.value = 'No se pudo conectar al servidor. Mostrando datos de ejemplo.'
  } finally {
    loading.value = false
  }
}

const prestamosFiltrados = computed(() => {
  let resultados = [...prestamos.value]
  
  // Filtrar por ID de cliente
  if (filtroCliente.value) {
    resultados = resultados.filter(p => 
      p.clientId.toString().includes(filtroCliente.value)
    )
  }
  
  // Ordenar resultados
  if (campoOrden.value) {
    resultados.sort((a, b) => {
      const valorA = a[campoOrden.value]
      const valorB = b[campoOrden.value]
      
      if (valorA == null) return 1
      if (valorB == null) return -1
      
      if (typeof valorA === 'string') {
        return orden.value === 'asc' 
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA)
      } else {
        return orden.value === 'asc' 
          ? valorA - valorB
          : valorB - valorA
      }
    })
  }
  
  return resultados
})

const ordenarPor = (campo) => {
  if (campoOrden.value === campo) {
    orden.value = orden.value === 'asc' ? 'desc' : 'asc'
  } else {
    campoOrden.value = campo
    orden.value = 'asc'
  }
}

const verDetalles = (prestamo) => {
  prestamoSeleccionado.value = prestamo
  mostrarModal.value = true
}

const volver = () => router.push('/')

// Helpers para formato
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value || 0)
}

const formatFecha = (fecha) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const getEstadoIcon = (estado) => {
  const estadoLower = (estado || '').toLowerCase()
  const icons = {
    activo: 'bi-check-circle-fill',
    pendiente: 'bi-hourglass-split',
    rechazado: 'bi-x-circle-fill',
    pagado: 'bi-coin',
    vencido: 'bi-exclamation-triangle-fill'
  }
  return icons[estadoLower] || 'bi-question-circle-fill'
}

const formatEstado = (estado) => {
  const estadoLower = (estado || '').toLowerCase()
  const estados = {
    activo: 'Activo',
    pendiente: 'Pendiente',
    rechazado: 'Rechazado',
    pagado: 'Pagado',
    vencido: 'Vencido'
  }
  return estados[estadoLower] || estado
}
</script>


<style >
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.prestamos-app {
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-x: hidden;
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
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 800;
  background: linear-gradient(to right, #3ded97, #2fa8f8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(61, 237, 151, 0.3);
  letter-spacing: 1px;
}

.descripcion {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: #a0a8c0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.filtros-container {
  width: 100%;
  max-width: 1100px;
  margin-bottom: 30px;
}

.filtros {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.input-group {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.icono-input {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #3ded97;
  font-size: 1.2rem;
}

.input-busqueda {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-busqueda:focus {
  outline: none;
  border-color: #3ded97;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.2);
}

.tabla-container {
  width: 100%;
  max-width: 1100px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.05);
  margin-bottom: 40px;
}

.tabla-scroll {
  overflow-x: auto;
  border-radius: 10px;
}

.tabla-prestamos {
  width: 100%;
  border-collapse: collapse;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  overflow: hidden;
}

.tabla-prestamos th,
.tabla-prestamos td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid rgba(61, 237, 151, 0.1);
}

.tabla-prestamos th {
  color: #3ded97;
  font-weight: 600;
  background: rgba(15, 23, 42, 0.8);
}

.sortable-header {
  cursor: pointer;
  transition: background-color 0.3s;
}

.sortable-header:hover {
  background-color: rgba(61, 237, 151, 0.1) !important;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabla-prestamos tbody tr {
  transition: all 0.3s;
}

.tabla-prestamos tbody tr:hover {
  background-color: rgba(61, 237, 151, 0.05);
}

.estado {
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.estado.activo {
  background: rgba(61, 237, 151, 0.2);
  color: #3ded97;
}

.estado.pendiente {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.estado.rechazado {
  background: rgba(244, 63, 94, 0.2);
  color: #f43f5e;
}

.estado.pagado {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
}

.acciones {
  display: flex;
  justify-content: center;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2fa8f8);
  color: #fff;
  padding: 10px 20px;
  font-size: 0.95rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.3);
}

.btn-accion:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(61, 237, 151, 0.5);
}

.btn-pequeno {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.btn-secundario {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.btn-secundario:hover {
  background: rgba(255, 255, 255, 0.2);
}

.cargando,
.sin-resultados,
.mensaje {
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.cargando {
  color: #a0a8c0;
}

.sin-resultados {
  color: #a0a8c0;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.mensaje {
  background: rgba(61, 237, 151, 0.2);
  border: 1px solid rgba(61, 237, 151, 0.5);
}

.mensaje.error {
  background: rgba(244, 63, 94, 0.2);
  border: 1px solid rgba(244, 63, 94, 0.5);
  color: #f43f5e;
}

.boton-volver {
  margin-bottom: 30px;
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
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  box-shadow: 0 0 30px rgba(61, 237, 151, 0.3);
  text-align: center;
}

.modal-contenido h3 {
  font-size: 1.5rem;
  color: #3ded97;
  margin-bottom: 20px;
}

.detalles-prestamo {
  text-align: left;
  margin-bottom: 30px;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(61, 237, 151, 0.1);
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
  padding: 40px 0 30px;
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

@media (max-width: 768px) {
  .tabla-prestamos th,
  .tabla-prestamos td {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
  }
  
  .detalle-item {
    flex-direction: column;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .tabla-prestamos {
    display: block;
  }
  
  .tabla-prestamos thead {
    display: none;
  }
  
  .tabla-prestamos tbody tr {
    display: block;
    margin-bottom: 15px;
    border: 1px solid rgba(61, 237, 151, 0.2);
    border-radius: 8px;
    padding: 10px;
  }
  
  .tabla-prestamos tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border: none;
  }
  
  .tabla-prestamos tbody td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #3ded97;
    margin-right: 15px;
  }
  
  .sin-resultados,
  .mensaje {
    padding: 15px;
  }
}
</style>