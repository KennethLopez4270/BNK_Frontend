<template>
  <div class="app-container">
    <!-- Navbar -->
    <nav class="navbar">
      <h2 class="logo" @click="irAHomePrincipal" style="cursor: pointer;">
        Banco Chuno
      </h2>
      <div class="nav-links">
        <button class="nav-btn" @click="load('http://localhost:5174')">
          <i class="bi bi-credit-card"></i> Gestión Clientes
        </button>
        <button class="nav-btn" @click="load('http://localhost:5175')">
          <i class="bi bi-arrow-left-right"></i> Gestión Cuentas
        </button>
        <button class="nav-btn" @click="load('http://localhost:5178')">
          <i class="bi bi-cash-stack"></i> Gestión Préstamos
        </button>
      </div>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <iframe
        v-if="url"
        :src="url"
        frameborder="0"
        class="iframe-view"
      ></iframe>
      <div v-else class="placeholder-container">
        <div class="placeholder-content">
          <i class="bi bi-grid"></i>
          <p>Selecciona un módulo desde la barra de navegación</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const url = ref('')
function load(u) {
  url.value = u
}
const irAHomePrincipal = () => router.push('/')
</script>

<style scoped>
/* Estilos base consistentes con tus otros componentes */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
}

/* Navbar estilizado */
.navbar {
  background: linear-gradient(135deg, #0f2027, #203a43);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(61, 237, 151, 0.1);
  position: relative;
  z-index: 10;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #3ded97, #2fa8f8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(61, 237, 151, 0.3);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-btn:hover {
  background: rgba(61, 237, 151, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(61, 237, 151, 0.2);
}

.nav-btn i {
  font-size: 1.1rem;
}

/* Contenido principal - manteniendo coherencia */
.main-content {
  flex: 1;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  position: relative;
}

.iframe-view {
  width: 100%;
  height: 100%;
  border: none;
}

.placeholder-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder-content {
  text-align: center;
  color: #a0a8c0;
  max-width: 400px;
}

.placeholder-content i {
  font-size: 3rem;
  color: rgba(61, 237, 151, 0.3);
  margin-bottom: 1rem;
}

.placeholder-content p {
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-links {
    width: 100%;
    overflow-x: auto;
    padding: 0.5rem 0;
    gap: 0.8rem;
  }
  
  .nav-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>