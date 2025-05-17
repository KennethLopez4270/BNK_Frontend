<template>
  <div class="actualizar-cliente">
    <section class="hero">
      <h1 class="titulo">Actualizar Cliente</h1>
      <p class="descripcion">Modifica los datos del cliente de forma rápida y segura.</p>
    </section>

    <section class="formulario">
      <form v-if="!cliente" @submit.prevent="cargarCliente" class="iniciar-form">
        <div class="form-group">
          <label for="document_number">Número de Documento</label>
          <input
            v-model="document_number"
            type="text"
            id="document_number"
            class="input-field"
            placeholder="Ingrese número de documento"
            required
          />
        </div>
        <button type="submit" class="btn-accion">Cargar Cliente</button>
      </form>

      <form v-else @submit.prevent="actualizarCliente" class="actualizar-form">
        <div class="form-group">
          <label for="fullName">Nombre Completo</label>
          <input v-model="cliente.fullName" type="text" id="fullName" class="input-field" required />
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input v-model="cliente.email" type="email" id="email" class="input-field" required />
        </div>
        <div class="form-group">
          <label for="phoneNumber">Teléfono</label>
          <input v-model="cliente.phoneNumber" type="text" id="phoneNumber" class="input-field" />
        </div>
        <div class="form-group">
          <label for="address">Dirección</label>
          <textarea v-model="cliente.address" id="address" class="input-field" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="documentNumber">Número de Documento</label>
          <input v-model="cliente.documentNumber" type="text" id="documentNumber" class="input-field" disabled />
        </div>
        <div class="form-group">
          <label for="documentType">Tipo de Documento</label>
          <select v-model="cliente.documentType" id="documentType" class="input-field">
            <option value="CI">CI</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
        </div>
        <div class="botones">
          <button type="submit" class="btn-accion">Actualizar</button>
          <button type="button" @click="limpiarFormulario" class="btn-accion btn-cancelar">Cancelar</button>
          <button type="button" @click="eliminarCliente" class="btn-accion btn-eliminar">Eliminar Cliente</button>
        </div>
      </form>

      <div v-if="mensaje" class="mensaje" :class="{ 'error': esError }">
        {{ mensaje }}
      </div>
    </section>

    <footer class="footer">
      © 2025 Todos los derechos reservados. CodeCapibara.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const document_number = ref('')
const cliente = ref(null)
const mensaje = ref('')
const esError = ref(false)

onMounted(async () => {
  if (route.params.id) {
    await cargarClientePorId(route.params.id)
  }
})

const cargarClientePorId = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8081/api/clients/${id}`)
    cliente.value = response.data
    document_number.value = cliente.value.documentNumber
    mensaje.value = ''
    esError.value = false
  } catch (error) {
    manejarError(error, 'Error al cargar el cliente')
  }
}

const cargarCliente = async () => {
  try {
    // Primero buscamos el cliente por número de documento
    const response = await axios.get('http://localhost:8081/api/clients')
    const clienteEncontrado = response.data.find(c => c.documentNumber === document_number.value)
    
    if (!clienteEncontrado) {
      throw new Error('Cliente no encontrado')
    }
    
    cliente.value = clienteEncontrado
    mensaje.value = ''
    esError.value = false
  } catch (error) {
    manejarError(error, 'Cliente no encontrado')
  }
}

const actualizarCliente = async () => {
  try {
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cliente.value.email)) {
      mensaje.value = 'Correo electrónico inválido'
      esError.value = true
      return
    }

    const response = await axios.put(
      `http://localhost:8081/api/clients/${cliente.value.id}`,
      cliente.value
    )

    mensaje.value = 'Cliente actualizado exitosamente'
    esError.value = false

    setTimeout(() => {
      limpiarFormulario()
      router.push('/')
    }, 2000)
  } catch (error) {
    manejarError(error, 'Error al actualizar el cliente')
  }
}

const eliminarCliente = async () => {
  if (!cliente.value) return

  const confirmar = confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')

  if (!confirmar) return

  try {
    await axios.delete(`http://localhost:8081/api/clients/${cliente.value.id}`)

    mensaje.value = 'Cliente eliminado exitosamente'
    esError.value = false

    setTimeout(() => {
      limpiarFormulario()
      router.push('/')
    }, 2000)
  } catch (error) {
    manejarError(error, 'Error al eliminar el cliente')
  }
}

const limpiarFormulario = () => {
  cliente.value = null
  document_number.value = ''
  mensaje.value = ''
  esError.value = false
}

const manejarError = (error, mensajeDefault) => {
  esError.value = true
  if (error.response) {
    // Error del servidor
    if (error.response.status === 404) {
      mensaje.value = 'Cliente no encontrado'
    } else if (error.response.status === 409) {
      mensaje.value = 'Error: El email ya está registrado'
    } else {
      mensaje.value = `Error del servidor: ${error.response.data.message || error.response.statusText}`
    }
  } else {
    mensaje.value = mensajeDefault
  }
}
</script>

<style scoped>
.actualizar-cliente {
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
  background: linear-gradient(to bottom, #122523, #000);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  padding: 100px 20px 60px;
  text-align: center;
}

.titulo {
  font-size: 3rem;
  font-weight: 800;
  color: #3ded97;
}

.descripcion {
  font-size: 1.2rem;
  color: #ccc;
  margin: 20px 0;
}

.formulario {
  background: #000;
  padding: 60px 20px;
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.iniciar-form,
.actualizar-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form-group label {
  font-size: 1rem;
  color: #3ded97;
  margin-bottom: 5px;
}

.input-field {
  background-color: #1a1a1a;
  color: #fff;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #3ded97;
  border-radius: 5px;
  width: 100%;
}

.input-field:focus {
  outline: none;
  border-color: #24d26a;
  box-shadow: 0 0 5px #24d26a;
}

.botones {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
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
  background-color: #555;
  box-shadow: 0 0 10px #555;
}

.btn-cancelar:hover {
  background-color: #444;
}

.btn-eliminar {
  background-color: #d9534f;
  box-shadow: 0 0 10px #d9534f;
}

.btn-eliminar:hover {
  background-color: #c9302c;
}

.mensaje {
  font-size: 1rem;
  color: #3ded97;
  margin-top: 20px;
}

.footer {
  margin-top: auto;
  padding: 30px 0;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
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
