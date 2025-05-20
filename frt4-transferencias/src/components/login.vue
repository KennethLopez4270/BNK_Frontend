<template>
  <div class="login-app">
    <section class="hero">
      <h1 class="titulo animate__animated animate__fadeInDown">Bienvenido a Banco Chuno</h1>
      <p class="descripcion animate__animated animate__fadeIn" :style="{ animationDelay: '0.2s' }">
        Inicia sesión para gestionar tus finanzas de forma segura
      </p>
    </section>

    <div class="login-content">
      <div class="login-section animate__animated animate__zoomIn">
        <form @submit.prevent="submitLogin" class="p-4">
          <!-- Email -->
          <div class="form-group mb-4 animate__animated animate__fadeInUp" :style="{ animationDelay: '0.3s' }" :class="{ 'animate__shakeX': shake }">
            <label class="form-label"><i class="bi bi-envelope"></i> Correo electrónico</label>
            <input
              type="email"
              v-model="email"
              placeholder="Correo electrónico"
              class="form-control"
              required
              @focus="resetShake"
            />
          </div>

          <!-- Contraseña -->
          <div class="form-group mb-4 animate__animated animate__fadeInUp" :style="{ animationDelay: '0.4s' }" :class="{ 'animate__shakeX': shake }">
            <label class="form-label"><i class="bi bi-lock"></i> Contraseña</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Contraseña"
                class="form-control"
                required
                @focus="resetShake"
              />
              <span class="toggle-password" @click="togglePassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
          </div>

          <!-- Botón -->
          <button 
            type="submit" 
            class="btn-accion w-100 animate__animated animate__fadeInUp" 
            :style="{ animationDelay: '0.5s' }" 
            @mousedown="pulseAnimation"
          >
            <i class="bi bi-sign-in-alt me-2"></i> Iniciar sesión
          </button>
        </form>
      </div>

      <!-- Modal para errores -->
      <div
        class="modal fade"
        id="errorModal"
        tabindex="-1"
        aria-labelledby="errorModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content animate__animated animate__zoomIn">
            <div class="modal-header">
              <h5 class="modal-title" id="errorModalLabel">Error</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              {{ errorMessage }}
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @mousedown="pulseAnimation"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      © 2025 Banco Digital. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as bootstrap from 'bootstrap'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const shake = ref(false)
const errorMessage = ref('')
const router = useRouter()

function togglePassword() {
  showPassword.value = !showPassword.value
}

function resetShake() {
  shake.value = false
}

// Animación de pulsación para botones y enlaces
function pulseAnimation(event) {
  const element = event.target
  element.classList.add('animate__pulse')
  setTimeout(() => {
    element.classList.remove('animate__pulse')
  }, 300)
}
async function submitLogin() {
  if (!email.value || !password.value) {
    shake.value = true
    setTimeout(() => (shake.value = false), 500)
    errorMessage.value = 'Por favor, completa todos los campos.'
    const modal = new bootstrap.Modal(document.getElementById('errorModal'))
    modal.show()
    return
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email.value, 
        password: password.value
      }),
    })

    const data = await response.json()

    if (!response.ok || data.message) {
      errorMessage.value = data.message || 'Correo o contraseña incorrectos'
      const modal = new bootstrap.Modal(document.getElementById('errorModal'))
      modal.show()
      throw new Error(data.message || 'Credenciales inválidas')
    }

    // Almacenar token y datos del usuario
    localStorage.setItem("user", JSON.stringify({
      id: data.id,
      email: data.email,
      role: data.role,
      token: data.token
    }))
    const routeByRole = {
      CLIENTE: "/",
      ADMIN: "/admin-dashboard"
    }

    router.push(routeByRole[data.role] || "/")
  } catch (error) {
    console.error("Error en el login:", error.message)
    errorMessage.value = 'Error de conexión. Por favor, intenta de nuevo.'
    const modal = new bootstrap.Modal(document.getElementById('errorModal'))
    modal.show()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.login-app {
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Estilos de los modales */
.modal-content {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(61, 237, 151, 0.3);
  color: #fff;
}

.modal-header {
  border-bottom: 1px solid rgba(61, 237, 151, 0.2);
}

.modal-title {
  color: #3ded97;
}

.modal-body {
  color: #a0a8c0;
}

.modal-footer {
  border-top: 1px solid rgba(61, 237, 151, 0.2);
}

.btn-close {
  filter: invert(1);
}

/* Estilos principales */
.hero {
  padding: 60px 20px 40px;
  text-align: center;
  position: relative;
  width: 100%;
  max-width: 1000px;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 20px;
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

.login-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 500px;
}

.login-section {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  transition: all 0.3s;
}

.login-section:hover {
  box-shadow: 0 10px 20px rgba(61, 237, 151, 0.15);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 1.1rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-control {
  height: 45px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-control:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.3);
  transform: scale(1.02);
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #a0a8c0;
  font-size: 1.2rem;
}

.toggle-password:hover {
  color: #3ded97;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2a9d8f);
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.btn-accion:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(61, 237, 151, 0.4);
}

.links {
  color: #a0a8c0;
}

.links a {
  color: #3ded97;
  text-decoration: none;
  transition: all 0.3s;
}

.links a:hover {
  color: #2fa8f8;
  text-decoration: underline;
}

.footer {
  margin-top: 50px;
  padding: 20px 0;
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
  .hero {
    padding: 40px 20px 30px;
  }
  
  .titulo {
    font-size: 2rem;
  }
  
  .descripcion {
    font-size: 1rem;
  }
  
  .login-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .login-content {
    max-width: 100%;
  }
  
  .form-control {
    font-size: 0.9rem;
    height: 40px;
  }
  
  .btn-accion {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>