<template>
  <div class="modificar-prestamo">
    <section class="hero">
      <h1 class="titulo">Modificar Préstamo</h1>
      <p class="descripcion">Busca y selecciona un préstamo para modificarlo</p>
    </section>

    <!-- Buscador -->
    <section class="filtros">
      <div class="filtros-container">
        <input
          v-model="busqueda"
          type="text"
          class="input-filtro"
          placeholder="Buscar por ID de préstamo o ID de cliente"
        />
      </div>
    </section>

    <!-- Mensajes de estado -->
    <div v-if="loading" class="cargando">Cargando préstamos...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Lista de préstamos -->
    <section class="lista-prestamos" v-else>
      <div v-if="prestamosFiltrados.length">
        <div 
          v-for="prestamo in prestamosFiltrados" 
          :key="prestamo.id"
          class="item-prestamo"
          :class="{ 'seleccionado': prestamoSeleccionado?.id === prestamo.id }"
          @click="seleccionarPrestamo(prestamo)"
        >
          <div class="info-prestamo">
            <h3>Préstamo #{{ prestamo.id }}</h3>
            <p><strong>Cliente ID:</strong> {{ prestamo.client_id }}</p>
            <p><strong>Monto:</strong> ${{ prestamo.loan_amount.toFixed(2) }}</p>
            <p><strong>Estado:</strong> <span :class="`estado ${prestamo.status}`">{{ prestamo.status }}</span></p>
          </div>
          <div class="acciones">
            <button class="btn-accion btn-pequeno">
              <i class="bi bi-pencil"></i> Modificar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="sin-resultados">
        No se encontraron préstamos con los filtros aplicados.
      </div>
    </section>

    <!-- Formulario de modificación -->
    <section v-if="prestamoSeleccionado" class="formulario-modificacion">
      <div class="formulario-container">
        <h2 class="subtitulo">Modificar Préstamo #{{ prestamoSeleccionado.id }}</h2>

        <form @submit.prevent="modificarPrestamo" class="form-modificar">
          <div class="form-columnas">
            <div class="form-grupo">
              <label>Monto del Préstamo ($)</label>
              <input
                v-model.number="form.loan_amount"
                type="number"
                min="100"
                step="0.01"
                class="input-field"
                required
              />
            </div>

            <div class="form-grupo">
              <label>Tasa de Interés (%)</label>
              <input
                v-model.number="form.interest_rate"
                type="number"
                min="1"
                max="30"
                step="0.1"
                class="input-field"
                required
              />
            </div>
          </div>

          <div class="form-columnas">
            <div class="form-grupo">
              <label>Plazo (meses)</label>
              <input
                v-model.number="form.term_months"
                type="number"
                min="1"
                max="120"
                class="input-field"
                required
              />
            </div>

            <div class="form-grupo">
              <label>Estado</label>
              <select v-model="form.status" class="input-field">
                <option value="pendiente">Pendiente</option>
                <option value="activo">Activo</option>
                <option value="rechazado">Rechazado</option>
                <option value="pagado">Pagado</option>
              </select>
            </div>
          </div>

          <div class="botones-form">
            <button type="submit" class="btn-accion" :disabled="loading">
              <i class="bi bi-check-circle"></i> {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
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
            <p>Nuevo pago mensual estimado: <strong>${{ pagoMensual.toFixed(2) }}</strong></p>
          </div>

          <div v-if="mensaje" :class="['mensaje', mensajeError ? 'error' : 'exito']">
            {{ mensaje }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

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
    error.value = 'No se pudo conectar al servidor.'
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
</script>

<style scoped>
.modificar-prestamo {
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

.lista-prestamos {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 30px;
}

.item-prestamo {
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.item-prestamo:hover {
  border-color: #3ded97;
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.2);
}

.item-prestamo.seleccionado {
  border-color: #ffc107;
  box-shadow: 0 0 15px rgba(255, 193, 7, 0.3);
}

.info-prestamo h3 {
  color: #3ded97;
  margin-bottom: 10px;
}

.info-prestamo p {
  margin-bottom: 5px;
  color: #ccc;
}

.info-prestamo strong {
  color: #fff;
}

.estado {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.estado.pendiente {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.estado.activo {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
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
  gap: 10px;
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

.formulario-modificacion {
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
  margin-bottom: 20px;
  text-align: center;
}

.form-modificar {
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

.btn-accion:disabled {
  background-color: #6c757d;
  box-shadow: none;
  cursor: not-allowed;
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

.resultado-calculo {
  text-align: center;
  padding: 15px;
  background-color: rgba(61, 237, 151, 0.1);
  border-radius: 8px;
  border: 1px solid #3ded97;
  margin-top: 20px;
}

.resultado-calculo p {
  margin: 0;
  color: #fff;
  font-size: 1.1rem;
}

.resultado-calculo strong {
  color: #3ded97;
}

.mensaje {
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
}

.mensaje.exito {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid #28a745;
}

.mensaje.error {
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid #dc3545;
}

.boton-volver {
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .form-columnas {
    grid-template-columns: 1fr;
  }
  
  .botones-form {
    flex-direction: column;
  }
  
  .item-prestamo {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .info-prestamo, .acciones {
    width: 100%;
  }
  
  .titulo {
    font-size: 2rem;
  }
}
</style>