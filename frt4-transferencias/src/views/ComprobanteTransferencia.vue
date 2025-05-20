<template>
  <div class="transferencias-app">
    <!-- Botón de volver con animación (oculto al imprimir) -->
    <button 
      @click="volver" 
      class="back-button animate__animated animate__fadeIn no-print"
      @mousedown="pulseAnimation"
      style="animation-delay: 0.1s"
    >
      <i class="bi bi-arrow-left"></i> Volver
    </button>

    <!-- Sección hero con animaciones -->
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo animate__animated animate__fadeInDown" style="animation-delay: 0.2s">
        Comprobante de Transferencia
      </h1>
      <p 
        class="descripcion animate__animated animate__fadeIn no-print" 
        style="animation-delay: 0.3s"
      >
        Revisa y descarga el comprobante de tu transferencia
      </p>
    </section>

    <div class="transferencia-content">
      <!-- Mostrar indicador de carga -->
      <div v-if="isLoading" class="text-center animate__animated animate__fadeIn">
        <p>Cargando comprobante...</p>
      </div>

      <!-- Mostrar comprobante solo si transferencia no es null -->
      <div v-else-if="transferencia" class="comprobante-section animate__animated animate__zoomIn" ref="comprobanteRef" style="animation-delay: 0.4s">
        <div class="comprobante-header row mb-4">
          <div class="col-md-6 animate__animated animate__fadeInUp" style="animation-delay: 0.5s">
            <p><strong><i class="bi bi-hash"></i> Transferencia N°:</strong> {{ transferencia.id }}</p>
          </div>
          <div class="col-md-6 text-md-end animate__animated animate__fadeInUp" style="animation-delay: 0.6s">
            <p><strong><i class="bi bi-calendar"></i> Fecha:</strong> {{ formatFecha(transferencia.fecha) }}</p>
          </div>
        </div>

        <hr class="divider" />

        <div class="comprobante-details mb-4">
          <div class="comprobante-item animate__animated animate__fadeInUp" style="animation-delay: 0.7s">
            <label class="comprobante-label"><i class="bi bi-arrow-up-circle"></i> Cuenta Origen:</label>
            <div class="comprobante-value">{{ transferencia.origen }}</div>
          </div>
          <div class="comprobante-item animate__animated animate__fadeInUp" style="animation-delay: 0.8s">
            <label class="comprobante-label"><i class="bi bi-arrow-down-circle"></i> Cuenta Destino:</label>
            <div class="comprobante-value">{{ transferencia.destino }}</div>
          </div>
          <div
            class="comprobante-item animate__animated animate__fadeInUp"
            v-if="transferencia.banco !== 'propio'"
            style="animation-delay: 0.9s"
          >
            <label class="comprobante-label"><i class="bi bi-bank"></i> Banco Destino:</label>
            <div class="comprobante-value">{{ transferencia.banco }}</div>
          </div>
          <div class="comprobante-item animate__animated animate__fadeInUp" style="animation-delay: 1.0s">
            <label class="comprobante-label"><i class="bi bi-cash-coin"></i> Monto Transferido:</label>
            <div class="comprobante-value">Bs {{ transferencia.monto.toFixed(2) }}</div>
          </div>
          <div class="comprobante-item animate__animated animate__fadeInUp" style="animation-delay: 1.1s">
            <label class="comprobante-label"><i class="bi bi-info-circle"></i> Estado:</label>
            <div class="comprobante-value">
              <span :class="estadoClass(transferencia.estado)">
                <i :class="estadoIcon(transferencia.estado)"></i>
                {{ transferencia.estado }}
              </span>
            </div>
          </div>
        </div>

        <!-- Botones (ocultos al imprimir) -->
        <div class="buttons-group d-flex justify-content-center gap-3 animate__animated animate__fadeInUp no-print" style="animation-delay: 1.2s">
          <router-link to="/" class="btn btn-secondary" @mousedown="pulseAnimation">
            Volver
          </router-link>
          <button @click="imprimir" class="btn-accion" @mousedown="pulseAnimation">
            Imprimir <i class="bi bi-printer"></i>
          </button>
        </div>
      </div>

      <!-- Modal de error -->
      <div
        class="modal fade"
        id="noTransferenciaModal"
        tabindex="-1"
        aria-labelledby="noTransferenciaModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content animate__animated animate__zoomIn">
            <div class="modal-header">
              <h5 class="modal-title" id="noTransferenciaModalLabel">Error</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              No se encontró la transferencia con el ID especificado.
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="volver"
                data-bs-dismiss="modal"
                @mousedown="pulseAnimation"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer (oculto al imprimir) -->
    <footer class="footer no-print">
      © 2025 Banco Digital. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'animate.css'
import * as bootstrap from 'bootstrap'

const route = useRoute()
const router = useRouter()
const transferenciaId = route.params.id
const transferencia = ref(null)
const isLoading = ref(false)
const transferServiceUrl = 'http://localhost:8084/api/transfers'
const accountServiceUrl = 'http://localhost:8082/api/accounts'

function formatFecha(fechaISO) {
  const fecha = new Date(fechaISO)
  return fecha.toLocaleString('es-BO')
}

function estadoClass(estado) {
  return {
    'estado-badge estado-completado': estado.toLowerCase() === 'completado',
    'estado-badge estado-pendiente': estado.toLowerCase() === 'pendiente',
    'estado-badge estado-fallido': estado.toLowerCase() === 'fallido'
  }
}

function estadoIcon(estado) {
  return {
    'bi bi-check-circle': estado.toLowerCase() === 'completado',
    'bi bi-hourglass-split': estado.toLowerCase() === 'pendiente',
    'bi bi-x-circle': estado.toLowerCase() === 'fallido'
  }
}

function volver() {
  router.push('/')
}

function imprimir() {
  window.print()
}

function pulseAnimation(event) {
  const element = event.target
  element.classList.add('animate__pulse')
  setTimeout(() => {
    element.classList.remove('animate__pulse')
  }, 300)
}

async function getAccountNumber(accountId) {
  try {
    const response = await fetch(`${accountServiceUrl}/${accountId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const account = await response.json()
    return account.accountNumber || 'Desconocido'
  } catch (error) {
    console.error(`Error al obtener número de cuenta para ID ${accountId}:`, error)
    return 'Desconocido'
  }
}

async function fetchTransferencia() {
  isLoading.value = true
  try {
    const response = await fetch(`${transferServiceUrl}/${transferenciaId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('Transferencia cruda del backend:', data)

    const originAccountNumber = await getAccountNumber(data.originAccountId)
    transferencia.value = {
      id: data.id,
      origen: originAccountNumber,
      destino: data.destinationAccountNumber || 'Desconocido',
      banco: data.destinationBank || 'Desconocido',
      monto: data.amount || 0,
      fecha: data.transferDate || new Date().toISOString(),
      estado: data.status || 'pendiente'
    }
    console.log('Transferencia mapeada:', transferencia.value)
  } catch (error) {
    console.error('Error al cargar transferencia:', error)
    const modal = new bootstrap.Modal(document.getElementById('noTransferenciaModal'))
    modal.show()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!transferenciaId || transferenciaId === 'undefined') {
    console.log('ID de transferencia inválido:', transferenciaId)
    const modal = new bootstrap.Modal(document.getElementById('noTransferenciaModal'))
    modal.show()
    return
  }

  const stateTransferencia = route.state?.transferencia
  if (stateTransferencia) {
    console.log('Transferencia recibida desde state:', stateTransferencia)
    transferencia.value = stateTransferencia
  } else {
    console.log('No hay transferencia en state, consultando backend para ID:', transferenciaId)
    fetchTransferencia()
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
  max-width: 800px;
}

.comprobante-section {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  transition: all 0.3s;
}

.comprobante-section:hover {
  box-shadow: 0 10px 20px rgba(61, 237, 151, 0.15);
}

.comprobante-header p {
  font-size: 1.1rem;
  margin: 0;
  color: #fff;
}

.comprobante-header strong {
  color: #3ded97;
  display: flex;
  align-items: center;
  gap: 5px;
}

.divider {
  border-top: 1px solid rgba(61, 237, 151, 0.2);
  margin: 20px 0;
}

.comprobante-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comprobante-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.comprobante-label {
  flex: 0 0 200px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #3ded97;
  display: flex;
  align-items: center;
  gap: 10px;
}

.comprobante-value {
  flex: 1;
  font-size: 1.1rem;
  color: #fff;
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.estado-completado {
  background: rgba(61, 237, 151, 0.2);
  color: #3ded97;
}

.estado-pendiente {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.estado-fallido {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.buttons-group {
  gap: 15px;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 50px;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-accion {
  background: linear-gradient(135deg, #c73ded, #6b2a9d);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-accion:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(164, 61, 237, 0.4);
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
  z-index: -1;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(61, 237, 151, 0.4), transparent);
  border-radius: 50%;
  animation: float 15s infinite ease-in-out;
  pointer-events: none;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
  }
}

/* Estilos para impresión */
@media print {
    .no-print {
    display: none !important;
  }
  .transferencias-app {
    background: white;
    padding: 0;
  }
  
  .back-button, .hero, .footer, .bg-particles {
    display: none;
  }
  
  .transferencia-content {
    max-width: 100%;
  }
  
  .comprobante-section {
    background: white;
    border: 1px solid #000;
    box-shadow: none;
    padding: 20px;
    color: #000;
    padding: 0;
    margin: 0;
    box-shadow: none;
    border: none;
  }
  
  .comprobante-header p,
  .comprobante-value {
    color: #000;
  }
  
  .comprobante-label,
  .comprobante-header strong {
    color: #000;
  }
  
  .divider {
    border-top: 1px solid #000;
  }
   body, html {
    background: white !important;
    color: black !important;
  }
  
  .estado-badge {
    border: 1px solid #000;
    background: none;
  }
  
  .estado-completado {
    color: #000;
  }
  
  .estado-pendiente {
    color: #000;
  }
  
  .estado-fallido {
    color: #000;
  }
  
  .buttons-group {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 20px 30px;
  }
  
  .titulo {
    font-size: 2rem;
  }
  
  .descripcion {
    font-size: 1rem;
  }
  
  .comprobante-section {
    padding: 20px;
  }
  
  .comprobante-label {
    flex: 0 0 150px;
    font-size: 1rem;
  }
  
  .comprobante-value {
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
  
  .comprobante-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .comprobante-label {
    flex: none;
  }
  
  .buttons-group {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn-secondary, .btn-accion {
    width: 100%;
    text-align: center;
  }
}
</style>