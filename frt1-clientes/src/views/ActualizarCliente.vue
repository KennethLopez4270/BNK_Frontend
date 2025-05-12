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
          <label for="full_name">Nombre Completo</label>
          <input v-model="cliente.full_name" type="text" id="full_name" class="input-field" required />
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input v-model="cliente.email" type="email" id="email" class="input-field" required />
        </div>
        <div class="form-group">
          <label for="phone_number">Teléfono</label>
          <input v-model="cliente.phone_number" type="text" id="phone_number" class="input-field" />
        </div>
        <div class="form-group">
          <label for="address">Dirección</label>
          <textarea v-model="cliente.address" id="address" class="input-field" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="document_number">Número de Documento</label>
          <input v-model="cliente.document_number" type="text" id="document_number" class="input-field" disabled />
        </div>
        <div class="form-group">
          <label for="document_type">Tipo de Documento</label>
          <select v-model="cliente.document_type" id="document_type" class="input-field">
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="CI">CI</option>
          </select>
        </div>
        <div class="botones">
          <button type="submit" class="btn-accion">Actualizar</button>
          <button type="button" @click="limpiarFormulario" class="btn-accion btn-cancelar">Cancelar</button>
          <button type="button" @click="eliminarCliente" class="btn-accion btn-eliminar">Eliminar Cliente</button>
        </div>
      </form>

      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
    </section>

    <footer class="footer">
      © 2025 Todos los derechos reservados. CodeCapibara.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const document_number = ref('')
const cliente = ref(null)
const mensaje = ref('')

onMounted(async () => {
  if (route.params.document_number) {
    document_number.value = route.params.document_number
    await cargarCliente()
  }
})

const cargarCliente = async () => {
  try {
    const response = await fetch(`/api/clients?document_number=${document_number.value}`)
    if (!response.ok) throw new Error('Cliente no encontrado')
    const data = await response.json()
    cliente.value = data
    mensaje.value = ''
  } catch (error) {
    mensaje.value = 'Error: Cliente no encontrado'
    cliente.value = null
  }
}

const actualizarCliente = async () => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cliente.value.email)) {
      mensaje.value = 'Correo electrónico inválido'
      return
    }

    const response = await fetch(`/api/clients/${cliente.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente.value),
    })

    if (!response.ok) throw new Error('Error al actualizar')
    mensaje.value = 'Cliente actualizado exitosamente'

    setTimeout(() => {
      limpiarFormulario()
      router.push('/home')
    }, 2000)
  } catch (error) {
    mensaje.value = 'Error al actualizar el cliente'
  }
}

const eliminarCliente = async () => {
  if (!cliente.value) return

  const confirmar = confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')

  if (!confirmar) return

  try {
    const response = await fetch(`/api/clients/${cliente.value.id}`, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error('Error al eliminar cliente')

    mensaje.value = 'Cliente eliminado exitosamente'
    setTimeout(() => {
      limpiarFormulario()
      router.push('/home')
    }, 2000)
  } catch (error) {
    mensaje.value = 'Error al eliminar el cliente'
  }
}

const limpiarFormulario = () => {
  cliente.value = null
  document_number.value = ''
  mensaje.value = ''
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
</style>
