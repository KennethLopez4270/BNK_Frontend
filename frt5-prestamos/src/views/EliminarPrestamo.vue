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

    <section v-else class="lista-container animate__animated animate__fadeInUp">
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
            <p class="detalle"><i class="bi bi-person"></i> Cliente ID: {{ prestamo.client_id }}</p>
            <p class="detalle"><i class="bi bi-cash-coin"></i> Monto: ${{ prestamo.loan_amount.toFixed(2) }}</p>
            <p class="detalle">
              <i class="bi bi-circle-fill"></i> 
              <span :class="`estado ${prestamo.status}`">
                {{ formatEstado(prestamo.status) }}
              </span>
            </p>
          </div>
          
          <button class="btn-accion btn-pequeno">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>

      <div v-else class="sin-resultados">
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
          <p>Cliente ID: {{ prestamoSeleccionado.client_id }}</p>
          <p>Monto: ${{ prestamoSeleccionado.loan_amount.toFixed(2) }}</p>
          <p>Estado: <span :class="`estado ${prestamoSeleccionado.status}`">{{ formatEstado(prestamoSeleccionado.status) }}</span></p>
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
  }
]

const prestamos = ref([])
const prestamoSeleccionado = ref(null)
const busqueda = ref('')
const loading = ref(false)
const error = ref(null)
const mensaje = ref('')
const mensajeError = ref(false)

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
    // Si falla, usar datos estáticos
    console.error('Error al obtener préstamos:', err.message)
    prestamos.value = datosEstaticos
    error.value = 'No se pudo conectar al servidor. Mostrando datos de ejemplo.'
  } finally {
    loading.value = false
  }
}

const prestamosFiltrados = computed(() => {
  const filtro = busqueda.value.toLowerCase()
  return prestamos.value.filter(p => 
    p.id.toString().includes(filtro) || 
    p.client_id.toString().includes(filtro))
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

    // Intento conectar con el backend
    const response = await fetch(`https://localhost:8085/api/loans/${prestamoSeleccionado.value.id}`, {
      method: 'DELETE',
      headers: {
        'Origin': 'http://localhost:5173',
      }
    })

    if (!response.ok) {
      throw new Error('Error al eliminar el préstamo')
    }

    // Eliminar localmente
    prestamos.value = prestamos.value.filter(p => p.id !== prestamoSeleccionado.value.id)
    
    mensaje.value = 'Préstamo eliminado correctamente'
    mensajeError.value = false
    prestamoSeleccionado.value = null

  } catch (err) {
    // Simular éxito con datos locales si el backend falla
    console.error('Error al eliminar préstamo:', err.message)
    
    prestamos.value = prestamos.value.filter(p => p.id !== prestamoSeleccionado.value.id)
    
    mensaje.value = 'Eliminación simulada (backend no disponible)'
    mensajeError.value = false
    prestamoSeleccionado.value = null
  } finally {
    loading.value = false
  }
}

const volver = () => router.push('/')

// Funciones auxiliares para mostrar iconos y colores
const getLoanIcon = (status) => {
  const icons = {
    activo: 'bi-cash-stack',
    pendiente: 'bi-hourglass',
    rechazado: 'bi-x-circle',
    pagado: 'bi-coin'
  }
  return icons[status] || 'bi-question-circle'
}

const getColorByStatus = (status) => {
  const colors = {
    activo: 'green',
    pendiente: 'blue',
    rechazado: 'pink',
    pagado: 'purple'
  }
  return colors[status] || 'blue'
}

const formatEstado = (estado) => {
  const estados = {
    activo: 'Activo',
    pendiente: 'Pendiente',
    rechazado: 'Rechazado',
    pagado: 'Pagado'
  }
  return estados[estado] || estado
}
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