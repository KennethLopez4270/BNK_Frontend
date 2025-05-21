<template>
  <div class="home-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Bienvenido al Banco Digital</h1>
      <p class="descripcion">
        Selecciona tu tipo de acceso para continuar
      </p>
    </section>

    <section class="botones-container">
      <div class="botones-wrapper animate__animated animate__fadeInUp">
        <div 
          class="card-acceso"
          @click="irACliente"
          @mouseenter="hoverCard(0)"
          @mouseleave="hoverCard(null)"
        >
          <div class="icono-wrapper">
            <div class="icono bg-blue">
              <i class="bi bi-person"></i>
            </div>
            <div class="glow glow-blue"></div>
          </div>
          <h3>Acceso Cliente</h3>
          <p class="descripcion-card">Accede a tu banca online personal</p>
          <button class="btn-accion">
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>

        <div 
          class="card-acceso"
          @click="irAFuncionario"
          @mouseenter="hoverCard(1)"
          @mouseleave="hoverCard(null)"
        >
          <div class="icono-wrapper">
            <div class="icono bg-green">
              <i class="bi bi-person-gear"></i>
            </div>
            <div class="glow glow-green"></div>
          </div>
          <h3>Acceso Funcionario</h3>
          <p class="descripcion-card">Área administrativa del banco</p>
          <button class="btn-accion">
            <i class="bi bi-arrow-right"></i>
          </button>
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

const irACliente = () => router.push('/cliente')
const irAFuncionario = () => router.push('/funcionario')

const hoverCard = (index) => {
  // Efecto adicional al hacer hover (opcional)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.home-app {
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
  font-size: 1.3rem;
  color: #a0a8c0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.botones-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 50px 20px;
}

.botones-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 600px;
  width: 100%;
}

.card-acceso {
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
}

.card-acceso::before {
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

.card-acceso:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.15);
  border-color: rgba(61, 237, 151, 0.3);
}

.card-acceso:hover::before {
  opacity: 1;
}

.card-acceso h3 {
  margin: 25px 0 15px;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.card-acceso h3::after {
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

.card-acceso:hover h3::after {
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

.card-acceso:hover .descripcion-card {
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
  border: none; /* Elimina cualquier borde */
  box-shadow: none; /* Elimina sombras internas */
  background: transparent !important; /* Fondo transparente */
}

.icono i :hover{
  color: white;
  text-shadow: 0 0 10px currentColor; /* Brillo al ícono */
  position: relative;
  z-index: 3;
}

.bg-blue { background-color: #4361ee; }
.bg-green { background-color: #4cc9f0; }

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
.glow-green { background-color: #4cc9f0; }

.card-acceso:hover .icono {
  transform: scale(1.1) rotate(5deg);
}

.card-acceso:hover .glow {
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

@media (max-width: 768px) {
  .botones-wrapper {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .titulo {
    font-size: 2.2rem;
  }
}

@media (max-width: 480px) {
  .titulo {
    font-size: 1.8rem;
  }
  
  .descripcion {
    font-size: 1.1rem;
  }
  
  .card-acceso {
    padding: 25px 20px;
  }
}
</style>