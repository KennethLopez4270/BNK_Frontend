<template>
  <div class="gestor-cuentas">
    <section class="hero">
      <h1 class="titulo">Gestión de Cuentas</h1>
      <p class="descripcion">
        Administra las cuentas de tus clientes de forma rápida y sencilla
      </p>
    </section>

    <section class="botones-grid">
      <div 
        v-for="boton in botones" 
        :key="boton.label" 
        class="card-accion"
        @click="boton.action"
      >
        <div class="icono" :class="`bg-${boton.color}`">
          <i :class="`bi ${boton.icon}`"></i>
        </div>
        <h3>{{ boton.label }}</h3>
        <button class="btn-accion">
          Ir
        </button>
      </div>
    </section>

    <footer class="footer">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irACrear = () => router.push('/crear-cuenta')
const irAEliminar = () => router.push('/eliminar-cuentas')
const irAActualizar = () => router.push('/actualizar-cuenta')
const irAObtener = () => router.push('/obtener-cuentas')
const irADepositar = () => router.push('/depositar')
const irAExtraer = () => router.push('/extraer')

const botones = [
  { label: 'Crear Cuenta', icon: 'bi-plus-circle', color: 'primary', action: irACrear },
  { label: 'Eliminar Cuenta', icon: 'bi-trash', color: 'danger', action: irAEliminar },
  { label: 'Actualizar Cuenta', icon: 'bi-pencil-square', color: 'warning', action: irAActualizar },
  { label: 'Obtener Cuentas', icon: 'bi-list-check', color: 'success', action: irAObtener },
  { label: 'Depositar', icon: 'bi-box-arrow-in-down', color: 'info', action: irADepositar },
  { label: 'Extraer', icon: 'bi-box-arrow-up', color: 'secondary', action: irAExtraer }
]
</script>

<style scoped>
.gestor-cuentas {
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
}

.botones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  width: 100%;
  max-width: 1000px;
  padding: 40px 20px;
}

.card-accion {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.card-accion:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(61, 237, 151, 0.1);
}

.card-accion h3 {
  margin: 20px 0;
  color: #fff;
  font-size: 1.2rem;
}

.icono {
  width: 70px;
  height: 70px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.icono i {
  color: white;
}

.bg-primary { background-color: #24d26a; box-shadow: 0 0 15px #24d26a; }
.bg-danger { background-color: #ff4d4d; box-shadow: 0 0 15px #ff4d4d; }
.bg-warning { background-color: #ffc107; box-shadow: 0 0 15px #ffc107; }
.bg-success { background-color: #28a745; box-shadow: 0 0 15px #28a745; }
.bg-info { background-color: #17a2b8; box-shadow: 0 0 15px #17a2b8; }
.bg-secondary { background-color: #6c757d; box-shadow: 0 0 15px #6c757d; }

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
}

.btn-accion:hover {
  background-color: #1abc5c;
}

.footer {
  margin-top: auto;
  padding: 30px 0;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
}

@media (max-width: 768px) {
  .botones-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .botones-grid {
    grid-template-columns: 1fr;
  }
}
</style>