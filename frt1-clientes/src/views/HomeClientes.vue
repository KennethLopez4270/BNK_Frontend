<template>
  <div class="clientes-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Gestión de Clientes</h1>
      <p class="descripcion">
        Control total de clientes, decisiones inteligentes y crecimiento asegurado
      </p>
    </section>

    <section class="botones-grid">
      <div 
        class="card-accion animate__animated animate__fadeInUp"
        style="animation-delay: 0.1s"
        @click="irACrear"
      >
        <div class="icono-wrapper">
          <div class="icono bg-blue">
            <i class="bi bi-person-plus"></i>
          </div>
          <div class="glow glow-blue"></div>
        </div>
        <h3>Registrar Cliente</h3>
        <p class="descripcion-card">Agrega nuevos clientes a tu sistema</p>
        <button class="btn-accion">
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>

      <div 
        class="card-accion animate__animated animate__fadeInUp"
        style="animation-delay: 0.2s"
        @click="irAActualizar"
      >
        <div class="icono-wrapper">
          <div class="icono bg-purple">
            <i class="bi bi-pencil-square"></i>
          </div>
          <div class="glow glow-purple"></div>
        </div>
        <h3>Modificar Cliente</h3>
        <p class="descripcion-card">Actualiza información de clientes existentes</p>
        <button class="btn-accion">
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>

      <div 
        class="card-accion animate__animated animate__fadeInUp"
        style="animation-delay: 0.3s"
        @click="irAObtener"
      >
        <div class="icono-wrapper">
          <div class="icono bg-pink">
            <i class="bi bi-people"></i>
          </div>
          <div class="glow glow-pink"></div>
        </div>
        <h3>Consultar Clientes</h3>
        <p class="descripcion-card">Visualiza el listado completo de clientes</p>
        <button class="btn-accion">
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>

    </section>

    <footer class="footer animate__animated animate__fadeIn">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const irACrear = () => router.push('/crear-cliente')
const irAEliminar = () => router.push('/eliminar-cliente')
const irAActualizar = () => router.push('/actualizar-cliente')
const irAObtener = () => router.push('/obtener-clientes')
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

.botones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1100px;
  padding: 50px 20px;
  position: relative;
  z-index: 1;
}

.card-accion {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 35px 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(61, 237, 151, 0.1);
  position: relative;
  overflow: hidden;
  will-change: transform;
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
  min-height: 40px;
  line-height: 1.6;
  transition: color 0.3s;
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
  .botones-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 30px 20px;
  }
  
  .hero {
    padding: 60px 20px 40px;
  }
  
  .card-accion {
    padding: 25px 20px;
  }
  
  .icono-wrapper {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .botones-grid {
    grid-template-columns: 1fr;
    max-width: 350px;
    gap: 15px;
  }
  
  .hero {
    padding: 50px 20px 30px;
  }
  
  .card-accion {
    padding: 20px 15px;
  }
  
  .icono-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .btn-accion {
    width: 40px;
    height: 40px;
  }
}
</style>
