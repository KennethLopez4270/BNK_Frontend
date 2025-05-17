<template>
  <div class="extraer-dinero">
    <section class="hero">
      <h1 class="titulo">Extraer Dinero</h1>
      <p class="descripcion">
        Busca una cuenta, revisa su saldo y realiza una extracción
      </p>
    </section>

    <!-- Buscador de cuentas -->
    <section class="filtros">
      <div class="filtros-container">
        <input
          type="text"
          v-model="busqueda"
          class="input-filtro"
          placeholder="Buscar por número de cuenta, nombre o ID de cliente..."
        />
      </div>
    </section>

    <!-- Mensaje de carga o error -->
    <div v-if="loading" class="cargando">Cargando cuentas...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Lista de cuentas filtradas -->
    <section class="lista-cuentas" v-else>
      <div v-if="cuentasFiltradas.length">
        <div 
          class="item-cuenta"
          v-for="cuenta in cuentasFiltradas"
          :key="cuenta.id"
          @click="seleccionarCuenta(cuenta)"
        >
          <div class="info-cuenta">
            <h3>{{ cuenta.clientName || 'Desconocido' }}</h3>
            <p class="numero-cuenta">{{ cuenta.accountNumber }}</p>
            <p class="id-cliente">ID Cliente: {{ cuenta.clientId }}</p>
          </div>
          <div class="saldo-cuenta">
            <span class="badge-saldo">${{ cuenta.balance.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="sin-resultados">
        No se encontraron cuentas.
      </div>
    </section>

    <!-- Formulario de extracción -->
    <section v-if="cuentaSeleccionada" class="formulario-extraccion">
      <div class="formulario-container">
        <h2 class="subtitulo">Cuenta seleccionada: {{ cuentaSeleccionada.accountNumber }}</h2>
        
        <div class="info-cliente">
          <p><strong>Cliente:</strong> {{ cuentaSeleccionada.clientName || 'Desconocido' }}</p>
          <p><strong>Saldo actual:</strong> ${{ cuentaSeleccionada.balance.toFixed(2) }}</p>
        </div>

        <form @submit.prevent="extraerDinero" class="form-extraccion">
          <div class="form-grupo">
            <label>Monto a Extraer</label>
            <input
              type="number"
              v-model.number="form.amount"
              class="input-field"
              placeholder="Ej. 100.00"
              step="0.01"
              min="0"
              :max="cuentaSeleccionada.balance"
              required
            />
          </div>

          <div class="botones-form">
            <button type="submit" class="btn-accion" :disabled="loading">
              <i class="bi bi-cash-stack"></i> {{ loading ? 'Procesando...' : 'Confirmar Extracción' }}
            </button>
            <button
              @click.prevent="exportarPDF"
              class="btn-accion btn-secundario"
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

    <footer class="footer">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
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
        'Origin': 'http://localhost:5173',
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
.extraer-dinero {
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
}

.filtros {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 30px;
}

.filtros-container {
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.1);
}

.input-filtro {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #3ded97;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 1rem;
}

.lista-cuentas {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 30px;
}

.item-cuenta {
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.item-cuenta:hover {
  border-color: #3ded97;
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.2);
}

.info-cuenta h3 {
  color: #3ded97;
  margin-bottom: 5px;
}

.numero-cuenta {
  color: #fff;
  font-weight: 600;
  margin-bottom: 5px;
}

.id-cliente {
  color: #ccc;
  font-size: 0.9rem;
}

.badge-saldo {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
}

.sin-resultados {
  text-align: center;
  padding: 30px;
  color: #ccc;
  font-size: 1.1rem;
}

.cargando {
  text-align: center;
  padding: 30px;
  color: #ccc;
  font-size: 1.1rem;
}

.error {
  text-align: center;
  padding: 30px;
  color: #ff4d4d;
  font-size: 1.1rem;
}

.formulario-extraccion {
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
}

.formulario-container {
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.1);
}

.subtitulo {
  font-size: 1.8rem;
  color: #3ded97;
  margin-bottom: 20px;
  text-align: center;
}

.info-cliente {
  margin-bottom: 30px;
}

.info-cliente p {
  margin-bottom: 10px;
  color: #fff;
}

.info-cliente strong {
  color: #3ded97;
}

.form-extraccion {
  display: flex;
  flex-direction: column;
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

.btn-secundario {
  background-color: #6c757d;
  box-shadow: 0 0 10px #6c757d;
}

.btn-secundario:hover {
  background-color: #5a6268;
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
  margin-top: auto;
  padding: 30px 0;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
}

@media (max-width: 768px) {
  .botones-form {
    flex-direction: column;
  }
  
  .item-cuenta {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .info-cuenta, .saldo-cuenta {
    width: 100%;
  }
}
</style>