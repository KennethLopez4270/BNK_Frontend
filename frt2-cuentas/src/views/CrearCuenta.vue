<template>
    <div class="container py-5 animate__animated animate__fadeIn">
      <div class="text-center mb-4">
        <h2 class="text-primary fw-bold animate__animated animate__fadeInDown">Crear Nueva Cuenta</h2>
        <p class="text-muted">Completa el formulario para registrar una cuenta</p>
      </div>
  
      <div class="card shadow-lg border-0 animate__animated animate__zoomIn">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">ID del Cliente</label>
                <input type="number" class="form-control" v-model="form.client_id" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Número de Cuenta</label>
                <input type="text" class="form-control" v-model="form.account_number" required />
              </div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Tipo de Cuenta</label>
                <select class="form-select" v-model="form.account_type">
                  <option value="ahorro">Ahorro</option>
                  <option value="corriente">Corriente</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Saldo Inicial</label>
                <input type="number" class="form-control" v-model="form.balance" min="0" step="0.01" />
              </div>
            </div>
  
            <div class="mb-3">
              <label class="form-label">Estado</label>
              <select class="form-select" v-model="form.status">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
  
            <div class="text-center mt-4">
              <button type="submit" class="btn btn-success px-4">
                <i class="bi bi-check-circle me-2"></i>Guardar Cuenta
              </button>
              <button type="button" class="btn btn-secondary ms-3" @click="volver">
                <i class="bi bi-arrow-left me-1"></i>Volver
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Modal de éxito -->
      <div class="modal fade" id="modalExito" tabindex="-1" aria-labelledby="modalExitoLabel" aria-hidden="true" ref="modalExito">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-success">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title" id="modalExitoLabel">¡Éxito!</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              La cuenta fue creada correctamente.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de error -->
      <div class="modal fade" id="modalError" tabindex="-1" aria-labelledby="modalErrorLabel" aria-hidden="true" ref="modalError">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-danger">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title" id="modalErrorLabel">Error</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Ocurrió un error al registrar la cuenta. Por favor, intenta nuevamente.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Modal } from 'bootstrap'
  
  const router = useRouter()
  
  const form = ref({
    client_id: '',
    account_number: '',
    account_type: 'ahorro',
    balance: 0,
    status: 'activo'
  })
  
  const modalExito = ref(null)
  const modalError = ref(null)
  
  const handleSubmit = () => {
    try {
      // Simula una solicitud al backend
      console.log('Enviando datos:', form.value)
  
      // Aquí conectarías tu backend real
      // Si responde con éxito:
      new Modal(modalExito.value).show()
    } catch (error) {
      new Modal(modalError.value).show()
    }
  }
  
  const volver = () => {
    router.push('/')
  }
  </script>
  
  <style scoped>
  @import "animate.css";
  </style>
  