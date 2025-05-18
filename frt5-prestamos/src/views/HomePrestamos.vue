<template>
  <div class="prestamos-home">
    <section class="hero">
      <h1 class="titulo">Gestión de Préstamos</h1>
      <p class="descripcion">Selecciona una acción para administrar los préstamos</p>
    </section>
    
    <section class="botones-grid">
      <div 
        v-for="boton in botones" 
        :key="boton.label" 
        class="card-accion"
        @click="boton.action"
      >
        <div class="icono" :style="`background-color: ${getColor(boton.color)}; box-shadow: 0 0 15px ${getColor(boton.color)}`">
          <i :class="`bi ${boton.icon}`"></i>
        </div>
        <h3>{{ boton.label }}</h3>
        <button class="btn-accion">Ir</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irACrear = () => router.push('/crear-prestamo')
const irAEliminar = () => router.push('/eliminar-prestamo')
const irAActualizar = () => router.push('/actualizar-prestamo')
const irAObtener = () => router.push('/obtener-prestamos')

const botones = [
  { label: 'Solicitar Préstamo', icon: 'bi-cash-stack', color: 'success', action: irACrear },
  { label: 'Cancelar Préstamo', icon: 'bi-x-circle', color: 'danger', action: irAEliminar },
  { label: 'Modificar Préstamo', icon: 'bi-pencil-square', color: 'warning', action: irAActualizar },
  { label: 'Consultar Préstamos', icon: 'bi-list-check', color: 'info', action: irAObtener },
]

const getColor = (color) => {
  const colors = {
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    primary: '#007bff',
    secondary: '#6c757d'
  }
  return colors[color] || '#3ded97'
}
</script>

<style scoped>
.prestamos-home {
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
  background: linear-gradient(to bottom, #122523, #000);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.hero {
  padding: 60px 20px 40px;
  text-align: center;
}

.titulo {
  font-size: 2.5rem;
  font-weight: 800;
  color: #3ded97;
  margin-bottom: 15px;
}

.descripcion {
  font-size: 1.2rem;
  color: #ccc;
  max-width: 600px;
  margin: 0 auto;
}

.botones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 900px;
  padding: 20px;
  justify-content: center;
}

.card-accion {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 210px;
}

.card-accion:hover {
  transform: translateY(-5px);
  border-color: #3ded97;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.2);
}

.icono {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: white;
  transition: all 0.3s ease;
}

.card-accion:hover .icono {
  transform: scale(1.1);
}

.card-accion h3 {
  font-size: 1.2rem;
  margin: 20px 0;
  color: #fff;
  flex-grow: 1;
}

.btn-accion {
  background-color: #24d26a;
  color: #fff;
  padding: 10px 25px;
  font-size: 1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 0 10px #24d26a;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.btn-accion:hover {
  background-color: #24d26a;
}

@media (max-width: 768px) {
  .botones-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .card-accion {
    min-height: 250px;
  }
}
</style>