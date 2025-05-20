<template>
  <div class="extraer-dinero-app">
    <button @click="volver" class="back-button animate__animated animate__fadeIn">
      <i class="bi bi-arrow-left"></i> Volver
    </button>
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Extraer Dinero</h1>
      <p class="descripcion">
        Busca una cuenta, revisa su saldo y realiza una extracción
      </p>
    </section>

    <!-- Buscador de cuentas -->
    <section class="filtros animate__animated animate__fadeIn" style="animation-delay: 0.1s">
      <div class="filtros-container">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
            type="text"
            v-model="busqueda"
            class="form-control"
            placeholder="Buscar por número de cuenta, nombre o ID de cliente..."
          />
        </div>
      </div>
    </section>

    <!-- Mensaje de carga o error -->
    <div v-if="loading" class="cargando animate__animated animate__fadeIn">Cargando cuentas...</div>
    <div v-if="error" class="error animate__animated animate__fadeIn">{{ error }}</div>

    <!-- Lista de cuentas filtradas -->
    <section class="lista-cuentas" v-else>
      <div v-if="cuentasFiltradas.length">
        <div 
          class="card-accion animate__animated animate__fadeInUp"
          v-for="(cuenta, index) in cuentasFiltradas"
          :key="cuenta.id"
          :style="`animation-delay: ${index * 0.1}s`"
          @click="seleccionarCuenta(cuenta)"
          :class="{ 'selected-origin': cuentaSeleccionada?.id === cuenta.id }"
        >
          <div class="icono-wrapper">
            <div class="icono account-icon-savings">
              <i class="bi bi-bank"></i>
            </div>
            <div class="glow glow-green"></div>
          </div>
          <h3>{{ cuenta.clientName || 'Desconocido' }}</h3>
          <p class="descripcion-card">{{ cuenta.accountNumber }}</p>
          <p class="saldo-cuenta">Saldo: ${{ cuenta.balance.toFixed(2) }}</p>
          <small>ID Cliente: {{ cuenta.clientId }}</small>
        </div>
      </div>

      <div v-else class="sin-resultados animate__animated animate__fadeIn">
        No se encontraron cuentas.
      </div>
    </section>

    <!-- Formulario de extracción -->
    <section v-if="cuentaSeleccionada" class="form-section animate__animated animate__fadeIn" style="animation-delay: 0.2s">
      <div class="formulario-container">
        <h2 class="subtitulo">Cuenta seleccionada: {{ cuentaSeleccionada.accountNumber }}</h2>
        
        <div class="info-cliente">
          <p><strong>Cliente:</strong> {{ cuentaSeleccionada.clientName || 'Desconocido' }}</p>
          <p><strong>Saldo actual:</strong> ${{ cuentaSeleccionada.balance.toFixed(2) }}</p>
        </div>

        <form @submit.prevent="extraerDinero" class="transfer-form">
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-cash-coin"></i> Monto a Extraer
            </label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input
                type="number"
                v-model.number="form.amount"
                class="form-control"
                placeholder="Ej. 100.00"
                step="0.01"
                min="0"
                :max="cuentaSeleccionada.balance"
                required
              />
            </div>
            <div class="saldo-disponible">
              Máximo disponible: ${{ cuentaSeleccionada.balance.toFixed(2) }}
            </div>
          </div>

          <div class="buttons-group">
            <button 
              type="submit" 
              class="btn-accion" 
              :disabled="loading"
            >
              <i class="bi bi-cash-stack"></i> {{ loading ? 'Procesando...' : 'Confirmar Extracción' }}
            </button>
            <button
              @click.prevent="exportarPDF"
              class="btn-comprobante"
              :disabled="loading"
            >
              <i class="bi bi-file-earmark-pdf"></i> Exportar en PDF
            </button>
          </div>
        </form>

        <div v-if="mensaje" :class="['mensaje', mensajeError ? 'error' : 'exito']">
          {{ mensaje }}
        </div>
      </div>
    </section>

    <footer class="footer animate__animated animate__fadeIn" style="animation-delay: 0.3s">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import jsPDF from 'jspdf';
import { useRouter } from 'vue-router';
import 'animate.css';
import * as bootstrap from 'bootstrap';

const router = useRouter();
const cuentas = ref([]);
const clientes = ref([]);
const cuentaSeleccionada = ref(null);
const busqueda = ref('');
const form = ref({ amount: '' });
const mensaje = ref('');
const mensajeError = ref(false);
const loading = ref(false);
const error = ref(null);

// Obtener lista de clientes
const fetchClientes = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/clients');
    if (!response.ok) throw new Error('Error al obtener clientes');
    clientes.value = await response.json();
  } catch (err) {
    console.error('Error al cargar clientes:', err);
  }
};

// Obtener cuentas y asociar nombres de clientes
const fetchCuentas = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await fetch('http://localhost:8082/api/accounts', {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173',
      },
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const cuentasData = await response.json();

    // Asignar nombre del cliente a cada cuenta
    cuentas.value = cuentasData.map((cuenta) => {
      const cliente = clientes.value.find((c) => c.id === cuenta.clientId);
      return {
        ...cuenta,
        clientName: cliente ? cliente.fullName : null,
      };
    });
  } catch (err) {
    error.value = 'Error al cargar las cuentas: ' + err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchClientes();
  await fetchCuentas();
});

const cuentasFiltradas = computed(() => {
  if (!busqueda.value.trim()) return cuentas.value;
  const filtro = busqueda.value.toLowerCase();
  return cuentas.value.filter(
    (c) =>
      (c.accountNumber && c.accountNumber.toLowerCase().includes(filtro)) ||
      (c.clientName && c.clientName.toLowerCase().includes(filtro)) ||
      (c.clientId && c.clientId.toString().includes(filtro))
  );
});

const seleccionarCuenta = (cuenta) => {
  cuentaSeleccionada.value = { ...cuenta };
  mensaje.value = '';
  mensajeError.value = false;
  form.value.amount = '';
};

const extraerDinero = async () => {
  const monto = form.value.amount;
  if (monto <= 0) {
    mensaje.value = 'El monto debe ser mayor que cero.';
    mensajeError.value = true;
    return;
  }
  if (monto > cuentaSeleccionada.value.balance) {
    mensaje.value = 'El monto excede el saldo disponible.';
    mensajeError.value = true;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    const response = await fetch(
      `http://localhost:8082/api/accounts/${cuentaSeleccionada.value.id}/withdraw?amount=${monto}`,
      {
        method: 'PATCH',
        headers: {
          'Origin': 'http://localhost:5173',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const updatedCuenta = await response.json();
    const index = cuentas.value.findIndex((c) => c.id === cuentaSeleccionada.value.id);
    if (index !== -1) {
      cuentas.value[index] = {
        ...updatedCuenta,
        clientName: cuentaSeleccionada.value.clientName, // mantener el nombre
      };
    }

    cuentaSeleccionada.value = {
      ...updatedCuenta,
      clientName: cuentaSeleccionada.value.clientName,
    };

    mensaje.value = `Extracción de $${monto.toFixed(2)} realizada con éxito. Saldo restante: $${updatedCuenta.balance.toFixed(2)}.`;
    mensajeError.value = false;
    form.value.amount = '';
  } catch (err) {
    mensaje.value =
      err.message.includes('400')
        ? 'Monto inválido. Verifica e intenta nuevamente.'
        : err.message || 'Error al realizar la extracción.';
    mensajeError.value = true;
  } finally {
    loading.value = false;
  }
};

const exportarPDF = () => {
  if (!cuentaSeleccionada.value) {
    mensaje.value = 'Selecciona una cuenta para exportar.';
    mensajeError.value = true;
    return;
  }

  const doc = new jsPDF();
  const date = new Date().toLocaleString();

  doc.setFontSize(16);
  doc.text('Comprobante de Extracción', 20, 20);

  doc.setFontSize(12);
  doc.text(`Cliente: ${cuentaSeleccionada.value.clientName || 'Desconocido'}`, 20, 40);
  doc.text(`Número de Cuenta: ${cuentaSeleccionada.value.accountNumber}`, 20, 50);
  doc.text(`Saldo Actual: $${cuentaSeleccionada.value.balance.toFixed(2)}`, 20, 60);
  doc.text(`Fecha: ${date}`, 20, 70);

  doc.save('comprobante_extraccion.pdf');
  mensaje.value = 'PDF generado con la información de extracción.';
  mensajeError.value = false;
};

const volver = () => router.push('/');
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.extraer-dinero-app {
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

.filtros {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 30px;
}

.filtros-container {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(61, 237, 151, 0.1);
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

.lista-cuentas {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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

.saldo-cuenta {
  font-size: 1rem;
  font-weight: 600;
  color: #3ded97;
  margin: 10px 0;
}

.card-accion small {
  font-size: 0.8rem;
  color: #6b7280;
}

.sin-resultados {
  text-align: center;
  padding: 30px;
  color: #a0a8c0;
  font-size: 1.1rem;
  grid-column: 1 / -1;
}

.cargando {
  text-align: center;
  padding: 30px;
  color: #a0a8c0;
  font-size: 1.1rem;
}

.error {
  text-align: center;
  padding: 30px;
  color: #ff6b6b;
  font-size: 1.1rem;
}

.form-section {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  width: 100%;
  max-width: 600px;
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

.subtitulo {
  font-size: 1.8rem;
  color: #3ded97;
  margin-bottom: 20px;
  text-align: center;
}

.info-cliente {
  margin-bottom: 30px;
  background: rgba(15, 23, 42, 0.3);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.info-cliente p {
  margin-bottom: 10px;
  color: #fff;
}

.info-cliente strong {
  color: #3ded97;
}

.saldo-disponible {
  font-size: 0.9rem;
  color: #a0a8c0;
  margin-top: 5px;
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

@media (max-width: 992px) {
  .lista-cuentas {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
  
  .form-section, .filtros-container {
    padding: 20px 15px;
  }
  
  .card-accion {
    padding: 15px;
  }
}
</style>
