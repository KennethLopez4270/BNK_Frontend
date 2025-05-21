<template>
  <div class="banco-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Banco Digital</h1>
      <p class="descripcion">
        Gestiona tus productos bancarios de forma rápida y segura
      </p>
    </section>

    <section class="botones-container">
      <div class="botones-grid">
        <!-- Primera fila con 3 botones -->
        <div class="fila primera-fila">
          <div 
            v-for="(boton, index) in botones.slice(0, 3)" 
            :key="boton.label" 
            class="card-accion animate__animated animate__fadeInUp"
            :style="`animation-delay: ${index * 0.1}s`"
            @click="boton.action"
          >
            <div class="icono-wrapper">
              <div class="icono" :class="`bg-${colors[index]}`">
                <i :class="`bi ${boton.icon}`"></i>
              </div>
              <div class="glow" :class="`glow-${colors[index]}`"></div>
            </div>
            <h3>{{ boton.label }}</h3>
            <p class="descripcion-card">{{ boton.descripcion }}</p>
            <button class="btn-accion">
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
        
        <!-- Segunda fila con 2 botones centrados -->
        <div class="fila segunda-fila">
          <div 
            v-for="(boton, index) in botones.slice(3, 5)" 
            :key="boton.label" 
            class="card-accion animate__animated animate__fadeInUp"
            :style="`animation-delay: ${(index + 3) * 0.1}s`"
            @click="boton.action"
          >
            <div class="icono-wrapper">
              <div class="icono" :class="`bg-${colors[index + 3]}`">
                <i :class="`bi ${boton.icon}`"></i>
              </div>
              <div class="glow" :class="`glow-${colors[index + 3]}`"></div>
            </div>
            <h3>{{ boton.label }}</h3>
            <p class="descripcion-card">{{ boton.descripcion }}</p>
            <button class="btn-accion">
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer animate__animated animate__fadeIn">
      © 2025 Banco Digital. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import 'animate.css'

const router = useRouter()

const colors = ['blue', 'purple', 'pink', 'green', 'orange']

const botones = [
  { 
    label: 'Clientes', 
    descripcion: 'Gestión de clientes y perfiles', 
    icon: 'bi-people-fill', 
    action: () => router.push('/clientes') 
  },
  { 
    label: 'Cuentas', 
    descripcion: 'Administración de cuentas bancarias', 
    icon: 'bi-bank2', 
    action: () => router.push('/cuentas') 
  },
  { 
    label: 'Pagos', 
    descripcion: 'Realiza y gestiona tus pagos', 
    icon: 'bi-credit-card-fill', 
    action: () => router.push('/pagos') 
  },
  { 
    label: 'Transferencias', 
    descripcion: 'Transferencias entre cuentas', 
    icon: 'bi-arrow-left-right', 
    action: () => router.push('/transferencias') 
  },
  { 
    label: 'Préstamos', 
    descripcion: 'Solicitud y gestión de préstamos', 
    icon: 'bi-cash-stack', 
    action: () => router.push('/prestamos') 
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.banco-app {
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

/* Contenedor principal de botones */
.botones-container {
  width: 100%;
  max-width: 1100px;
  padding: 50px 20px;
  position: relative;
  z-index: 1;
}

/* Estructura de filas */
.fila {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.primera-fila {
  justify-content: space-between;
}

.segunda-fila {
  justify-content: center;
}

/* Estilos de las tarjetas */
.card-accion {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(61, 237, 151, 0.1);
  position: relative;
  overflow: hidden;
  will-change: transform;
  width: 100%;
  max-width: 320px;
  min-width: 250px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-accion::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(61, 237, 151, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}

.card-accion:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.15);
  border-color: rgba(61, 237, 151, 0.3);
}

.card-accion:hover::before {
  opacity: 1;
}

.card-accion h3 {
  margin: 25px 0 15px;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.card-accion h3::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: currentColor;
  opacity: 0.5;
  transition: all 0.3s;
}

.card-accion:hover h3::after {
  width: 50px;
  opacity: 1;
}

.descripcion-card {
  color: #a0a8c0;
  font-size: 0.95rem;
  margin-bottom: 25px;
  line-height: 1.6;
  transition: color 0.3s;
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.card-accion:hover .descripcion-card {
  color: #d1d9f0;
}

.icono-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.icono {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  position: relative;
  z-index: 2;
  transition: all 0.4s;
}

.bg-blue { background-color: #4361ee; }
.bg-purple { background-color: #7b2cbf; }
.bg-pink { background-color: #f72585; }
.bg-green { background-color: #4cc9f0; }
.bg-orange { background-color: #f8961e; }

.icono i {
  color: white;
}

.glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(15px);
  transition: all 0.4s;
}

.glow-blue { background-color: #4361ee; }
.glow-purple { background-color: #7b2cbf; }
.glow-pink { background-color: #f72585; }
.glow-green { background-color: #4cc9f0; }
.glow-orange { background-color: #f8961e; }

.card-accion:hover .icono {
  transform: scale(1.1) rotate(5deg);
}

.card-accion:hover .glow {
  transform: scale(1.2);
  opacity: 0.9;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2fa8f8);
  color: #fff;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.5);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.btn-accion::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    transparent,
    transparent,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: rotate(30deg);
}

.btn-accion:hover {
  transform: scale(1.1);
  box-shadow: 0 0 25px rgba(61, 237, 151, 0.8);
}

.btn-accion:hover::before {
  animation: shine 1.5s infinite;
}

@keyframes shine {
  100% {
    transform: translateX(100%) rotate(30deg);
  }
}

.footer {
  margin-top: auto;
  padding: 40px 0 30px;
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  position: relative;
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

/* Responsive Design */
@media (max-width: 900px) {
  .primera-fila {
    justify-content: center;
  }
  
  .card-accion {
    max-width: 280px;
  }
}

@media (max-width: 600px) {
  .hero {
    padding: 60px 20px 40px;
  }
  
  .botones-container {
    padding: 30px 20px;
  }
  
  .fila {
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .card-accion {
    min-width: 100%;
    max-width: 100%;
    padding: 25px 15px;
  }
  
  .titulo {
    font-size: 1.8rem;
  }
  
  .descripcion {
    font-size: 1rem;
  }
}
</style>