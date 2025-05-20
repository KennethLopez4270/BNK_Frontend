<template>
  <div class="depositar-dinero">
    <button @click="volver" class="back-button animate__animated animate__fadeIn">
      <i class="bi bi-arrow-left"></i> Volver
    </button>
    
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Depositar Dinero</h1>
      <p class="descripcion">
        Busca una cuenta, revisa su saldo y realiza un depósito
      </p>
    </section>

    <!-- Buscador de cuentas -->
    <section class="buscador animate__animated animate__fadeIn" style="animation-delay: 0.1s">
      <div class="input-group">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
          type="text"
          v-model="busqueda"
          class="form-control"
          placeholder="Buscar por número de cuenta, nombre o documento..."
        />
      </div>
    </section>

    <!-- Mensaje de carga o error -->
    <div v-if="loading" class="cargando animate__animated animate__fadeIn">
      <div class="spinner"></div>
      Cargando cuentas...
    </div>
    <div v-if="error" class="error animate__animated animate__shakeX">
      <i class="bi bi-exclamation-triangle"></i> {{ error }}
    </div>

    <!-- Lista de cuentas filtradas -->
    <section class="lista-cuentas animate__animated animate__fadeIn" style="animation-delay: 0.2s" v-else>
      <div v-if="cuentasFiltradas.length" class="cuentas-grid">
        <div
          v-for="(cuenta, index) in cuentasFiltradas"
          :key="cuenta.id"
          class="cuenta-card animate__animated animate__fadeInUp"
          :style="`animation-delay: ${index * 0.1}s`"
          @click="seleccionarCuenta(cuenta)"
        >
          <div class="cuenta-info">
            <h3>{{ cuenta.clientName || 'Desconocido' }}</h3>
            <p class="numero-cuenta">{{ cuenta.accountNumber }}</p>
            <p class="documento">Cliente ID: {{ cuenta.clientId }}</p>
          </div>
          <div class="saldo">
            <span class="badge-saldo">${{ cuenta.balance.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="sin-resultados animate__animated animate__fadeIn">
        <i class="bi bi-search"></i>
        <p>No se encontraron cuentas</p>
      </div>
    </section>

    <!-- Formulario de depósito -->
    <section v-if="cuentaSeleccionada" class="formulario-deposito animate__animated animate__fadeInUp">
      <div class="formulario-container">
        <h2 class="subtitulo">
          <i class="bi bi-cash-stack"></i> Depósito a cuenta: {{ cuentaSeleccionada.accountNumber }}
        </h2>

        <div class="info-cliente">
          <p><span>Cliente:</span> {{ cuentaSeleccionada.clientName || 'Desconocido' }}</p>
          <p><span>Saldo actual:</span> ${{ cuentaSeleccionada.balance.toFixed(2) }}</p>
        </div>

        <form @submit.prevent="depositarDinero" class="form-deposito">
          <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.1s">
            <label class="form-label"><i class="bi bi-currency-dollar"></i> Monto a Depositar</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input
                type="number"
                v-model.number="form.amount"
                class="form-control"
                placeholder="Ej. 100.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div class="botones-form animate__animated animate__fadeIn" style="animation-delay: 0.2s">
            <button type="submit" class="btn-depositar" :disabled="loading">
              <i class="bi bi-check-circle"></i> {{ loading ? 'Procesando...' : 'Confirmar Depósito' }}
            </button>
            <button
              type="button"
              @click.prevent="exportarPDF"
              class="btn-secundario"
              :disabled="loading"
            >
              <i class="bi bi-file-earmark-pdf"></i> Exportar en PDF
            </button>
          </div>
        </form>

        <div v-if="mensaje" :class="['mensaje', { 'mensaje-error': mensajeError }]" class="animate__animated animate__fadeIn">
          <i :class="mensajeError ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
          {{ mensaje }}
        </div>
      </div>
    </section>

    <footer class="footer animate__animated animate__fadeIn">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import jsPDF from 'jspdf';
import { useRouter } from 'vue-router';
import 'animate.css';

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

// Cargar clientes
const fetchClientes = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/clients');
    if (!response.ok) throw new Error('Error al obtener clientes');
    clientes.value = await response.json();
  } catch (err) {
    console.error('Error al cargar clientes:', err);
  }
};

// Cargar cuentas y asociar nombres de clientes
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

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const cuentasData = await response.json();

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

const depositarDinero = async () => {
  const monto = form.value.amount;
  if (monto <= 0) {
    mensaje.value = 'El monto debe ser mayor que cero.';
    mensajeError.value = true;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    const response = await fetch(
      `http://localhost:8082/api/accounts/${cuentaSeleccionada.value.id}/deposit?amount=${monto}`,
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
    const cliente = clientes.value.find(c => c.id === updatedCuenta.clientId);

    const cuentaConNombre = {
      ...updatedCuenta,
      clientName: cliente ? cliente.fullName : null,
    };

    const index = cuentas.value.findIndex((c) => c.id === cuentaSeleccionada.value.id);
    if (index !== -1) {
      cuentas.value[index] = cuentaConNombre;
    }

    cuentaSeleccionada.value = cuentaConNombre;

    mensaje.value = `Depósito de $${monto.toFixed(2)} realizado con éxito. Nuevo saldo: $${updatedCuenta.balance.toFixed(2)}.`;
    mensajeError.value = false;
    form.value.amount = '';
  } catch (err) {
    mensaje.value =
      err.message.includes('400')
        ? 'Monto inválido. Verifica e intenta nuevamente.'
        : err.message || 'Error al realizar el depósito.';
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
  doc.text('Comprobante de Depósito', 20, 20);

  doc.setFontSize(12);
  doc.text(`Cliente: ${cuentaSeleccionada.value.clientName || 'Desconocido'}`, 20, 40);
  doc.text(`Número de Cuenta: ${cuentaSeleccionada.value.accountNumber}`, 20, 50);
  doc.text(`Saldo Actual: $${cuentaSeleccionada.value.balance.toFixed(2)}`, 20, 60);
  doc.text(`Fecha: ${date}`, 20, 70);

  doc.save('comprobante_deposito.pdf');
  mensaje.value = 'PDF generado con la información del depósito.';
  mensajeError.value = false;
};

const volver = () => router.push('/');
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.depositar-dinero {
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

.buscador {
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid rgba(61, 237, 151, 0.2);
}

.input-group:hover {
  border-color: rgba(61, 237, 151, 0.4);
}

.input-group-text {
  padding: 0 15px;
  background: rgba(61, 237, 151, 0.2);
  color: #3ded97;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.form-control {
  flex: 1;
  height: 50px;
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
}

.cuentas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.cuenta-card {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(61, 237, 151, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.cuenta-card::before {
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

.cuenta-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.15);
  border-color: rgba(61, 237, 151, 0.3);
}

.cuenta-card:hover::before {
  opacity: 0.5;
}

.cuenta-info h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #fff;
}

.numero-cuenta {
  color: #3ded97;
  font-weight: 600;
  margin-bottom: 5px;
}

.documento {
  color: #a0a8c0;
  font-size: 0.9rem;
}

.badge-saldo {
  background: rgba(61, 237, 151, 0.2);
  color: #3ded97;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
}

.cuenta-card:hover .badge-saldo {
  background: rgba(61, 237, 151, 0.3);
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.2);
}

.sin-resultados {
  text-align: center;
  padding: 50px;
  color: #a0a8c0;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.sin-resultados i {
  font-size: 2rem;
  color: #3ded97;
  opacity: 0.7;
}

.cargando,
.error {
  text-align: center;
  padding: 30px;
  color: #a0a8c0;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.error {
  color: #ff4d4d;
}

.error i {
  font-size: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(61, 237, 151, 0.3);
  border-radius: 50%;
  border-top-color: #3ded97;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.formulario-deposito {
  width: 100%;
  max-width: 800px;
  margin-top: 30px;
}

.formulario-container {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.subtitulo {
  font-size: 1.8rem;
  color: #3ded97;
  margin-bottom: 25px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.info-cliente {
  margin-bottom: 30px;
}

.info-cliente p {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #fff;
}

.info-cliente span {
  color: #3ded97;
  font-weight: 600;
}

.form-deposito {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-grupo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 1.1rem;
  color: #fff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.botones-form {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-depositar, .btn-secundario {
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

.btn-depositar {
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: #fff;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
}

.btn-depositar:hover {
  background: linear-gradient(135deg, #3a56d4, #2f0a8a);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.4);
}

.btn-depositar:disabled {
  background: #6b7280;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-secundario {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secundario:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.mensaje {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  background: rgba(61, 237, 151, 0.2);
  color: #3ded97;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.mensaje-error {
  background: rgba(244, 63, 94, 0.2);
  color: #f43f5e;
}

.footer {
  margin-top: auto;
  padding: 30px 0;
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
  .cuentas-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .cuentas-grid {
    grid-template-columns: 1fr;
  }

  .botones-form {
    flex-direction: column;
  }

  .hero {
    padding: 60px 20px 40px;
  }

  .titulo {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .back-button {
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    font-size: 0.9rem;
  }

  .formulario-container {
    padding: 30px 20px;
  }

  .btn-depositar, .btn-secundario {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>
