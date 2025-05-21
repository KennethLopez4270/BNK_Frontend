<template>
  <div class="crear-cuenta">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Crear Nueva Cuenta</h1>
      <p class="descripcion">
        Completa el formulario para registrar una cuenta
      </p>
    </section>

    <section class="formulario">
      <form @submit.prevent="handleSubmit" class="formulario-container animate__animated animate__fadeInUp">
        <div class="form-columnas">
          <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.1s">
            <label class="form-label">ID del Cliente</label>
            <div class="input-group">
              <input
                type="number"
                v-model="form.clientId"
                class="form-control"
                required
                placeholder="Ej: 1001"
              />
            </div>
          </div>

          <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.2s">
            <label class="form-label">Número de Cuenta</label>
            <div class="input-group">
              <input
                type="text"
                v-model="form.accountNumber"
                class="form-control"
                required
                placeholder="Ej: 1001-0001"
              />
            </div>
          </div>
        </div>

        <div class="form-columnas">
          <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.3s">
            <label class="form-label">Tipo de Cuenta</label>
            <div class="input-group">
              <select v-model="form.accountType" class="form-control">
                <option value="ahorro">Ahorro</option>
                <option value="corriente">Corriente</option>
              </select>
            </div>
          </div>

          <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.4s">
            <label class="form-label">Saldo Inicial</label>
            <div class="input-group">
              <span class="input-group-text">Bs</span>
              <input
                type="number"
                v-model="form.balance"
                min="0"
                step="0.01"
                class="form-control"
                placeholder="Ej: 1000.00"
              />
            </div>
          </div>
        </div>

        <div class="form-grupo animate__animated animate__fadeIn" style="animation-delay: 0.5s">
          <label class="form-label">Estado</label>
          <div class="input-group">
            <select v-model="form.status" class="form-control">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="botones-form animate__animated animate__fadeIn" style="animation-delay: 0.6s">
          <button type="submit" class="btn-accion" :disabled="loading">
            <i class="bi bi-check-circle"></i> {{ loading ? 'Guardando...' : 'Guardar Cuenta' }}
          </button>
          <button
            type="button"
            @click="volver"
            class="btn-secundario"
            :disabled="loading"
          >
            <i class="bi bi-arrow-left"></i> Volver
          </button>
        </div>
      </form>
    </section>

    <!-- Modal de éxito -->
    <div v-if="mostrarModalExito" class="modal-overlay" @click="mostrarModalExito = false">
      <div class="modal-contenido modal-exito animate__animated animate__zoomIn" @click.stop>
        <div class="modal-icono-exito">
          <i class="bi bi-check-circle"></i>
        </div>
        <h3>¡Éxito!</h3>
        <p>La cuenta fue creada correctamente.</p>
        <button @click="cerrarModalExito" class="btn-accion">Aceptar</button>
      </div>
    </div>

    <!-- Modal de error -->
    <div v-if="mostrarModalError" class="modal-overlay" @click="mostrarModalError = false">
      <div class="modal-contenido modal-error animate__animated animate__zoomIn" @click.stop>
        <div class="modal-icono-error">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3>Error</h3>
        <p>{{ errorMessage }}</p>
        <button @click="mostrarModalError = false" class="btn-accion">Cerrar</button>
      </div>
    </div>

    <footer class="footer animate__animated animate__fadeIn" style="animation-delay: 0.7s">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import 'animate.css';

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
        'Origin': 'http://localhost:5173',
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.crear-cuenta {
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
  max-width: 1000px;
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

.formulario {
  width: 100%;
  max-width: 800px;
  margin: 30px 0;
}

.formulario-container {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.form-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
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
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  height: 50px;
  display: flex;
  align-items: center;
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

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233ded97'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 20px;
}

.botones-form {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.btn-accion, .btn-secundario {
  padding: 12px 30px;
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
  box-shadow: 0 4px 15px rgba(61, 237, 151, 0.3);
}

.btn-accion:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(61, 237, 151, 0.4);
}

.btn-accion:disabled {
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
  backdrop-filter: blur(5px);
}

.modal-contenido {
  background: rgba(15, 23, 42, 0.95);
  padding: 40px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-exito {
  border: 1px solid rgba(61, 237, 151, 0.5);
}

.modal-error {
  border: 1px solid rgba(244, 63, 94, 0.5);
}

.modal-icono-exito, .modal-icono-error {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.modal-icono-exito {
  background: linear-gradient(135deg, rgba(61, 237, 151, 0.2), transparent);
  color: #3ded97;
}

.modal-icono-error {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.2), transparent);
  color: #f43f5e;
}

.modal-contenido h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #fff;
}

.modal-contenido p {
  margin-bottom: 30px;
  color: #a0a8c0;
  font-size: 1.1rem;
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

@media (max-width: 768px) {
  .form-columnas {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .formulario-container {
    padding: 30px 20px;
  }

  .botones-form {
    flex-direction: column;
    gap: 15px;
  }

  .hero {
    padding: 60px 20px 40px;
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

  .formulario-container {
    padding: 25px 15px;
  }

  .modal-contenido {
    padding: 30px 20px;
  }
}
</style>
