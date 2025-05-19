<template>
  <div class="crear-prestamo">
    <section class="hero">
      <h1 class="titulo">Solicitar Nuevo Préstamo</h1>
      <p class="descripcion">Complete el formulario para solicitar un nuevo préstamo</p>
    </section>

    <section class="formulario-container">
      <form @submit.prevent="solicitarPrestamo" class="form-prestamo">
        <div class="form-columnas">
          <div class="form-grupo">
            <label>ID del Cliente</label>
            <input
              v-model="form.client_id"
              type="number"
              class="input-field"
              placeholder="Ej: 123"
              required
            />
          </div>

          <div class="form-grupo">
            <label>Monto del Préstamo ($)</label>
            <input
              v-model.number="form.loan_amount"
              type="number"
              min="100"
              step="0.01"
              class="input-field"
              placeholder="Ej: 5000.00"
              required
            />
          </div>
        </div>

        <div class="form-columnas">
          <div class="form-grupo">
            <label>Tasa de Interés (%)</label>
            <input
              v-model.number="form.interest_rate"
              type="number"
              min="1"
              max="30"
              step="0.1"
              class="input-field"
              placeholder="Ej: 5.5"
              required
            />
          </div>

          <div class="form-grupo">
            <label>Plazo (meses)</label>
            <input
              v-model.number="form.term_months"
              type="number"
              min="1"
              max="120"
              class="input-field"
              placeholder="Ej: 12"
              required
            />
          </div>
        </div>

        <div class="form-grupo">
          <label>Fecha de Inicio</label>
          <input
            v-model="form.start_date"
            type="date"
            class="input-field"
            required
          />
        </div>

        <div class="botones-form">
          <button type="submit" class="btn-accion" :disabled="loading">
            <i class="bi bi-check-circle"></i> {{ loading ? 'Procesando...' : 'Solicitar Préstamo' }}
          </button>
          <button
            type="button"
            @click="calcularPagoMensual"
            class="btn-accion btn-secundario"
          >
            <i class="bi bi-calculator"></i> Calcular Pago Mensual
          </button>
        </div>

        <div v-if="pagoMensual" class="resultado-calculo">
          <p>Pago mensual estimado: <strong>${{ pagoMensual.toFixed(2) }}</strong></p>
        </div>

        <div v-if="mensaje" :class="['mensaje', mensajeError ? 'error' : 'exito']">
          {{ mensaje }}
        </div>
      </form>
    </section>

    <div class="boton-volver">
      <button @click="volver" class="btn-accion btn-secundario">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  client_id: '',
  loan_amount: '',
  interest_rate: '',
  term_months: '',
  start_date: new Date().toISOString().split('T')[0] // Fecha actual por defecto
})

const pagoMensual = ref(0)
const mensaje = ref('')
const mensajeError = ref(false)
const loading = ref(false)

const calcularPagoMensual = () => {
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
  
  mensaje.value = 'Cálculo realizado correctamente'
  mensajeError.value = false
}

const solicitarPrestamo = async () => {
  try {
    loading.value = true
    mensaje.value = ''
    mensajeError.value = false

    // Validación básica
    if (!form.value.client_id || !form.value.loan_amount || 
        !form.value.interest_rate || !form.value.term_months || !form.value.start_date) {
      throw new Error('Todos los campos son requeridos')
    }

    // Calcular pago mensual si no se ha hecho
    if (pagoMensual.value === 0) {
      calcularPagoMensual()
    }

    const payload = {
      client_id: parseInt(form.value.client_id),
      loan_amount: parseFloat(form.value.loan_amount),
      interest_rate: parseFloat(form.value.interest_rate),
      term_months: parseInt(form.value.term_months),
      monthly_payment: pagoMensual.value,
      start_date: form.value.start_date,
      status: 'pendiente' // Estado inicial
    }

    const response = await fetch('https://localhost:8085/api/loans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al crear el préstamo')
    }

    const data = await response.json()
    mensaje.value = `Préstamo creado exitosamente. ID: ${data.id}`
    mensajeError.value = false
    form.value = {
      client_id: '',
      loan_amount: '',
      interest_rate: '',
      term_months: '',
      start_date: new Date().toISOString().split('T')[0]
    }
    pagoMensual.value = 0

  } catch (err) {
    mensaje.value = err.message || 'Ocurrió un error al procesar la solicitud'
    mensajeError.value = true
  } finally {
    loading.value = false
  }
}

const volver = () => router.push('/')
</script>

<style scoped>
.crear-prestamo {
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

.formulario-container {
  width: 100%;
  max-width: 800px;
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.1);
  margin-bottom: 30px;
}

.form-prestamo {
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

.input-field:focus {
  outline: none;
  box-shadow: 0 0 5px #3ded97;
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
  
  .titulo {
    font-size: 2rem;
  }
}
</style>