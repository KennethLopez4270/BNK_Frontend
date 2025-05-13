<template>
    <div class="depositar-dinero">
      <section class="hero">
        <h1 class="titulo">Depositar Dinero</h1>
        <p class="descripcion">
          Busca una cuenta, revisa su saldo y realiza un depósito
        </p>
      </section>
  
      <!-- Buscador de cuentas -->
      <section class="buscador">
        <input
          type="text"
          v-model="busqueda"
          class="input-busqueda"
          placeholder="Buscar por número de cuenta, nombre o documento..."
        />
      </section>
  
      <!-- Mensaje de carga o error -->
      <div v-if="loading" class="cargando">Cargando cuentas...</div>
      <div v-if="error" class="error">{{ error }}</div>
  
      <!-- Lista de cuentas filtradas -->
      <section class="lista-cuentas" v-else>
        <div v-if="cuentasFiltradas.length" class="cuentas-grid">
          <div
            v-for="cuenta in cuentasFiltradas"
            :key="cuenta.id"
            class="cuenta-card"
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
  
        <div v-else class="sin-resultados">
          No se encontraron cuentas
        </div>
      </section>
  
      <!-- Formulario de depósito -->
      <section v-if="cuentaSeleccionada" class="formulario-deposito">
        <div class="formulario-container">
          <h2 class="subtitulo">
            Depósito a cuenta: {{ cuentaSeleccionada.accountNumber }}
          </h2>
  
          <div class="info-cliente">
            <p><span>Cliente:</span> {{ cuentaSeleccionada.clientName || 'Desconocido' }}</p>
            <p><span>Saldo actual:</span> ${{ cuentaSeleccionada.balance.toFixed(2) }}</p>
          </div>
  
          <form @submit.prevent="depositarDinero" class="form-deposito">
            <div class="form-grupo">
              <label>Monto a Depositar</label>
              <input
                type="number"
                v-model.number="form.amount"
                class="input-field"
                placeholder="Ej. 100.00"
                step="0.01"
                min="0"
                required
              />
            </div>
  
            <div class="botones-form">
              <button type="submit" class="btn-accion btn-depositar" :disabled="loading">
                {{ loading ? 'Procesando...' : 'Confirmar Depósito' }}
              </button>
              <button
                type="button"
                @click.prevent="exportarPDF"
                class="btn-accion btn-secundario"
                :disabled="loading"
              >
                Exportar en PDF
              </button>
            </div>
          </form>
  
          <div v-if="mensaje" :class="['mensaje', { 'mensaje-error': mensajeError }]">
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
      const response = await fetch('http://localhost:8080/api/accounts', {
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
        `http://localhost:8080/api/accounts/${cuentaSeleccionada.value.id}/deposit?amount=${monto}`,
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
  
    const pdfContent = `
      Comprobante de Depósito
      ----------------------
      Cliente: ${cuentaSeleccionada.value.clientName || 'Desconocido'}
      Número de Cuenta: ${cuentaSeleccionada.value.accountNumber}
      Saldo Actual: $${cuentaSeleccionada.value.balance.toFixed(2)}
      Fecha: ${new Date().toLocaleString()}
    `;
    console.log('Simulación de PDF:', pdfContent);
    mensaje.value = 'PDF generado con la información del depósito (simulado).';
    mensajeError.value = false;
  };
  </script>
  
  <style scoped>
  .depositar-dinero {
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
  
  .buscador {
    width: 100%;
    max-width: 800px;
    margin-bottom: 30px;
  }
  
  .input-busqueda {
    width: 100%;
    padding: 15px;
    border: 1px solid #3ded97;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 1rem;
  }
  
  .lista-cuentas {
    width: 100%;
    max-width: 800px;
    margin-bottom: 30px;
  }
  
  .cuentas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
  
  .cuenta-card {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 10px;
    padding: 20px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    border: 1px solid rgba(61, 237, 151, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .cuenta-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(61, 237, 151, 0.1);
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
    color: #ccc;
    font-size: 0.9rem;
  }
  
  .badge-saldo {
    background-color: rgba(40, 167, 69, 0.2);
    color: #28a745;
    padding: 8px 15px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 1rem;
  }
  
  .sin-resultados {
    text-align: center;
    padding: 30px;
    color: #ccc;
    font-size: 1.1rem;
  }
  
  .cargando,
  .error {
    text-align: center;
    padding: 30px;
    color: #ccc;
    font-size: 1.1rem;
  }
  
  .error {
    color: #dc3545;
  }
  
  .formulario-deposito {
    width: 100%;
    max-width: 600px;
    margin-top: 30px;
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
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
  
  .info-cliente span {
    color: #3ded97;
    font-weight: 600;
  }
  
  .form-deposito {
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
  
  .input-field:focus {
    outline: none;
    border-color: #24d26a;
    box-shadow: 0 0 5px #24d26a;
  }
  
  .botones-form {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
  }
  
  .btn-accion {
    background-color: #24d26a;
    color: #fff;
    padding: 12px 25px;
    font-size: 1rem;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 0 10px #24d26a;
    transition: 0.3s;
  }
  
  .btn-accion:hover {
    background-color: #1abc5c;
  }
  
  .btn-depositar {
    background-color: #2a7dd1;
    box-shadow: 0 0 10px #2a7dd1;
  }
  
  .btn-depositar:hover {
    background-color: #1a6cbe;
  }
  
  .btn-secundario {
    background-color: #6c757d;
    box-shadow: 0 0 10px #6c757d;
  }
  
  .btn-secundario:hover {
    background-color: #5a6268;
  }
  
  .mensaje {
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    background-color: rgba(61, 237, 151, 0.2);
    color: #3ded97;
  }
  
  .mensaje-error {
    background-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
  }
  
  .footer {
    margin-top: auto;
    padding: 30px 0;
    font-size: 0.9rem;
    color: #888;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .cuentas-grid {
      grid-template-columns: 1fr;
    }
  
    .botones-form {
      flex-direction: column;
    }
  
    .btn-accion {
      width: 100%;
      justify-content: center;
    }
  }
  </style>