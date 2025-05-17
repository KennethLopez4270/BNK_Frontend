<template>
  <div class="crear-cliente">
    <section class="hero">
      <h1 class="titulo">Registrar Nuevo Cliente</h1>
      <p class="descripcion">
        Completa los datos para agregar un nuevo cliente al sistema.
      </p>
    </section>

    <section class="formulario">
      <form @submit.prevent="submitForm">
        <div class="campo">
          <label for="fullName">Nombre Completo:</label>
          <input 
            type="text" 
            id="fullName" 
            v-model="cliente.fullName" 
            required
          >
        </div>

        <div class="campo">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="cliente.email" 
            required
          >
        </div>

        <div class="campo">
          <label for="phoneNumber">Teléfono:</label>
          <input 
            type="tel" 
            id="phoneNumber" 
            v-model="cliente.phoneNumber"
          >
        </div>

        <div class="campo">
          <label for="address">Dirección:</label>
          <textarea 
            id="address" 
            v-model="cliente.address"
          ></textarea>
        </div>

        <div class="campo">
          <label for="documentType">Tipo de Documento:</label>
          <select id="documentType" v-model="cliente.documentType" required>
            <option value="">Seleccione...</option>
            <option value="CI">CI</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
        </div>

        <div class="campo">
          <label for="documentNumber">Número de Documento:</label>
          <input 
            type="text" 
            id="documentNumber" 
            v-model="cliente.documentNumber" 
            required
          >
        </div>

        <div class="botones">
          <button type="submit" class="btn-accion">Guardar Cliente</button>
          <button type="button" class="btn-cancelar" @click="cancelar">Cancelar</button>
        </div>
      </form>

      <div v-if="mensaje" class="mensaje" :class="{ 'error': esError }">
        {{ mensaje }}
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const mensaje = ref('');
const esError = ref(false);

const cliente = ref({
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  documentNumber: '',
  documentType: ''
});

const submitForm = async () => {
  try {
    const response = await axios.post('http://localhost:8081/api/clients', cliente.value);
    
    if (response.status === 200) {
      mensaje.value = 'Cliente creado exitosamente';
      esError.value = false;
      setTimeout(() => router.push('/'), 2000);
    }
  } catch (error) {
    esError.value = true;
    if (error.response) {
      // Error del servidor
      if (error.response.status === 409) {
        mensaje.value = 'Error: El email o número de documento ya existen';
      } else {
        mensaje.value = `Error del servidor: ${error.response.data.message || error.response.statusText}`;
      }
    } else {
      mensaje.value = 'Error de conexión con el servidor';
    }
  }
};

const cancelar = () => {
  router.push('/');
};
</script>

<style scoped>
.crear-cliente {
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
  background: linear-gradient(to bottom, #122523, #000);
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  padding: 60px 20px 40px;
  text-align: center;
}

.titulo {
  font-size: 2.5rem;
  font-weight: 800;
  color: #3ded97;
}

.descripcion {
  font-size: 1.2rem;
  color: #ccc;
  margin: 20px 0;
}

.formulario {
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.2);
}

.campo {
  margin-bottom: 20px;
}

.campo label {
  display: block;
  margin-bottom: 8px;
  color: #3ded97;
  font-weight: 600;
}

.campo input,
.campo select,
.campo textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #24d26a;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 1rem;
}

.campo textarea {
  min-height: 100px;
  resize: vertical;
}

.botones {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-accion {
  background-color: #24d26a;
  color: #fff;
  padding: 15px 30px;
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

.btn-cancelar {
  background-color: #ff4d4d;
  color: #fff;
  padding: 15px 30px;
  font-size: 1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 0 10px #ff4d4d;
  transition: 0.3s;
}

.btn-cancelar:hover {
  background-color: #e60000;
}

.mensaje {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  background-color: #24d26a;
}

.mensaje.error {
  background-color: #ff4d4d;
}
</style>