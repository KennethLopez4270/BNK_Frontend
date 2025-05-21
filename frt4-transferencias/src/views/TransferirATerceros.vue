<template>
  <div class="transferencias-app">

    <section class="hero">
      <h1 class="titulo">Transferencia a terceros</h1>
      <p class="descripcion">
        Ingresa los datos del destinatario y el monto para realizar tu transferencia
      </p>
    </section>

    <div class="transferencia-content">
      <!-- Sección de cuentas -->
      <div class="accounts-section">
        <div class="accounts-column">
          <h5 class="section-title">
            <i class="bi bi-arrow-up-circle"></i> Cuenta origen
          </h5>
          <div class="cards-container">
            <div
              class="card-accion"
              v-for="cuenta in cuentas"
              :key="'origen-' + cuenta.id"
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

        <div class="accounts-column">
          <h5 class="section-title">
            <i class="bi bi-arrow-down-circle"></i> Cuenta destino
          </h5>
          <div class="form-group">
            <label for="identificador" class="form-label">
              <i class="bi bi-search"></i> Buscar por número de cuenta
            </label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                id="identificador"
                v-model="form.identificador"
                placeholder="Ej: ACC8001"
              />
            </div>
            <small v-if="errorIdentificador" class="text-danger">{{ errorIdentificador }}</small>
          </div>
          <div class="cards-container">
            <div
              class="card-accion"
              v-for="cuenta in cuentasDestinoFiltradas"
              :key="'destino-' + cuenta.id"
              :class="{ 'selected-destination': form.cuentaDestino === cuenta.numero }"
              @click="selectCuentaDestino(cuenta.numero)"
            >
              <div class="icono-wrapper">
                <div class="icono" :class="accountTypeClass(cuenta.tipo)">
                  <i :class="accountTypeIcon(cuenta.tipo)"></i>
                </div>
                <div class="glow" :class="glowColor(cuenta.tipo)"></div>
              </div>
              <h3>{{ cuenta.tipo.toUpperCase() }} - {{ formatAccountNumber(cuenta.numero) }}</h3>
              <p class="descripcion-card">Saldo: Bs {{ cuenta.saldo.toFixed(2) }}</p>
              <small>ID: {{ cuenta.id }} | Cliente: {{ cuenta.clienteNombre }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de transferencia -->
      <div class="form-section">
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

    <footer class="footer">
      © 2025 Banco Digital. Todos los derechos reservados.
    </footer>

    <!-- Modal para error de cuentas -->
    <div
      class="modal fade"
      id="singleAccountModal"
      tabindex="-1"
      aria-labelledby="singleAccountModalLabel"
      :inert="modalInert"
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
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            No se encontraron cuentas válidas para realizar la transferencia.
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
      :inert="modalInert"
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
              @click="closeModal"
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
              @click="closeModal"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Efecto de partículas -->
    <div class="bg-particles">
      <div v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'animate.css'
import * as bootstrap from 'bootstrap'

const router = useRouter()
const clientId = 1
const accountServiceUrl = 'http://localhost:8082/api/accounts'
const clientServiceUrl = 'http://localhost:8081/api/clients'
const transferServiceUrl = 'http://localhost:8084/api/transfers'

const cuentas = ref([])
const cuentasDestino = ref([])
const form = ref({
  cuentaOrigen: null,
  cuentaDestino: null,
  monto: '',
  identificador: ''
})
const errorIdentificador = ref('')
const transferSuccess = ref(false)
const transferMessage = ref('')
const modalInert = ref(true)

const formValido = computed(() => {
  const destinoAccount = cuentasDestino.value.find(c => c.numero === form.value.cuentaDestino)
  return (
    form.value.cuentaOrigen &&
    form.value.cuentaDestino &&
    form.value.monto &&
    parseFloat(form.value.monto) > 0 &&
    destinoAccount &&
    cuentas.value.find(c => c.id === form.value.cuentaOrigen)?.id !== destinoAccount.id
  )
})

const cuentasDestinoFiltradas = computed(() => {
  const search = form.value.identificador.trim().toLowerCase()
  if (!search) return cuentasDestino.value
  return cuentasDestino.value.filter(cuenta =>
    cuenta.numero.toLowerCase().includes(search)
  )
})

function formatAccountNumber(numero) {
  return numero.replace(/(\d{4})(\d{4})/, '$1-$2')
}

function accountTypeClass(tipo) {
  return tipo && tipo.toLowerCase().includes('ahorro') ? 'account-icon-savings' : 'account-icon-current'
}

function accountTypeIcon(tipo) {
  return tipo && tipo.toLowerCase().includes('ahorro') ? 'bi bi-piggy-bank' : 'bi bi-wallet2'
}

function glowColor(tipo) {
  return tipo && tipo.toLowerCase().includes('ahorro') ? 'glow-green' : 'glow-blue'
}

function particleStyle(i) {
  return {
    width: `${Math.random() * 10 + 5}px`,
    height: `${Math.random() * 10 + 5}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${Math.random() * 20 + 10}s`
  }
}

function selectCuentaOrigen(id) {
  form.value.cuentaOrigen = id
  form.value.cuentaDestino = null
}

function selectCuentaDestino(numero) {
  form.value.cuentaDestino = numero
}

function volver() {
  router.go(-1)
}

function closeModal() {
  modalInert.value = true
}

async function generarComprobante() {
  try {
    const origen = cuentas.value.find(c => c.id === parseInt(form.value.cuentaOrigen))
    const destino = cuentasDestino.value.find(c => c.numero === form.value.cuentaDestino)
    const comprobante = {
      id: `TRF-${Math.floor(Math.random() * 1000000)}`,
      origen: origen ? origen.numero : 'Desconocido',
      destino: form.value.cuentaDestino || 'Desconocido',
      banco: 'propio',
      monto: parseFloat(form.value.monto) || 0,
      fecha: new Date().toLocaleString(),
      estado: 'completado',
      destinatario: destino ? destino.clienteNombre : 'Desconocido'
    }
    
    router.push({
      name: 'ComprobanteTransferencia',
      params: { id: comprobante.id },
      state: { comprobante }
    })
  } catch (error) {
    console.error('Error al generar comprobante:', error)
  }
}

async function enviarTransferencia() {
  const modal = new bootstrap.Modal(document.getElementById('transferResultModal'))
  const monto = parseFloat(form.value.monto)
  const destinoAccount = cuentasDestino.value.find(c => c.numero === form.value.cuentaDestino)
  const destinoAccountId = destinoAccount ? destinoAccount.id : null

  if (!destinoAccountId) {
    transferSuccess.value = false
    transferMessage.value = 'Cuenta destino no encontrada.'
    modalInert.value = false
    modal.show()
    return
  }

  try {
    modalInert.value = false
    const origen = cuentas.value.find(c => c.id === parseInt(form.value.cuentaOrigen))
    if (!origen || origen.saldo < monto) {
      transferSuccess.value = false
      transferMessage.value = 'Saldo insuficiente en la cuenta origen.'
      modal.show()
      return
    }

    // Realizar retiro y depósito
    const [withdrawResponse, depositResponse] = await Promise.all([
      fetch(`${accountServiceUrl}/${form.value.cuentaOrigen}/withdraw?amount=${monto}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(`${accountServiceUrl}/${destinoAccountId}/deposit?amount=${monto}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
    ])

    // Verificar respuestas de retiro y depósito
    if (!withdrawResponse.ok) {
      throw new Error(`Error en retiro: HTTP ${withdrawResponse.status}`)
    }
    if (!depositResponse.ok) {
      throw new Error(`Error en depósito: HTTP ${depositResponse.status}`)
    }

    const withdrawData = await withdrawResponse.json()
    const depositData = await depositResponse.json()

    // Guardar la transferencia
    const transferData = {
      originAccountId: form.value.cuentaOrigen,
      destinationAccountNumber: form.value.cuentaDestino,
      destinationBank: 'propio',
      amount: monto,
      status: 'completado'
    }

    const transferResponse = await fetch(transferServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transferData)
    })

    if (!transferResponse.ok) {
      throw new Error(`Error al registrar la transferencia: HTTP ${transferResponse.status}`)
    }

    const transfer = await transferResponse.json()
    console.log('Transferencia registrada:', transfer)

    // Actualizar saldos localmente
    cuentas.value = cuentas.value.map(c => {
      if (c.id === parseInt(form.value.cuentaOrigen)) {
        return { ...c, saldo: parseFloat(withdrawData.balance) }
      }
      return c
    })
    cuentasDestino.value = cuentasDestino.value.map(c => {
      if (c.id === destinoAccountId) {
        return { ...c, saldo: parseFloat(depositData.balance) }
      }
      return c
    })

    transferSuccess.value = true
    transferMessage.value = 'Transferencia realizada con éxito.'
    modal.show()

    // Limpiar formulario
    form.value.monto = ''
    form.value.cuentaOrigen = null
    form.value.cuentaDestino = ''
    form.value.identificador = ''
  } catch (error) {
    transferSuccess.value = false
    if (error.message.includes('400')) {
      transferMessage.value = error.message.includes('registrar') 
        ? 'Error al registrar la transferencia.'
        : 'Saldo insuficiente o monto inválido.'
    } else if (error.message.includes('404')) {
      transferMessage.value = 'Una de las cuentas no fue encontrada.'
    } else {
      transferMessage.value = 'Error al procesar la transferencia. Intente nuevamente.'
    }
    modal.show()
    console.error('Error en la transferencia:', error)
  }
}

async function fetchCuentasUsuario() {
  console.log('Iniciando carga de cuentas para clientId:', clientId)
  try {
    const response = await fetch(`${accountServiceUrl}/client/${clientId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('Cuentas crudas del backend:', data)
    
    cuentas.value = data.map(c => ({
      id: c.id,
      numero: c.accountNumber,
      tipo: c.accountType.toLowerCase(),
      saldo: parseFloat(c.balance)
    }))
    
    console.log('Cuentas mapeadas:', cuentas.value)

    if (cuentas.value.length === 0) {
      console.warn('No se encontraron cuentas válidas')
      throw new Error('No se encontraron cuentas válidas')
    }
  } catch (error) {
    console.error('Error al cargar cuentas:', error)
    modalInert.value = false
    const modal = new bootstrap.Modal(document.getElementById('singleAccountModal'))
    modal.show()
    cuentas.value = [
      { id: 1, numero: '10010001', tipo: 'ahorro', saldo: 1500.50 },
      { id: 2, numero: '10010002', tipo: 'corriente', saldo: 980.00 }
    ]
    console.log('Usando datos simulados debido a error:', cuentas.value)
  }
}

async function fetchCuentasDestino() {
  console.log('Iniciando carga de cuentas destino')
  try {
    const clientsResponse = await fetch(clientServiceUrl)
    if (!clientsResponse.ok) {
      throw new Error(`HTTP error! status: ${clientsResponse.status}`)
    }
    const clients = await clientsResponse.json()
    console.log('Clientes crudos del backend:', clients)
    
    const accounts = []
    for (const client of clients.filter(c => c.id !== clientId)) {
      try {
        const accountsResponse = await fetch(`${accountServiceUrl}/client/${client.id}`)
        if (!accountsResponse.ok) {
          console.warn(`No se encontraron cuentas para el cliente ${client.id}`)
          continue
        }
        const clientAccounts = await accountsResponse.json()
        console.log(`Cuentas para cliente ${client.id}:`, clientAccounts)
        accounts.push(...clientAccounts.map(a => ({
          id: a.id,
          numero: a.accountNumber,
          tipo: a.accountType.toLowerCase(),
          saldo: parseFloat(a.balance),
          clienteId: client.id,
          clienteNombre: client.fullName,
          clienteDocumento: client.documentNumber,
          clienteEmail: client.email
        })))
      } catch (error) {
        console.warn(`Error al cargar cuentas para el cliente ${client.id}:`, error)
      }
    }
    
    cuentasDestino.value = accounts
    console.log('Cuentas destino cargadas:', cuentasDestino.value)
    
    if (cuentasDestino.value.length === 0) {
      console.warn('No se encontraron cuentas destino válidas')
      errorIdentificador.value = 'No se encontraron cuentas destino.'
      cuentasDestino.value = [
        {
          id: 3,
          numero: '10020001',
          tipo: 'ahorro',
          saldo: 500.00,
          clienteId: 2,
          clienteNombre: 'Selina Kyle',
          clienteDocumento: '87654321',
          clienteEmail: 'selina@example.com'
        },
        {
          id: 4,
          numero: '10020002',
          tipo: 'corriente',
          saldo: 1200.00,
          clienteId: 2,
          clienteNombre: 'Selina Kyle',
          clienteDocumento: '87654321',
          clienteEmail: 'selina@example.com'
        }
      ]
      console.log('Usando datos simulados de cuentas destino:', cuentasDestino.value)
    }
  } catch (error) {
    console.error('Error al cargar cuentas destino:', error)
    errorIdentificador.value = 'Error al cargar datos de cuentas destino.'
    cuentasDestino.value = [
      {
        id: 3,
        numero: '10020001',
        tipo: 'ahorro',
        saldo: 500.00,
        clienteId: 2,
        clienteNombre: 'Selina Kyle',
        clienteDocumento: '87654321',
        clienteEmail: 'selina@example.com'
      },
      {
        id: 4,
        numero: '10020002',
        tipo: 'corriente',
        saldo: 1200.00,
        clienteId: 2,
        clienteNombre: 'Selina Kyle',
        clienteDocumento: '87654321',
        clienteEmail: 'selina@example.com'
      }
    ]
    console.log('Usando datos simulados de cuentas destino debido a error:', cuentasDestino.value)
  }
}

onMounted(async () => {
  await fetchCuentasUsuario()
  await fetchCuentasDestino()
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
  overflow-x: hidden;
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

.selected-destination {
  border: 2px solid #2fa8f8 !important;
  background: rgba(47, 168, 248, 0.1) !important;
  box-shadow: 0 0 15px rgba(47, 168, 248, 0.2) !important;
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
  font-size: 1.1rem;
  color: #fff;
  display: flex;
  align-items: center;
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

.text-danger {
  color: #ff6b6b;
  font-size: 0.9rem;
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

.bg-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.particle {
  position: absolute;
  background: rgba(61, 237, 151, 0.3);
  border-radius: 50%;
  animation: float linear infinite;
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