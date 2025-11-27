<template>
  <div class="prestamos-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Modificar Préstamo</h1>
      <p class="descripcion">
        Busca y selecciona un préstamo para modificarlo
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
    
    <!-- Mostrar error pero continuar con la aplicación -->
    <div v-if="error" class="mensaje error">
      <i class="bi bi-exclamation-triangle"></i> {{ error }}
    </div>

    <!-- QUITAR el v-else para que siempre muestre la lista cuando hay datos -->
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
            <i class="bi bi-pencil"></i> Modificar
          </button>
        </div>
      </div>

      <div v-else-if="!loading" class="sin-resultados">
        <i class="bi bi-exclamation-circle"></i> No se encontraron préstamos con los filtros aplicados
      </div>
    </section>

    <section v-if="prestamoSeleccionado" class="formulario-container animate__animated animate__fadeIn">
      <div class="formulario-modificacion">
        <h2 class="subtitulo">
          <i class="bi bi-pencil-square"></i> Modificar Préstamo #{{ prestamoSeleccionado.id }}
        </h2>

        <form @submit.prevent="modificarPrestamo" class="form-modificar">
          <div class="form-columnas">
            <div class="campo">
              <div class="input-group">
                <i class="bi bi-cash-stack icono-input"></i>
                <input
                  v-model.number="form.loanAmount"
                  type="number"
                  min="100"
                  step="0.01"
                  class="input-text"
                  placeholder="Monto del préstamo"
                  required
                />
              </div>
            </div>

            <div class="campo">
              <div class="input-group">
                <i class="bi bi-percent icono-input"></i>
                <input
                  v-model.number="form.interestRate"
                  type="number"
                  min="1"
                  max="30"
                  step="0.1"
                  class="input-text"
                  placeholder="Tasa de interés"
                  required
                />
              </div>
            </div>
          </div>

          <div class="form-columnas">
            <div class="campo">
              <div class="input-group">
                <i class="bi bi-calendar-month icono-input"></i>
                <input
                  v-model.number="form.termMonths"
                  type="number"
                  min="1"
                  max="120"
                  class="input-text"
                  placeholder="Plazo en meses"
                  required
                />
              </div>
            </div>

            <div class="campo">
              <div class="input-group">
                <i class="bi bi-list-check icono-input"></i>
                <select v-model="form.status" class="input-select">
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="RECHAZADO">Rechazado</option>
                  <option value="PAGADO">Pagado</option>
                </select>
              </div>
            </div>
          </div>

          <div class="botones-form">
            <button 
              type="submit" 
              class="btn-accion btn-guardar"
              :disabled="loading"
            >
              <i class="bi" :class="loading ? 'bi-arrow-repeat' : 'bi-check-circle'"></i> 
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button
              type="button"
              @click="recalcularPago"
              class="btn-accion btn-secundario"
            >
              <i class="bi bi-calculator"></i> Recalcular Pago
            </button>
          </div>

          <div v-if="pagoMensual" class="resultado-calculo">
            <p><i class="bi bi-currency-dollar"></i> Nuevo pago mensual estimado: 
              <strong>{{ formatCurrency(pagoMensual) }}</strong>
            </p>
          </div>

          <div v-if="mensaje" class="mensaje" :class="{ 'error': mensajeError }">
            <i class="bi" :class="mensajeError ? 'bi-exclamation-triangle' : 'bi-check-circle'"></i>
            {{ mensaje }}
          </div>
        </form>
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
const pagoMensual = ref(0)
const mensaje = ref('')
const mensajeError = ref(false)
const usandoDatosFicticios = ref(false)

const form = ref({
  loanAmount: 0,
  interestRate: 0,
  termMonths: 0,
  status: '',
  monthlyPayment: 0
})

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
    // Usar datos ficticios
    prestamos.value = datosEstaticos
    usandoDatosFicticios.value = true
    error.value = 'No se pudo conectar al servidor. Mostrando datos de ejemplo.'
  } finally {
    loading.value = false
  }
}

// QUITAR la función normalizarPrestamos ya que los datos estáticos ya están en el formato correcto

const prestamosFiltrados = computed(() => {
  const filtro = busqueda.value.toLowerCase()
  return prestamos.value.filter(p => 
    p.id.toString().includes(filtro) || 
    p.clientId.toString().includes(filtro))
})

const seleccionarPrestamo = (prestamo) => {
  prestamoSeleccionado.value = prestamo
  pagoMensual.value = prestamo.monthlyPayment
  mensaje.value = ''
  mensajeError.value = false
  
  form.value = {
    loanAmount: prestamo.loanAmount,
    interestRate: prestamo.interestRate,
    termMonths: prestamo.termMonths,
    status: prestamo.status,
    monthlyPayment: prestamo.monthlyPayment
  }
}

const recalcularPago = () => {
  if (!form.value.loanAmount || !form.value.interestRate || !form.value.termMonths) {
    mensaje.value = 'Complete los campos requeridos para calcular'
    mensajeError.value = true
    return
  }

  const principal = parseFloat(form.value.loanAmount)
  const tasaMensual = parseFloat(form.value.interestRate) / 100 / 12
  const plazoMeses = parseInt(form.value.termMonths)

  // Fórmula de amortización
  pagoMensual.value = (principal * tasaMensual) / 
                      (1 - Math.pow(1 + tasaMensual, -plazoMeses))
  
  form.value.monthlyPayment = pagoMensual.value
  
  mensaje.value = 'Pago mensual recalculado'
  mensajeError.value = false
}

const modificarPrestamo = async () => {
  try {
    loading.value = true
    mensaje.value = ''
    mensajeError.value = false

    if (!form.value.loanAmount || !form.value.interestRate || 
        !form.value.termMonths || !form.value.status) {
      throw new Error('Todos los campos son requeridos')
    }

    if (pagoMensual.value === 0) {
      pagoMensual.value = prestamoSeleccionado.value.monthlyPayment
    }

    const payload = {
      loanAmount: parseFloat(form.value.loanAmount),
      interestRate: parseFloat(form.value.interestRate),
      termMonths: parseInt(form.value.termMonths),
      monthlyPayment: pagoMensual.value,
      status: form.value.status
    }

    // Si estamos usando datos ficticios, no intentar conectar al servidor
    if (usandoDatosFicticios.value) {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Actualizar localmente
      const index = prestamos.value.findIndex(p => p.id === prestamoSeleccionado.value.id)
      if (index !== -1) {
        prestamos.value[index] = {
          ...prestamos.value[index],
          ...payload
        }
        prestamoSeleccionado.value = prestamos.value[index]
      }
      
      mensaje.value = 'Préstamo actualizado correctamente (modo demostración)'
      mensajeError.value = false
      return
    }

    const response = await fetch(`${API_BASE}/loans/${prestamoSeleccionado.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar el préstamo')
    }

    const updatedPrestamo = await response.json()
    const index = prestamos.value.findIndex(p => p.id === prestamoSeleccionado.value.id)
    if (index !== -1) {
      prestamos.value[index] = updatedPrestamo
    }

    mensaje.value = 'Préstamo actualizado correctamente'
    mensajeError.value = false

  } catch (err) {
    console.error('Error al modificar préstamo:', err)
    
    // Actualización local como fallback
    const index = prestamos.value.findIndex(p => p.id === prestamoSeleccionado.value.id)
    if (index !== -1) {
      prestamos.value[index] = {
        ...prestamos.value[index],
        ...form.value,
        monthlyPayment: pagoMensual.value
      }
    }
    
    mensaje.value = err.message || 'Error al actualizar el préstamo'
    mensajeError.value = true
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