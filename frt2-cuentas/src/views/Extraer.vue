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
          placeholder="Buscar por número de cuenta, nombre o documento..."
        />
      </div>
  
      <!-- Lista de cuentas filtradas -->
      <div v-if="cuentasFiltradas.length" class="list-group mb-4">
        <button
          class="list-group-item list-group-item-action"
          v-for="cuenta in cuentasFiltradas"
          :key="cuenta.account_number"
          @click="seleccionarCuenta(cuenta)"
        >
          <div class="d-flex justify-content-between">
            <div>
              <strong>{{ cuenta.full_name }}</strong> — {{ cuenta.account_number }}
              <br />
              <small>Documento: {{ cuenta.document_number }}</small>
            </div>
            <span class="badge bg-success">Saldo: ${{ cuenta.balance.toFixed(2) }}</span>
          </div>
        </button>
      </div>
  
      <!-- Formulario de extracción -->
      <div v-if="cuentaSeleccionada" class="card shadow-lg p-4 mx-auto" style="max-width: 500px;">
        <h5 class="mb-3">Cuenta seleccionada: {{ cuentaSeleccionada.account_number }}</h5>
        <p><strong>Cliente:</strong> {{ cuentaSeleccionada.full_name }}</p>
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
            <button type="submit" class="btn btn-secondary">Confirmar Extracción</button>
            <button class="btn btn-outline-primary" @click.prevent="exportarPDF">Exportar en PDF</button>
          </div>
        </form>
  
        <div v-if="mensaje" class="alert alert-info mt-3 text-center">
          {{ mensaje }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  // 🔍 Datos simulados (esto vendrá del backend luego)
  const cuentas = ref([
    {
      full_name: 'María Fernández',
      document_number: '12345678',
      account_number: 'ACC001',
      balance: 1500.75
    },
    {
      full_name: 'Juan Pérez',
      document_number: '87654321',
      account_number: 'ACC002',
      balance: 987.50
    },
    {
      full_name: 'Laura Quispe',
      document_number: '45678912',
      account_number: 'ACC003',
      balance: 5000.00
    }
  ])
  
  const cuentaSeleccionada = ref(null)
  const busqueda = ref('')
  const form = ref({ amount: '' })
  const mensaje = ref('')
  
  const cuentasFiltradas = computed(() => {
    if (!busqueda.value.trim()) return cuentas.value
    const filtro = busqueda.value.toLowerCase()
    return cuentas.value.filter(c =>
      c.full_name.toLowerCase().includes(filtro) ||
      c.document_number.toLowerCase().includes(filtro) ||
      c.account_number.toLowerCase().includes(filtro)
    )
  })
  
  const seleccionarCuenta = (cuenta) => {
    cuentaSeleccionada.value = cuenta
    mensaje.value = ''
    form.value.amount = ''
  }
  
  const extraerDinero = () => {
    const monto = form.value.amount
    if (monto > cuentaSeleccionada.value.balance) {
      mensaje.value = 'El monto excede el saldo disponible.'
      return
    }
  
    cuentaSeleccionada.value.balance -= monto
    mensaje.value = `Extracción de $${monto.toFixed(2)} realizada con éxito. Saldo restante: $${cuentaSeleccionada.value.balance.toFixed(2)}.`
    form.value.amount = ''
  }
  
  // 📄 Simulación de exportar en PDF
  const exportarPDF = () => {
    alert('PDF generado con la información de extracción (simulado).')
  }
  </script>
  
  <style scoped>
  @import "animate.css";
  </style>
    