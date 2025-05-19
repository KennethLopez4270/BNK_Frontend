<template>
  <div class="clientes-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Actualizar Cliente</h1>
      <p class="descripcion">Modifica los datos del cliente de forma rápida y segura</p>
    </section>

    <section class="formulario-container animate__animated animate__fadeInUp">
      <div v-if="!cliente" class="formulario-inicial">
        <form @submit.prevent="cargarCliente" class="formulario">
          <div class="campo">
            <div class="input-group">
              <i class="bi bi-card-text icono-input"></i>
              <input
                v-model="document_number"
                type="text"
                id="document_number"
                class="input-text"
                placeholder="Ingrese número de documento"
                required
              />
            </div>
          </div>
          <button type="submit" class="btn-accion">
            <i class="bi bi-search"></i> Buscar Cliente
          </button>
        </form>
      </div>

      <form v-else @submit.prevent="actualizarCliente" class="formulario">
        <div class="campo">
          <div class="input-group">
            <i class="bi bi-person icono-input"></i>
            <input 
              v-model="cliente.fullName" 
              type="text" 
              id="fullName" 
              class="input-text"
              placeholder="Nombre completo"
              required
            />
          </div>
        </div>

        <div class="campo">
          <div class="input-group">
            <i class="bi bi-envelope icono-input"></i>
            <input 
              v-model="cliente.email" 
              type="email" 
              id="email" 
              class="input-text"
              placeholder="Correo electrónico"
              required
            />
          </div>
        </div>

        <div class="campo">
          <div class="input-group">
            <i class="bi bi-telephone icono-input"></i>
            <input 
              v-model="cliente.phoneNumber" 
              type="text" 
              id="phoneNumber" 
              class="input-text"
              placeholder="Número de teléfono"
            />
          </div>
        </div>

        <div class="campo">
          <div class="input-group">
            <i class="bi bi-geo-alt icono-input"></i>
            <textarea 
              v-model="cliente.address" 
              id="address" 
              class="input-textarea"
              placeholder="Dirección completa"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="campo-doble">
          <div class="campo">
            <div class="input-group">
              <i class="bi bi-credit-card icono-input"></i>
              <select 
                v-model="cliente.documentType" 
                id="documentType" 
                class="input-select"
              >
                <option value="CI">Cédula de Identidad</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>
          </div>

          <div class="campo">
            <div class="input-group">
              <i class="bi bi-123 icono-input"></i>
              <input 
                v-model="cliente.documentNumber" 
                type="text" 
                id="documentNumber" 
                class="input-text"
                placeholder="Número de documento"
                disabled
              />
            </div>
          </div>
        </div>

        <div class="botones">
          <button type="submit" class="btn-accion btn-guardar">
            <i class="bi bi-save"></i> Actualizar
          </button>
          <button type="button" @click="limpiarFormulario" class="btn-accion btn-cancelar">
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
          <button type="button" @click="eliminarCliente" class="btn-accion btn-eliminar">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>

        <div v-if="mensaje" class="mensaje" :class="{ 'error': esError }">
          <i class="bi" :class="esError ? 'bi-exclamation-triangle' : 'bi-check-circle'"></i>
          {{ mensaje }}
        </div>
      </form>
    </section>

    <footer class="footer animate__animated animate__fadeIn">
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.clientes-app {
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-x: hidden;
}

.hero {
  padding: 80px 20px 50px;
  text-align: center;
  position: relative;
  width: 100%;
  max-width: 1200px;
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
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 800;
  background: linear-gradient(to right, #3ded97, #2fa8f8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(61, 237, 151, 0.3);
  letter-spacing: 1px;
}

.descripcion {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: #a0a8c0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.formulario-container {
  width: 100%;
  max-width: 800px;
  margin: 30px 0;
}

.formulario-inicial {
  display: flex;
  justify-content: center;
}

.formulario {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.05);
  width: 100%;
  max-width: 500px;
}

.campo {
  margin-bottom: 25px;
  position: relative;
}

.campo-doble {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  position: relative;
}

.icono-input {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #3ded97;
  font-size: 1.2rem;
}

.input-text,
.input-select,
.input-textarea {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-text:focus,
.input-select:focus,
.input-textarea:focus {
  outline: none;
  border-color: #3ded97;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.2);
}

.input-textarea {
  min-height: 120px;
  resize: vertical;
}

.input-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233ded97' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 15px;
}

.botones {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.btn-accion {
  padding: 15px 30px;
  font-size: 1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.btn-guardar {
  background: linear-gradient(135deg, #3ded97, #2fa8f8);
  color: #fff;
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.3);
}

.btn-guardar:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(61, 237, 151, 0.5);
}

.btn-cancelar {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

.btn-cancelar:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.btn-eliminar {
  background: linear-gradient(135deg, #f72585, #b5179e);
  color: #fff;
  box-shadow: 0 0 15px rgba(247, 37, 133, 0.3);
}

.btn-eliminar:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(247, 37, 133, 0.5);
}

.mensaje {
  margin-top: 30px;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(61, 237, 151, 0.2);
  border: 1px solid rgba(61, 237, 151, 0.5);
}

.mensaje.error {
  background: rgba(244, 63, 94, 0.2);
  border: 1px solid rgba(244, 63, 94, 0.5);
}

.footer {
  margin-top: auto;
  padding: 40px 0 30px;
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
  .formulario {
    padding: 30px 20px;
  }
  
  .campo-doble {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .botones {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn-accion {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .formulario {
    padding: 25px 15px;
  }
  
  .input-text,
  .input-select,
  .input-textarea {
    padding: 12px 12px 12px 40px;
    font-size: 0.95rem;
  }
  
  .icono-input {
    font-size: 1rem;
    left: 12px;
  }
}
</style>