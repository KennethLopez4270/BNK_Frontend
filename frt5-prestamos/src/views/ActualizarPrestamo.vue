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
            <i class="bi bi-pencil"></i> Modificar
          </button>
        </div>
      </div>

      <div v-else class="sin-resultados">
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
                  v-model.number="form.loan_amount"
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
                  v-model.number="form.interest_rate"
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
                  v-model.number="form.term_months"
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
                  <option value="pendiente">Pendiente</option>
                  <option value="activo">Activo</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="pagado">Pagado</option>
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
              <strong>${{ pagoMensual.toFixed(2) }}</strong>
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

// Datos estáticos de respaldo
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
const pagoMensual = ref(0)
const mensaje = ref('')
const mensajeError = ref(false)

const form = ref({
  loan_amount: 0,
  interest_rate: 0,
  term_months: 0,
  status: '',
  monthly_payment: 0
})

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
    // Si falla
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
  pagoMensual.value = prestamo.monthly_payment
  mensaje.value = ''
  mensajeError.value = false
  
  // Llenar formulario con datos del préstamo
  form.value = {
    loan_amount: prestamo.loan_amount,
    interest_rate: prestamo.interest_rate,
    term_months: prestamo.term_months,
    status: prestamo.status,
    monthly_payment: prestamo.monthly_payment
  }
}

const recalcularPago = () => {
  if (!form.value.loan_amount || !form.value.interest_rate || !form.value.term_months) {
    mensaje.value = 'Complete los campos requeridos para calcular'
    mensajeError.value = true
    return
  }

  const principal = parseFloat(form.value.loan_amount)
  const tasaMensual = parseFloat(form.value.interest_rate) / 100 / 12
  const plazoMeses = parseInt(form.value.term_months)

  // Fórmula de amortización
  pagoMensual.value = (principal * tasaMensual) / 
                      (1 - Math.pow(1 + tasaMensual, -plazoMeses))
  
  form.value.monthly_payment = pagoMensual.value
  
  mensaje.value = 'Pago mensual recalculado'
  mensajeError.value = false
}

const modificarPrestamo = async () => {
  try {
    loading.value = true
    mensaje.value = ''
    mensajeError.value = false

    // Validación
    if (!form.value.loan_amount || !form.value.interest_rate || 
        !form.value.term_months || !form.value.status) {
      throw new Error('Todos los campos son requeridos')
    }

    // Si no se ha recalculado, usar el valor existente
    if (pagoMensual.value === 0) {
      pagoMensual.value = prestamoSeleccionado.value.monthly_payment
    }

    const payload = {
      loan_amount: parseFloat(form.value.loan_amount),
      interest_rate: parseFloat(form.value.interest_rate),
      term_months: parseInt(form.value.term_months),
      monthly_payment: pagoMensual.value,
      status: form.value.status
    }

    // Intento conectar con el backend
    const response = await fetch(`https://localhost:8085/api/loans/${prestamoSeleccionado.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Error al actualizar el préstamo')
    }

    // Actualizar localmente
    const updatedPrestamo = await response.json()
    const index = prestamos.value.findIndex(p => p.id === prestamoSeleccionado.value.id)
    if (index !== -1) {
      prestamos.value[index] = updatedPrestamo
    }

    mensaje.value = 'Préstamo actualizado correctamente'
    mensajeError.value = false

  } catch (err) {
    // Simular éxito con datos locales si el backend falla
    console.error('Error al modificar préstamo:', err.message)
    
    const index = prestamos.value.findIndex(p => p.id === prestamoSeleccionado.value.id)
    if (index !== -1) {
      prestamos.value[index] = {
        ...prestamos.value[index],
        ...form.value,
        monthly_payment: pagoMensual.value
      }
    }
    
    mensaje.value = 'Modificación simulada (backend no disponible)'
    mensajeError.value = false
  } finally {
    loading.value = false
  }
}

const volver = () => router.push('/')

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

