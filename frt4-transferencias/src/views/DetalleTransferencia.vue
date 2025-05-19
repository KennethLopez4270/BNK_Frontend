<template>
  <div class="transferencias-app">
    <!-- Botón de volver -->
    <button @click="volver" class="back-button animate__animated animate__fadeIn" @mousedown="pulseAnimation">
      <i class="bi bi-arrow-left"></i> Volver
    </button>

    <section class="hero">
      <h1 class="titulo animate__animated animate__fadeInDown">Detalle de Transferencia</h1>
      <p class="descripcion animate__animated animate__fadeIn" :style="{ animationDelay: '0.2s' }">
        Revisa los detalles de tu transferencia
      </p>
    </section>

    <div class="transferencia-content">
      <div class="detalle-section animate__animated animate__zoomIn">
        <div class="detalle-item animate__animated animate__fadeInUp" :style="{ animationDelay: '0.1s' }">
          <label class="detalle-label"><i class="bi bi-hash"></i> ID de Transferencia:</label>
          <div class="detalle-value">{{ transferencia.id }}</div>
        </div>

        <div class="detalle-item animate__animated animate__fadeInUp" :style="{ animationDelay: '0.2s' }">
          <label class="detalle-label"><i class="bi bi-arrow-up-circle"></i> Cuenta Origen:</label>
          <div class="detalle-value">{{ transferencia.origen }}</div>
        </div>

        <div class="detalle-item animate__animated animate__fadeInUp" :style="{ animationDelay: '0.3s' }">
          <label class="detalle-label"><i class="bi bi-arrow-down-circle"></i> Cuenta Destino:</label>
          <div class="detalle-value">{{ transferencia.destino }}</div>
        </div>

        <div
          class="detalle-item animate__animated animate__fadeInUp"
          v-if="transferencia.banco !== 'propio'"
          :style="{ animationDelay: '0.4s' }"
        >
          <label class="detalle-label"><i class="bi bi-bank"></i> Banco Destino:</label>
          <div class="detalle-value">{{ transferencia.banco }}</div>
        </div>

        <div class="detalle-item animate__animated animate__fadeInUp" :style="{ animationDelay: '0.5s' }">
          <label class="detalle-label"><i class="bi bi-cash-coin"></i> Monto Transferido:</label>
          <div class="detalle-value">Bs {{ transferencia.monto.toFixed(2) }}</div>
        </div>

        <div class="detalle-item animate__animated animate__fadeInUp" :style="{ animationDelay: '0.6s' }">
          <label class="detalle-label"><i class="bi bi-calendar"></i> Fecha:</label>
          <div class="detalle-value">{{ formatFecha(transferencia.fecha) }}</div>
        </div>

        <div class="detalle-item animate__animated animate__fadeInUp" :style="{ animationDelay: '0.7s' }">
          <label class="detalle-label"><i class="bi bi-info-circle"></i> Estado:</label>
          <div class="detalle-value">
            <span :class="estadoClass(transferencia.estado)">
              <i :class="estadoIcon(transferencia.estado)"></i>
              {{ transferencia.estado }}
            </span>
          </div>
        </div>

        <div class="buttons-group mt-4 d-flex justify-content-center animate__animated animate__fadeInUp" :style="{ animationDelay: '0.8s' }">
          <router-link
            to="/historial-transferencias"
            class="btn btn-secondary me-2"
            @mousedown="pulseAnimation"
          >
            Volver
          </router-link>
          <router-link
            :to="`/comprobante-transferencia/${transferencia.id}`"
            class="btn-accion btn-comprobante"
            @mousedown="pulseAnimation"
          >
            Ver Comprobante <i class="bi bi-receipt"></i>
          </router-link>
        </div>
      </div>
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

    <footer class="footer">
      © 2025 Banco Digital. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'animate.css'
import * as bootstrap from 'bootstrap'

// Obtener el ID de la transferencia desde la URL
const route = useRoute()
const router = useRouter()
const transferenciaId = route.params.id

// Mock temporal: reemplazar con fetch real
const transferencia = ref({
  id: transferenciaId,
  origen: '1001-0002',
  destino: '3009-9988',
  banco: 'Banco Mercantil Santa Cruz',
  monto: 350.00,
  fecha: '2025-05-17T18:00:00Z',
  estado: 'completado'
})

function formatFecha(fechaISO) {
  const fecha = new Date(fechaISO)
  return fecha.toLocaleString('es-BO')
}

function estadoClass(estado) {
  return {
    'estado-badge estado-completado': estado === 'completado',
    'estado-badge estado-pendiente': estado === 'pendiente',
    'estado-badge estado-fallido': estado === 'fallido'
  }
}

function estadoIcon(estado) {
  return {
    'bi bi-check-circle': estado === 'completado',
    'bi bi-hourglass-split': estado === 'pendiente',
    'bi bi-x-circle': estado === 'fallido'
  }
}

function volver() {
  router.push('/historial-transferencias')
}

// Animación de pulsación para botones
function pulseAnimation(event) {
  const element = event.target
  element.classList.add('animate__pulse')
  setTimeout(() => {
    element.classList.remove('animate__pulse')
  }, 300)
}
onMounted(() => {
  // Simulación: en el backend, harías un fetch a /api/transfers/:id
  if (!transferenciaId || transferenciaId === 'undefined') {
    const modal = new bootstrap.Modal(document.getElementById('noTransferenciaModal'))
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

.detalle-section {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  transition: all 0.3s;
}

.detalle-section:hover {
  box-shadow: 0 10px 20px rgba(61, 237, 151, 0.15);
}

.detalle-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(61, 237, 151, 0.1);
}

.detalle-item:last-child {
  border-bottom: none;
}

.detalle-label {
  flex: 0 0 200px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #3ded97;
  display: flex;
  align-items: center;
  gap: 10px;
}

.detalle-value {
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

.btn-accion, .btn-comprobante {
   padding: 12px 25px;
  border: none;
  border-radius: 50px;
  text-decoration:none;
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
  
  .detalle-section {
    padding: 20px;
  }
  
  .detalle-label {
    flex: 0 0 150px;
    font-size: 1rem;
  }
  
  .detalle-value {
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
  
  .detalle-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .detalle-label {
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