<template>
  <div class="transferencias-app">
    <!-- Botón de volver con animación -->
    <button @click="volver" class="back-button animate__animated animate__fadeIn">
      <i class="bi bi-arrow-left"></i> Volver
    </button>

    <!-- Sección hero con animación -->
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Transferencia a terceros</h1>
      <p class="descripcion">
        Ingresa los datos del destinatario y el monto para realizar tu transferencia
      </p>
    </section>

    <div class="transferencia-content">
      <div class="accounts-section">
        <!-- Cuentas Origen con efecto escalonado -->
        <div class="accounts-column">
          <h5 class="section-title animate__animated animate__fadeIn">
            <i class="bi bi-arrow-up-circle"></i> Cuenta origen
          </h5>
          <div class="cards-container">
            <div
              class="card-accion animate__animated animate__fadeInUp"
              v-for="(cuenta, index) in cuentas"
              :key="'origen-' + cuenta.id"
              :style="`animation-delay: ${index * 0.1}s`"
              :class="{ 'selected-origin': form.cuentaOrigen === cuenta.id }"
              @click="selectCuentaOrigen(cuenta.id)"
            >
              <div class="icono-wrapper">
                <div class="icono" :class="accountTypeClass(cuenta.tipo)">
                  <i :class="accountTypeIcon(cuenta.tipo)"></i>
                </div>
                <div class="glow" :class="glowColor(cuenta.tipo)"></div>
              </div>
              <h3>{{ cuenta.tipo.toUpperCase() }} - {{ formatAccountNumber(cuenta.numero) }}</h3>
              <p class="descripcion-card">Saldo: Bs {{ cuenta.saldo.toFixed(2) }}</p>
              <small>ID: {{ cuenta.id }}</small>
            </div>
          </div>
        </div>

        <!-- Datos Destinatario con animación -->
        <div class="accounts-column">
          <h5 class="section-title animate__animated animate__fadeIn" style="animation-delay: 0.1s">
            <i class="bi bi-arrow-down-circle"></i> Datos del destinatario
          </h5>
          
          <div class="form-group animate__animated animate__fadeIn" style="animation-delay: 0.2s">
            <label for="identificador" class="form-label">
              <i class="bi bi-person-fill"></i> Número de documento o email
            </label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                id="identificador"
                v-model="form.identificador"
                @input="buscarDestinatario"
                placeholder="Ej: 12345678 o usuario@ejemplo.com"
                required
              />
            </div>
            <br>
            <small v-if="errorIdentificador" class="text-danger">{{ errorIdentificador }}</small>
          </div>
          
          <div class="form-group animate__animated animate__fadeIn" v-if="destinatario" style="animation-delay: 0.3s">
            <label class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              v-model="destinatario.full_name"
              readonly
            />
          </div>
          
          <br>
          
          <div class="form-group animate__animated animate__fadeIn" v-if="destinatario" style="animation-delay: 0.4s">
            <label class="form-label">Cuenta destino</label>
            <div class="input-group">
            <select
              class="form-control"
              v-model="form.cuentaDestino"
              required
            >
              <option disabled value="">Selecciona una cuenta</option>
              <option
                v-for="(cuenta, index) in destinatario.cuentas"
                :key="cuenta.numero"
                :value="cuenta.numero"
              >
                {{ cuenta.tipo.toUpperCase() }} - {{ formatAccountNumber(cuenta.numero) }}
              </option>
            </select>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section animate__animated animate__fadeIn" style="animation-delay: 0.5s">
        <form @submit.prevent="enviarTransferencia" class="transfer-form">
          <div class="form-group">
            <label for="monto" class="form-label">
              <i class="bi bi-cash-coin"></i> Monto a transferir
            </label>
            <div class="input-group">
              <span class="input-group-text">Bs</span>
              <input
                type="number"
                class="form-control"
                id="monto"
                v-model="form.monto"
                min="0.01"
                step="0.01"
                required
                placeholder="Ej: 100.00"
              />
            </div>
          </div>

          <div class="buttons-group">
            <button
              type="submit"
              class="btn-accion"
              :disabled="!formValido"
            >
              Transferir <i class="bi bi-send"></i>
            </button>

            <button
              v-if="formValido"
              @click="generarComprobante"
              type="button"
              class="btn-comprobante"
            >
              Comprobante <i class="bi bi-receipt"></i>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer con animación -->
    <footer class="footer animate__animated animate__fadeIn" style="animation-delay: 0.6s">
      © 2025 Banco Digital. Todos los derechos reservados.
    </footer>

    <!-- Modal para una sola cuenta -->
    <div
      class="modal fade"
      id="singleAccountModal"
      tabindex="-1"
      aria-labelledby="singleAccountModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="singleAccountModalLabel">Advertencia</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="volver"
              data-bs-dismiss="modal"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para resultado de transferencia -->
    <div
      class="modal fade"
      id="transferResultModal"
      tabindex="-1"
      aria-labelledby="transferResultModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="transferResultModalLabel">
              {{ transferSuccess ? 'Éxito' : 'Error' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {{ transferMessage }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn"
              :class="transferSuccess ? 'btn-success' : 'btn-danger'"
              data-bs-dismiss="modal"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'animate.css'
import * as bootstrap from 'bootstrap'

const router = useRouter()

// Datos simulados para cuentas del usuario actual
const cuentas = ref([
  { id: 1, numero: '10010001', tipo: 'ahorro', saldo: 1500.50 },
  { id: 2, numero: '10010002', tipo: 'corriente', saldo: 980.00 }
])

// Datos simulados para clientes (autocompletado)
const clientes = ref([
  {
    id: 2,
    document_number: '87654321',
    email: 'juan.perez@ejemplo.com',
    full_name: 'Juan Pérez',
    cuentas: [
      { id: 3, numero: '20020001', tipo: 'ahorro', saldo: 500.00 },
      { id: 4, numero: '20020002', tipo: 'corriente', saldo: 1200.00 }
    ]
  },
  {
    id: 3,
    document_number: '12345678',
    email: 'maria.gomez@ejemplo.com',
    full_name: 'María Gómez',
    cuentas: [
      { id: 5, numero: '30030001', tipo: 'ahorro', saldo: 3000.00 }
    ]
  }
])

const form = ref({
  cuentaOrigen: null,
  cuentaDestino: null,
  monto: '',
  identificador: ''
})

const destinatario = ref(null)
const errorIdentificador = ref('')
const transferSuccess = ref(false)
const transferMessage = ref('')

// Validación de formulario
const formValido = computed(() =>
  form.value.cuentaOrigen &&
  form.value.cuentaDestino &&
  form.value.monto &&
  parseFloat(form.value.monto) > 0 &&
  destinatario.value
)

// Funciones de ayuda
function formatAccountNumber(numero) {
  return numero.replace(/(\d{4})(\d{4})/, '$1-$2')
}

function accountTypeClass(tipo) {
  return tipo === 'ahorro' ? 'account-icon-savings' : 'account-icon-current'
}

function accountTypeIcon(tipo) {
  return tipo === 'ahorro' ? 'bi bi-piggy-bank' : 'bi bi-wallet2'
}

function glowColor(tipo) {
  return tipo === 'ahorro' ? 'glow-green' : 'glow-blue'
}
// Funciones principales
function selectCuentaOrigen(id) {
  form.value.cuentaOrigen = id
}

function buscarDestinatario() {
  const identificador = form.value.identificador.trim()
  errorIdentificador.value = ''
  destinatario.value = null
  form.value.cuentaDestino = ''

  if (identificador) {
    // Simular búsqueda en la base de datos
    const cliente = clientes.value.find(
      c => c.document_number === identificador || c.email === identificador
    )
    if (cliente) {
      destinatario.value = cliente
    } else {
      errorIdentificador.value = 'No se encontró un cliente con ese documento o email.'
    }
  }
}

function volver() {
  router.go(-1)
}

function generarComprobante() {
  const comprobante = {
    origen: cuentas.value.find(c => c.id === parseInt(form.value.cuentaOrigen)),
    destino: destinatario.value.cuentas.find(c => c.numero === form.value.cuentaDestino),
    monto: parseFloat(form.value.monto),
    fecha: new Date().toLocaleString(),
    codigo: `TRF-${Math.floor(Math.random() * 1000000)}`,
    destinatario: destinatario.value.full_name
  }
  
  router.push({
    name: 'ComprobanteTransferencia',
    params: { id: comprobante.codigo },
    state: { comprobante }
  })
}

async function enviarTransferencia() {
  const origen = cuentas.value.find(c => c.id === parseInt(form.value.cuentaOrigen))
  const monto = parseFloat(form.value.monto)
  const modal = new bootstrap.Modal(document.getElementById('transferResultModal'))

  if (origen.saldo < monto) {
    transferSuccess.value = false
    transferMessage.value = 'Saldo insuficiente para realizar la transferencia.'
    modal.show()
    return
  }

  try {
    origen.saldo -= monto
    const cuentaDestino = destinatario.value.cuentas.find(c => c.numero === form.value.cuentaDestino)
    cuentaDestino.saldo += monto

    const transfer = {
      id: Math.floor(Math.random() * 1000000),
      origin_account_id: form.value.cuentaOrigen,
      destination_account_number: form.value.cuentaDestino,
      destination_bank: 'propio', // Cambiar a otro banco si es externo
      amount: monto,
      transfer_date: new Date().toISOString(),
      status: 'completado'
    }

    transferSuccess.value = true
    transferMessage.value = 'Transferencia realizada con éxito.'
    modal.show()

    // Limpiar formulario
    form.value.monto = ''
    form.value.cuentaOrigen = null
    form.value.cuentaDestino = ''
    form.value.identificador = ''
    destinatario.value = null
  } catch (error) {
    transferSuccess.value = false
    transferMessage.value = 'Error al procesar la transferencia. Intente nuevamente.'
    modal.show()
  }
}

// Verificar número de cuentas al montar el componente
onMounted(() => {
  if (cuentas.value.length <= 1) {
    const modal = new bootstrap.Modal(document.getElementById('singleAccountModal'))
    modal.show()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.transferencias-app {
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
}

/* Estilos de los modales */
.modal-content {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(61, 237, 151, 0.3);
  color: #fff;
}

.modal-header {
  border-bottom: 1px solid rgba(61, 237, 151, 0.2);
}

.modal-title {
  color: #3ded97;
}

.modal-body {
  color: #a0a8c0;
}

.modal-footer {
  border-top: 1px solid rgba(61, 237, 151, 0.2);
}

.btn-close {
  filter: invert(1);
}

.text-danger {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 5px;
}

/* Estilos principales */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
  z-index: 10;
}
.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-3px);
}

.hero {
  padding: 60px 20px 40px;
  text-align: center;
  position: relative;
  width: 100%;
  max-width: 1000px;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3ded97, transparent);
}

.titulo {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #3ded97, #2fa8f8);
  -webkit-background-clip: text;
  background-clip: text; 
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(61, 237, 151, 0.3);
  letter-spacing: 1px;
}

.descripcion {
  font-size: 1.2rem;
  color: #a0a8c0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.transferencia-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
}

.accounts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  width: 100%;
}

.accounts-column {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #3ded97;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card-accion {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(61, 237, 151, 0.1);
  position: relative;
  overflow: hidden;
}

.card-accion::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(61, 237, 151, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}

.card-accion:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(61, 237, 151, 0.15);
  border-color: rgba(61, 237, 151, 0.3);
}

.card-accion:hover::before {
  opacity: 0.5;
}

.selected-origin {
  border: 2px solid #3ded97 !important;
  background: rgba(61, 237, 151, 0.1) !important;
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.2) !important;
}

.icono-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
}

.icono {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s;
}

.icono i {
  color: white;
}

.account-icon-savings {
  background: linear-gradient(135deg, #3ded97, #2a9d8f);
}

.account-icon-current {
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
}

.glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(15px);
  transition: all 0.3s;
}

.glow-blue { background-color: #4361ee; }
.glow-green { background-color: #3ded97; }

.card-accion h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #fff;
}

.descripcion-card {
  font-size: 0.9rem;
  color: #a0a8c0;
  margin-bottom: 5px;
}

.card-accion small {
  font-size: 0.8rem;
  color: #6b7280;
}

.form-section {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.transfer-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 1.2rem;
  color: #fff;
  display: flex;
  align-items: center;
  font-weight: bold;
  gap: 10px;
}

.input-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.input-group-text {
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  height: 45px;
  display: flex;
  align-items: center;
}

.form-control {
  flex: 1;
  height: 45px;
  padding: 0 15px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.3);
}

.buttons-group {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-accion, .btn-comprobante {
   padding: 12px 25px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2a9d8f);
  color: #fff;
}

.btn-accion:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(61, 237, 151, 0.4);
}

.btn-accion:disabled {
  background: #6b7280;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-comprobante {
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: #fff;
}

.btn-comprobante:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.4);
}

.footer {
  margin-top: 50px;
  padding: 20px 0;
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

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
  }
}

@media (max-width: 992px) {
  .accounts-section {
    grid-template-columns: 1fr;
  }
  
  .transferencia-content {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .buttons-group {
    flex-direction: column;
  }
  
  .hero {
    padding: 40px 20px 30px;
  }
  
  .titulo {
    font-size: 2rem;
  }
  
  .descripcion {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .back-button {
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    font-size: 0.9rem;
  }
  
  .form-section, .accounts-column {
    padding: 20px 15px;
  }
  
  .card-accion {
    padding: 15px;
  }
}
</style>