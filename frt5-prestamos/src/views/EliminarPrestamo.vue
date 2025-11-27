<template>
  <div class="prestamos-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Cancelar/Eliminar Préstamo</h1>
      <p class="descripcion">
        Busca y selecciona un préstamo para cancelarlo o eliminarlo
      </p>
    </section>

    <section class="filtros-container animate__animated animate__fadeInUp">
      <div class="filtros">
        <div class="input-group">
          <i class="bi bi-search icono-input"></i>
          <input
            v-model="busqueda"
            type="text"
            class="input-busqueda"
            placeholder="Buscar por ID de préstamo o ID de cliente"
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
    <section class="lista-container animate__animated animate__fadeInUp">
      <div v-if="prestamosFiltrados.length" class="lista-prestamos">
        <div 
          v-for="prestamo in prestamosFiltrados" 
          :key="prestamo.id"
          class="card-prestamo"
          :class="{ 'seleccionado': prestamoSeleccionado?.id === prestamo.id }"
          @click="seleccionarPrestamo(prestamo)"
        >
          <div class="icono-wrapper">
            <div class="icono" :class="`bg-${getColorByStatus(prestamo.status)}`">
              <i :class="`bi ${getLoanIcon(prestamo.status)}`"></i>
            </div>
            <div class="glow" :class="`glow-${getColorByStatus(prestamo.status)}`"></div>
          </div>
          
          <div class="info-prestamo">
            <h3>Préstamo #{{ prestamo.id }}</h3>
            <p class="detalle"><i class="bi bi-person"></i> Cliente ID: {{ prestamo.clientId }}</p>
            <p class="detalle"><i class="bi bi-cash-coin"></i> Monto: {{ formatCurrency(prestamo.loanAmount) }}</p>
            <p class="detalle">
              <i class="bi bi-circle-fill"></i> 
              <span :class="`estado ${prestamo.status.toLowerCase()}`">
                {{ formatEstado(prestamo.status) }}
              </span>
            </p>
          </div>
          
          <button class="btn-accion btn-pequeno">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>

      <div v-else-if="!loading" class="sin-resultados">
        <i class="bi bi-exclamation-circle"></i> No se encontraron préstamos con los filtros aplicados
      </div>
    </section>

    <section v-if="prestamoSeleccionado" class="confirmacion-container animate__animated animate__fadeIn">
      <div class="confirmacion-modificacion">
        <h2 class="subtitulo">
          <i class="bi bi-exclamation-triangle-fill"></i> Confirmar Eliminación
        </h2>

        <div class="detalle-prestamo">
          <p><strong>Préstamo #{{ prestamoSeleccionado.id }}</strong></p>
          <p>Cliente ID: {{ prestamoSeleccionado.clientId }}</p>
          <p>Monto: {{ formatCurrency(prestamoSeleccionado.loanAmount) }}</p>
          <p>Estado: <span :class="`estado ${prestamoSeleccionado.status.toLowerCase()}`">{{ formatEstado(prestamoSeleccionado.status) }}</span></p>
        </div>

        <div class="botones-confirmacion">
          <button 
            @click="eliminarPrestamo"
            class="btn-accion btn-eliminar"
            :disabled="loading"
          >
            <i class="bi" :class="loading ? 'bi-arrow-repeat' : 'bi-trash-fill'"></i> 
            {{ loading ? 'Procesando...' : 'Confirmar Eliminación' }}
          </button>
          <button
            type="button"
            @click="cancelarEliminacion"
            class="btn-accion btn-secundario"
          >
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>

        <div v-if="mensaje" class="mensaje" :class="{ 'error': mensajeError }">
          <i class="bi" :class="mensajeError ? 'bi-exclamation-triangle' : 'bi-check-circle'"></i>
          {{ mensaje }}
        </div>
      </div>
    </section>

    <div class="boton-volver">
      <button @click="volver" class="btn-accion btn-secundario">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
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

// Datos estáticos más completos en formato camelCase
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
  }
]

const prestamos = ref([])
const prestamoSeleccionado = ref(null)
const busqueda = ref('')
const loading = ref(false)
const error = ref(null)
const mensaje = ref('')
const mensajeError = ref(false)
const usandoDatosFicticios = ref(false)

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
  const filtro = busqueda.value.toLowerCase()
  return prestamos.value.filter(p => 
    p.id.toString().includes(filtro) || 
    p.clientId.toString().includes(filtro))
})

const seleccionarPrestamo = (prestamo) => {
  prestamoSeleccionado.value = prestamo
  mensaje.value = ''
  mensajeError.value = false
}

const cancelarEliminacion = () => {
  prestamoSeleccionado.value = null
  mensaje.value = ''
}

const eliminarPrestamo = async () => {
  try {
    loading.value = true
    mensaje.value = ''
    mensajeError.value = false

    // Si estamos usando datos ficticios, no intentar conectar al servidor
    if (usandoDatosFicticios.value) {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Eliminar localmente
      prestamos.value = prestamos.value.filter(p => p.id !== prestamoSeleccionado.value.id)
      
      mensaje.value = 'Préstamo eliminado correctamente (modo demostración)'
      mensajeError.value = false
      prestamoSeleccionado.value = null
      return
    }

    const response = await fetch(`${API_BASE}/loans/${prestamoSeleccionado.value.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al eliminar el préstamo')
    }

    // Eliminar localmente
    prestamos.value = prestamos.value.filter(p => p.id !== prestamoSeleccionado.value.id)
    
    mensaje.value = 'Préstamo eliminado correctamente'
    mensajeError.value = false
    prestamoSeleccionado.value = null

  } catch (err) {
    console.error('Error al eliminar préstamo:', err)
    
    // Eliminación local como fallback
    prestamos.value = prestamos.value.filter(p => p.id !== prestamoSeleccionado.value.id)
    
    mensaje.value = err.message || 'Error al eliminar el préstamo'
    mensajeError.value = true
    prestamoSeleccionado.value = null
  } finally {
    loading.value = false
  }
}

// Helpers
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value || 0)
}

const getLoanIcon = (status) => {
  const statusLower = (status || '').toLowerCase()
  const icons = {
    activo: 'bi-cash-stack',
    pendiente: 'bi-hourglass',
    rechazado: 'bi-x-circle',
    pagado: 'bi-coin'
  }
  return icons[statusLower] || 'bi-question-circle'
}

const getColorByStatus = (status) => {
  const statusLower = (status || '').toLowerCase()
  const colors = {
    activo: 'green',
    pendiente: 'blue',
    rechazado: 'red',
    pagado: 'purple'
  }
  return colors[statusLower] || 'gray'
}

const formatEstado = (estado) => {
  const estadoLower = (estado || '').toLowerCase()
  const estados = {
    activo: 'Activo',
    pendiente: 'Pendiente',
    rechazado: 'Rechazado',
    pagado: 'Pagado'
  }
  return estados[estadoLower] || estado
}

const volver = () => router.push('/')
</script>


<style scoped>
/* Estilos del componente anterior (los mismos) */
/* Solo añado estilos específicos para la eliminación */

.btn-eliminar {
  background: linear-gradient(135deg, #f72585, #b5179e);
  box-shadow: 0 0 15px rgba(247, 37, 133, 0.3);
}

.btn-eliminar:hover {
  background: linear-gradient(135deg, #d91a72, #9c1586);
}

.detalle-prestamo {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid rgba(247, 37, 133, 0.2);
}

.detalle-prestamo p {
  margin: 10px 0;
  color: #a0a8c0;
}

.detalle-prestamo p strong {
  color: #fff;
}

.botones-confirmacion {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

</style>