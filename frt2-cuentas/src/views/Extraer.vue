<template>
  <div class="container py-5 animate__animated animate__fadeIn">
    <div class="text-center mb-4">
      <h2 class="text-secondary">Extraer Dinero</h2>
      <p class="text-muted">Busca una cuenta, revisa su saldo y realiza una extracción</p>
    </div>

    <!-- Buscador de cuentas -->
    <div class="card shadow-sm mb-4 p-3">
      <input
        type="text"
        v-model="busqueda"
        class="form-control"
        placeholder="Buscar por número de cuenta, nombre o ID de cliente..."
      />
    </div>

    <!-- Mensaje de carga o error -->
    <div v-if="loading" class="text-center text-muted animate__animated animate__fadeInUp">
      <p>Cargando cuentas...</p>
    </div>
    <div v-if="error" class="text-center text-danger animate__animated animate__fadeInUp">
      <p>{{ error }}</p>
    </div>

    <!-- Lista de cuentas filtradas -->
    <div v-else-if="cuentasFiltradas.length" class="list-group mb-4">
      <button
        class="list-group-item list-group-item-action"
        v-for="cuenta in cuentasFiltradas"
        :key="cuenta.id"
        @click="seleccionarCuenta(cuenta)"
      >
        <div class="d-flex justify-content-between">
          <div>
            <strong>{{ cuenta.clientName || 'Desconocido' }}</strong> — {{ cuenta.accountNumber }}
            <br />
            <small>ID Cliente: {{ cuenta.clientId }}</small>
          </div>
          <span class="badge bg-success">Saldo: ${{ cuenta.balance.toFixed(2) }}</span>
        </div>
      </button>
    </div>

    <div v-else class="text-center text-muted animate__animated animate__fadeInUp">
      <p>No se encontraron cuentas.</p>
    </div>

    <!-- Formulario de extracción -->
    <div v-if="cuentaSeleccionada" class="card shadow-lg p-4 mx-auto" style="max-width: 500px;">
      <h5 class="mb-3">Cuenta seleccionada: {{ cuentaSeleccionada.accountNumber }}</h5>
      <p><strong>Cliente:</strong> {{ cuentaSeleccionada.clientName || 'Desconocido' }}</p>
      <p><strong>Saldo actual:</strong> ${{ cuentaSeleccionada.balance.toFixed(2) }}</p>

      <form @submit.prevent="extraerDinero">
        <div class="mb-3">
          <label for="amount" class="form-label">Monto a Extraer</label>
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
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-secondary" :disabled="loading">
            {{ loading ? 'Procesando...' : 'Confirmar Extracción' }}
          </button>
          <button
            class="btn btn-outline-primary"
            @click.prevent="exportarPDF"
            :disabled="loading"
          >
            Exportar en PDF
          </button>
        </div>
      </form>

      <div v-if="mensaje" :class="['alert mt-3 text-center', mensajeError ? 'alert-danger' : 'alert-info']">
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const cuentas = ref([]);
const cuentaSeleccionada = ref(null);
const busqueda = ref('');
const form = ref({ amount: '' });
const mensaje = ref('');
const mensajeError = ref(false);
const loading = ref(false);
const error = ref(null);

onMounted(() => {
  fetchCuentas();
});

const fetchCuentas = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await fetch('http://localhost:8082/api/accounts', {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173', // Ajusta al origen de tu frontend
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    cuentas.value = await response.json();
  } catch (err) {
    error.value = 'Error al cargar las cuentas: ' + err.message;
  } finally {
    loading.value = false;
  }
};

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
      cuentas.value[index] = updatedCuenta;
    }

    cuentaSeleccionada.value = updatedCuenta;
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

  const pdfContent = `
    Comprobante de Extracción
    ----------------------
    Cliente: ${cuentaSeleccionada.value.clientName || 'Desconocido'}
    Número de Cuenta: ${cuentaSeleccionada.value.accountNumber}
    Saldo Actual: $${cuentaSeleccionada.value.balance.toFixed(2)}
    Fecha: ${new Date().toLocaleString()}
  `;
  console.log('Simulación de PDF:', pdfContent);
  mensaje.value = 'PDF generado con la información de extracción (simulado).';
  mensajeError.value = false;
};
</script>

<style scoped>
@import 'animate.css';
@import 'bootstrap/dist/css/bootstrap.min.css';
</style>