<template>
  <div class="prestamos-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Solicitar Nuevo Préstamo</h1>
      <p class="descripcion">Complete el formulario para solicitar un nuevo préstamo</p>
    </section>

    <section class="formulario-container animate__animated animate__fadeInUp">
      <div class="formulario-modificacion">
        <h2 class="subtitulo">
          <i class="bi bi-file-earmark-plus"></i> Nueva Solicitud de Préstamo
        </h2>

        <form @submit.prevent="solicitarPrestamo" class="form-modificar">
          <div class="form-columnas">
            <div class="campo">
              <div class="input-group">
                <i class="bi bi-person-vcard icono-input"></i>
                <input
                  v-model="form.client_id"
                  type="number"
                  class="input-text"
                  placeholder="ID del Cliente (Ej: 123)"
                  required
                />
              </div>
            </div>

            <div class="campo">
              <div class="input-group">
                <i class="bi bi-cash-stack icono-input"></i>
                <input
                  v-model.number="form.loan_amount"
                  type="number"
                  min="100"
                  step="0.01"
                  class="input-text"
                  placeholder="Monto del Préstamo (Ej: 5000.00)"
                  required
                />
              </div>
            </div>
          </div>

          <div class="form-columnas">
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
                  placeholder="Tasa de Interés (Ej: 5.5)"
                  required
                />
              </div>
            </div>

            <div class="campo">
              <div class="input-group">
                <i class="bi bi-calendar-month icono-input"></i>
                <input
                  v-model.number="form.term_months"
                  type="number"
                  min="1"
                  max="120"
                  class="input-text"
                  placeholder="Plazo en meses (Ej: 12)"
                  required
                />
              </div>
            </div>
          </div>

          <div class="campo">
            <div class="input-group">
              <i class="bi bi-calendar-date icono-input"></i>
              <input
                v-model="form.start_date"
                type="date"
                class="input-text"
                required
              />
            </div>
          </div>

          <div class="botones-form">
            <button 
              type="submit" 
              class="btn-accion btn-guardar"
              :disabled="loading"
            >
              <i class="bi" :class="loading ? 'bi-arrow-repeat' : 'bi-check-circle'"></i> 
              {{ loading ? 'Procesando...' : 'Solicitar Préstamo' }}
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
            <p><i class="bi bi-currency-dollar"></i> Pago mensual estimado: 
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

const calcularFechaFin = (startDate, months) => {
  const date = new Date(startDate)
  date.setMonth(date.getMonth() + parseInt(months))
  return date.toISOString().split('T')[0]
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
      clientId: parseInt(form.value.client_id),
      loanAmount: parseFloat(form.value.loan_amount),
      interestRate: parseFloat(form.value.interest_rate),
      termMonths: parseInt(form.value.term_months),
      monthlyPayment: pagoMensual.value,
      startDate: form.value.start_date,
      endDate: calcularFechaFin(form.value.start_date, form.value.term_months),
      status: 'pendiente'
    }

    const response = await fetch('http://localhost:8085/api/loans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    
    // Resetear formulario
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
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const volver = () => router.push('/')
</script>

<style>
/* Estilos base del contenedor principal */
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

/* Estilos para la sección hero */
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

/* Estilos para el formulario */
.formulario-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
}

.formulario-modificacion {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.05);
}

.subtitulo {
  font-size: 1.5rem;
  color: #3ded97;
  margin-bottom: 25px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.form-modificar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.campo {
  margin-bottom: 15px;
}

.input-group {
  position: relative;
}

.icono-input {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #3ded97;
  font-size: 1.2rem;
}

.input-text {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-text:focus {
  outline: none;
  border-color: #3ded97;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.2);
}

/* Estilos para los botones */
.botones-form {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2fa8f8);
  color: #fff;
  padding: 12px 25px;
  font-size: 1rem;
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

.btn-guardar {
  background: linear-gradient(135deg, #3ded97, #2fa8f8);
}

.btn-guardar:disabled {
  background: rgba(108, 117, 125, 0.5);
  box-shadow: none;
  cursor: not-allowed;
}

.btn-secundario {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.btn-secundario:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Estilos para el resultado del cálculo */
.resultado-calculo {
  text-align: center;
  padding: 15px;
  background: rgba(61, 237, 151, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.resultado-calculo p {
  margin: 0;
  color: #fff;
  font-size: 1.1rem;
}

.resultado-calculo strong {
  color: #3ded97;
}

/* Estilos para mensajes */
.mensaje {
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(61, 237, 151, 0.2);
  border: 1px solid rgba(61, 237, 151, 0.5);
}

.mensaje.error {
  background: rgba(244, 63, 94, 0.2);
  border: 1px solid rgba(244, 63, 94, 0.5);
  color: #f43f5e;
}

/* Estilos para el botón de volver y footer */
.boton-volver {
  margin-bottom: 30px;
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

/* Media queries para responsividad */
@media (max-width: 768px) {
  .form-columnas {
    grid-template-columns: 1fr;
  }
  
  .botones-form {
    flex-direction: column;
  }
  
  .subtitulo {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .input-text {
    padding: 12px 12px 12px 40px;
    font-size: 0.95rem;
  }
  
  .icono-input {
    font-size: 1rem;
    left: 12px;
  }
}
</style>