<template>
  <div class="transferencias-app">
    <button 
      @click="volver" 
      class="back-button animate__animated animate__fadeIn" 
      @mousedown="pulseAnimation"
      style="animation-delay: 0.1s"
    >
      <i class="bi bi-arrow-left"></i> Volver
    </button>
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo animate__animated animate__fadeInDown" style="animation-delay: 0.2s">
        Historial de Transferencias
      </h1>
      <p 
        class="descripcion animate__animated animate__fadeIn" 
        style="animation-delay: 0.3s"
      >
        Consulta el historial de tus transferencias realizadas
      </p>
    </section>

    <div class="transferencia-content">
      <center>
        <div class="form-section mb-4 d-flex justify-content-center">
          <div class="form-group animate__animated animate__zoomIn" style="animation-delay: 0.4s">
            <label for="filtroTipo" class="form-label">
              <i class="bi bi-funnel"></i> Filtrar por tipo
            </label>
            <select 
              id="filtroTipo" 
              class="form-control" 
              v-model="filtro"
            >
              <option value="">Todos</option>
              <option value="propias">Entre cuentas propias</option>
              <option value="terceros">A terceros</option>
              <option value="interbancaria">A otro banco</option>
            </select>
          </div>
        </div>
      </center>

      <div v-if="transferenciasFiltradas.length > 0" class="table-container animate__animated animate__fadeIn" style="animation-delay: 0.5s">
        <div class="table-responsive">
          <table class="table-custom">
            <thead>
              <tr class="animate__animated animate__fadeIn" style="animation-delay: 0.6s">
                <th>#</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Banco Destino</th>
                <th>Monto (Bs)</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(transferencia, index) in transferenciasFiltradas"
                :key="transferencia.id"
                class="animate__animated animate__fadeInUp"
                :style="{ animationDelay: `${0.7 + (index * 0.1)}s` }"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ transferencia.origen }}</td>
                <td>{{ transferencia.destino }}</td>
                <td>{{ transferencia.banco }}</td>
                <td>{{ transferencia.monto.toFixed(2) }}</td>
                <td>{{ formatFecha(transferencia.fecha) }}</td>
                <td>
                  <span :class="estadoClass(transferencia.estado)">
                    <i :class="estadoIcon(transferencia.estado)"></i>
                    {{ transferencia.estado }}
                  </span>
                </td>
                <td>
                  <router-link
                    :to="`/detalle-transferencia/${transferencia.id}`"
                    class="btn-accion btn-sm"
                    @mousedown="pulseAnimation"
                  >
                    <i class="bi bi-eye"></i> Ver
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="modal fade"
        id="noTransferenciasModal"
        tabindex="-1"
        aria-labelledby="noTransferenciasModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content animate__animated animate__zoomIn">
            <div class="modal-header">
              <h5 class="modal-title" id="noTransferenciasModalLabel">Información</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              No hay transferencias disponibles para mostrar.
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
    <footer class="footer animate__animated animate__fadeIn" style="animation-delay: 0.8s">
      © 2025 Banco Digital. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'animate.css'
import * as bootstrap from 'bootstrap'

const router = useRouter()
const transferencias = ref([
  {
    id: 1,
    origen: '1001-0001',
    destino: '1001-0002',
    banco: 'propio',
    monto: 200.00,
    fecha: '2025-05-16T10:45:00Z',
    estado: 'completado',
    tipo: 'propias'
  },
  {
    id: 2,
    origen: '1001-0001',
    destino: '2002-0005',
    banco: 'propio',
    monto: 100.50,
    fecha: '2025-05-17T13:20:00Z',
    estado: 'completado',
    tipo: 'terceros'
  },
  {
    id: 3,
    origen: '1001-0002',
    destino: '3009-9988',
    banco: 'Banco Mercantil Santa Cruz',
    monto: 350.00,
    fecha: '2025-05-17T18:00:00Z',
    estado: 'pendiente',
    tipo: 'interbancaria'
  }
])

const filtro = ref('')

const transferenciasFiltradas = computed(() => {
  return filtro.value
    ? transferencias.value.filter(t => t.tipo === filtro.value)
    : transferencias.value
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
  router.push('/')
}

// Animación de pulsación para botones
function pulseAnimation(event) {
  const element = event.target
  element.classList.add('animate__pulse')
  setTimeout(() => {
    element.classList.remove('animate__pulse')
  }, 300)
}

// Mostrar modal si no hay transferencias
onMounted(() => {
  if (transferencias.value.length === 0) {
    const modal = new bootstrap.Modal(document.getElementById('noTransferenciasModal'))
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
  max-width: 1200px;
}

.form-section {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.form-label {
  font-size: 1.1rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-control {
  height: 45px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-control:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.3);
  transform: scale(1.02);
}

.table-container {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.table-custom {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #fff;
}

.table-custom th,
.table-custom td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid rgba(61, 237, 151, 0.2);
  vertical-align: middle;
}

.table-custom th {
  background: rgba(61, 237, 151, 0.1);
  font-weight: 600;
  color: #3ded97;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.table-custom tr:last-child td {
  border-bottom: none;
}

.table-custom tr {
  transition: all 0.3s ease;
}

.table-custom tr:hover {
  background: rgba(61, 237, 151, 0.1);
  transform: translateY(-2px);
  filter: brightness(1.1);
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

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2a9d8f);
  color: #fff;
  border: none;
  padding: 8px 15px;
  text-decoration:none;
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
  box-shadow: 0 5px 15px rgba(61, 237, 151, 0.4);
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

@media (max-width: 992px) {
  .transferencia-content {
    gap: 20px;
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
  
  .table-custom th,
  .table-custom td {
    padding: 10px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .back-button {
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    font-size: 0.9rem;
  }
  
  .form-section,
  .table-container {
    padding: 15px;
  }
  
  .table-custom {
    font-size: 0.85rem;
  }
  
  .btn-accion {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
  
  .form-group {
    max-width: 100%;
  }
}
</style>