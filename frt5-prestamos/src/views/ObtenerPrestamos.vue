<template>
  <div class="obtener-prestamos">
    <section class="hero">
      <h1 class="titulo">Consulta de Préstamos</h1>
      <p class="descripcion">Visualiza y filtra todos los préstamos del sistema</p>
    </section>

    <!-- Buscador -->
    <section class="filtros">
      <div class="filtros-container">
        <input
          v-model="filtroCliente"
          type="text"
          class="input-filtro"
          placeholder="Buscar por ID de cliente"
        />
      </div>
    </section>

    <!-- Mensajes de estado -->
    <div v-if="loading" class="cargando">Cargando préstamos...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Tabla de préstamos -->
    <section class="tabla-container" v-else>
      <div v-if="prestamosFiltrados.length" class="tabla-scroll">
        <table class="tabla-prestamos">
          <thead>
            <tr>
              <th @click="ordenarPor('id')">ID Préstamo <i :class="`bi bi-arrow-${orden.id}`"></i></th>
              <th @click="ordenarPor('client_id')">ID Cliente <i :class="`bi bi-arrow-${orden.client_id}`"></i></th>
              <th @click="ordenarPor('loan_amount')">Monto <i :class="`bi bi-arrow-${orden.loan_amount}`"></i></th>
              <th @click="ordenarPor('interest_rate')">Tasa % <i :class="`bi bi-arrow-${orden.interest_rate}`"></i></th>
              <th @click="ordenarPor('term_months')">Plazo <i :class="`bi bi-arrow-${orden.term_months}`"></i></th>
              <th @click="ordenarPor('monthly_payment')">Cuota <i :class="`bi bi-arrow-${orden.monthly_payment}`"></i></th>
              <th @click="ordenarPor('status')">Estado <i :class="`bi bi-arrow-${orden.status}`"></i></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prestamo in prestamosFiltrados" :key="prestamo.id">
              <td>{{ prestamo.id }}</td>
              <td>{{ prestamo.client_id }}</td>
              <td>${{ prestamo.loan_amount.toFixed(2) }}</td>
              <td>{{ prestamo.interest_rate }}%</td>
              <td>{{ prestamo.term_months }} meses</td>
              <td>${{ prestamo.monthly_payment.toFixed(2) }}</td>
              <td>
                <span :class="`estado ${prestamo.status}`">
                  {{ prestamo.status }}
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

      <div v-else class="sin-resultados">
        No se encontraron préstamos con los filtros aplicados.
      </div>
    </section>

    <!-- Botón volver -->
    <div class="boton-volver">
      <button @click="volver" class="btn-accion btn-secundario">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
    </div>

    <!-- Modal Detalles -->
    <div v-if="mostrarModal" class="modal-overlay" @click="mostrarModal = false">
      <div class="modal-contenido" @click.stop>
        <h3>Detalles del Préstamo #{{ prestamoSeleccionado?.id }}</h3>
        
        <div class="detalles-prestamo" v-if="prestamoSeleccionado">
          <div class="detalle-item">
            <span class="detalle-etiqueta">Cliente ID:</span>
            <span class="detalle-valor">{{ prestamoSeleccionado.client_id }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Monto:</span>
            <span class="detalle-valor">${{ prestamoSeleccionado.loan_amount.toFixed(2) }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Tasa de interés:</span>
            <span class="detalle-valor">{{ prestamoSeleccionado.interest_rate }}%</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Plazo:</span>
            <span class="detalle-valor">{{ prestamoSeleccionado.term_months }} meses</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Cuota mensual:</span>
            <span class="detalle-valor">${{ prestamoSeleccionado.monthly_payment.toFixed(2) }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Fecha inicio:</span>
            <span class="detalle-valor">{{ prestamoSeleccionado.start_date || 'N/A' }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Fecha fin:</span>
            <span class="detalle-valor">{{ prestamoSeleccionado.end_date || 'N/A' }}</span>
          </div>
          <div class="detalle-item">
            <span class="detalle-etiqueta">Estado:</span>
            <span :class="`estado ${prestamoSeleccionado.status}`">
              {{ prestamoSeleccionado.status }}
            </span>
          </div>
        </div>

        <button @click="mostrarModal = false" class="btn-accion">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Datos estáticos de ejemplo
const datosEstaticos = [
  {
    id: 1,
    client_id: 101,
    loan_amount: 5000,
    interest_rate: 5.5,
    term_months: 12,
    monthly_payment: 429.08,
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    status: 'activo'
  },
  {
    id: 2,
    client_id: 102,
    loan_amount: 10000,
    interest_rate: 7.0,
    term_months: 24,
    monthly_payment: 447.73,
    start_date: '2023-02-15',
    end_date: '2025-02-15',
    status: 'activo'
  },
  {
    id: 3,
    client_id: 103,
    loan_amount: 7500,
    interest_rate: 6.0,
    term_months: 18,
    monthly_payment: 483.58,
    start_date: '2023-03-10',
    end_date: '2024-09-10',
    status: 'pendiente'
  },
  {
    id: 4,
    client_id: 101,
    loan_amount: 15000,
    interest_rate: 8.5,
    term_months: 36,
    monthly_payment: 473.82,
    start_date: '2023-04-05',
    end_date: '2026-04-05',
    status: 'activo'
  }
]

const prestamos = ref([])
const filtroCliente = ref('')
const loading = ref(false)
const error = ref(null)
const mostrarModal = ref(false)
const prestamoSeleccionado = ref(null)
const orden = ref({
  id: 'down',
  client_id: 'down',
  loan_amount: 'down',
  interest_rate: 'down',
  term_months: 'down',
  monthly_payment: 'down',
  status: 'down'
})
const campoOrden = ref('id')

onMounted(() => {
  obtenerPrestamos()
})

const obtenerPrestamos = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Intento obtener datos del backend
    const response = await fetch('https://localhost:8085/api/loans', {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173',
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener préstamos')
    }

    prestamos.value = await response.json()
    
  } catch (err) {
    // Si falla, uso datos estáticos
    console.error('Error al obtener préstamos, usando datos estáticos:', err.message)
    prestamos.value = datosEstaticos
    error.value = 'No se pudo conectar al servidor. Mostrando datos de ejemplo.'
  } finally {
    loading.value = false
  }
}

const prestamosFiltrados = computed(() => {
  let resultados = prestamos.value
  
  // Filtrar por ID de cliente si hay búsqueda
  if (filtroCliente.value) {
    resultados = resultados.filter(p => 
      p.client_id.toString().includes(filtroCliente.value))
  }
  
  // Ordenar los resultados
  return resultados.sort((a, b) => {
    const campo = campoOrden.value
    const valorA = a[campo]
    const valorB = b[campo]
    
    if (orden.value[campo] === 'up') {
      return valorA > valorB ? 1 : -1
    } else {
      return valorA < valorB ? 1 : -1
    }
  })
})

const ordenarPor = (campo) => {
  campoOrden.value = campo
  orden.value[campo] = orden.value[campo] === 'up' ? 'down' : 'up'
}

const verDetalles = (prestamo) => {
  prestamoSeleccionado.value = prestamo
  mostrarModal.value = true
}

const volver = () => router.push('/')
</script>

<style scoped>
.obtener-prestamos {
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
  text-shadow: 0 0 10px rgba(61, 237, 151, 0.5);
}

.descripcion {
  font-size: 1.2rem;
  color: #ccc;
  max-width: 600px;
  margin: 0 auto;
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

.input-filtro {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #3ded97;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 1rem;
}

.tabla-container {
  width: 100%;
  max-width: 1200px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.1);
}

.tabla-scroll {
  overflow-x: auto;
}

.tabla-prestamos {
  width: 100%;
  border-collapse: collapse;
}

.tabla-prestamos th, 
.tabla-prestamos td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #333;
}

.tabla-prestamos th {
  color: #3ded97;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.tabla-prestamos th:hover {
  background-color: rgba(61, 237, 151, 0.1);
}

.tabla-prestamos th i {
  margin-left: 5px;
}

.tabla-prestamos tbody tr:hover {
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

.estado.pendiente {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.estado.rechazado {
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.estado.pagado {
  background-color: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
}

.acciones {
  display: flex;
  justify-content: center;
  gap: 10px;
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

.btn-pequeno {
  padding: 8px 15px;
  font-size: 0.9rem;
}

.btn-secundario {
  background-color: #6c757d;
  box-shadow: 0 0 10px #6c757d;
}

.btn-secundario:hover {
  background-color: #5a6268;
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
  max-width: 600px;
  border: 1px solid #3ded97;
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

@media (max-width: 768px) {
  .tabla-prestamos th, 
  .tabla-prestamos td {
    padding: 10px 5px;
    font-size: 0.9rem;
  }
  
  .titulo {
    font-size: 2rem;
  }
  
  .detalle-item {
    flex-direction: column;
    gap: 5px;
  }
}
</style>