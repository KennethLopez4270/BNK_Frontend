<template>
  <div class="crear-cuenta">
    <section class="hero">
      <h1 class="titulo">Crear Nueva Cuenta</h1>
      <p class="descripcion">
        Completa el formulario para registrar una cuenta
      </p>
    </section>

    <section class="formulario">
      <form @submit.prevent="handleSubmit" class="formulario-container">
        <div class="form-columnas">
          <div class="form-grupo">
            <label>ID del Cliente</label>
            <input
              type="number"
              v-model="form.clientId"
              class="input-field"
              required
            />
          </div>

          <div class="form-grupo">
            <label>Número de Cuenta</label>
            <input
              type="text"
              v-model="form.accountNumber"
              class="input-field"
              required
            />
          </div>
        </div>

        <div class="form-columnas">
          <div class="form-grupo">
            <label>Tipo de Cuenta</label>
            <select v-model="form.accountType" class="input-field">
              <option value="ahorro">Ahorro</option>
              <option value="corriente">Corriente</option>
            </select>
          </div>

          <div class="form-grupo">
            <label>Saldo Inicial</label>
            <input
              type="number"
              v-model="form.balance"
              min="0"
              step="0.01"
              class="input-field"
            />
          </div>
        </div>

        <div class="form-grupo">
          <label>Estado</label>
          <select v-model="form.status" class="input-field">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div class="botones-form">
          <button type="submit" class="btn-accion btn-guardar" :disabled="loading">
            <i class="bi bi-check-circle"></i> {{ loading ? 'Guardando...' : 'Guardar Cuenta' }}
          </button>
          <button
            type="button"
            @click="volver"
            class="btn-accion btn-secundario"
            :disabled="loading"
          >
            <i class="bi bi-arrow-left"></i> Volver
          </button>
        </div>
      </form>
    </section>

    <!-- Modal de éxito -->
    <div v-if="mostrarModalExito" class="modal-overlay" @click="mostrarModalExito = false">
      <div class="modal-contenido modal-exito" @click.stop>
        <h3>¡Éxito!</h3>
        <p>La cuenta fue creada correctamente.</p>
        <button @click="cerrarModalExito" class="btn-accion">Aceptar</button>
      </div>
    </div>

    <!-- Modal de error -->
    <div v-if="mostrarModalError" class="modal-overlay" @click="mostrarModalError = false">
      <div class="modal-contenido modal-error" @click.stop>
        <h3>Error</h3>
        <p>{{ errorMessage }}</p>
        <button @click="mostrarModalError = false" class="btn-accion">Cerrar</button>
      </div>
    </div>

    <footer class="footer">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  clientId: '',
  accountNumber: '',
  accountType: 'ahorro',
  balance: 0,
  status: 'activo',
});

const mostrarModalExito = ref(false);
const mostrarModalError = ref(false);
const loading = ref(false);
const errorMessage = ref('Ocurrió un error al registrar la cuenta. Por favor, intenta nuevamente.');

const handleSubmit = async () => {
  try {
    loading.value = true;
    const payload = {
      clientId: parseInt(form.value.clientId),
      accountNumber: form.value.accountNumber,
      accountType: form.value.accountType,
      balance: parseFloat(form.value.balance) || 0,
      status: form.value.status,
    };

    // Enviar solicitud al endpoint POST /api/accounts usando fetch
    const response = await fetch('http://localhost:8082/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173', // Ajusta al origen de tu frontend
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    // Mostrar modal de éxito
    mostrarModalExito.value = true;
  } catch (error) {
    // Personalizar mensaje de error
    errorMessage.value =
      error.message.includes('400')
        ? 'Datos inválidos. Verifica los campos e intenta nuevamente.'
        : error.message || 'Error al registrar la cuenta. Por favor, intenta nuevamente.';
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
  }
};

const cerrarModalExito = () => {
  mostrarModalExito.value = false;
  volver();
};

const volver = () => {
  router.push('/');
};
</script>

<style scoped>
.crear-cuenta {
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

.formulario {
  width: 100%;
  max-width: 800px;
  margin: 30px 0;
}

.formulario-container {
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.1);
}

.form-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
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

select.input-field {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233ded97'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-accion:hover {
  background-color: #1abc5c;
}

.btn-guardar {
  background-color: #28a745;
  box-shadow: 0 0 10px #28a745;
}

.btn-guardar:hover {
  background-color: #218838;
}

.btn-secundario {
  background-color: #6c757d;
  box-shadow: 0 0 10px #6c757d;
}

.btn-secundario:hover {
  background-color: #5a6268;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido {
  background: linear-gradient(to bottom, #122523, #000);
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  border: 1px solid #3ded97;
  box-shadow: 0 0 30px rgba(61, 237, 151, 0.3);
  text-align: center;
}

.modal-exito {
  border-color: #28a745;
  box-shadow: 0 0 30px rgba(40, 167, 69, 0.3);
}

.modal-error {
  border-color: #dc3545;
  box-shadow: 0 0 30px rgba(220, 53, 69, 0.3);
}

.modal-contenido h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #3ded97;
}

.modal-contenido p {
  margin-bottom: 30px;
  color: #ccc;
}

.footer {
  margin-top: auto;
  padding: 30px 0;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
}

@media (max-width: 768px) {
  .form-columnas {
    grid-template-columns: 1fr;
  }

  .botones-form {
    flex-direction: column;
  }

  .btn-accion {
    justify-content: center;
  }
}
</style>