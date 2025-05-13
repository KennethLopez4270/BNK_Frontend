<template>
  <div class="home-clientes">
    <section class="hero">
      <h1 class="titulo">Impulsa tu gestión financiera</h1>
      <p class="descripcion">
        Control total de clientes, decisiones inteligentes, y crecimiento asegurado.
      </p>
      <button class="btn-principal" @click="irACrear">Comenzar ahora</button>
    </section>

    <section class="acciones">
      <h2 class="subtitulo">Acciones del Sistema</h2>
      <div class="botones">
        <button class="btn-accion" @click="irACrear">Registrar</button>
        <button class="btn-accion" @click="irAObtener">Consultar</button>
        <button class="btn-accion" @click="irAActualizar">Modificar y Eliminar</button>
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

const irACrear = () => router.push('/crear-cliente')
const irAEliminar = () => router.push('/eliminar-cliente')
const irAActualizar = () => router.push('/actualizar-cliente')
const irAObtener = () => router.push('/obtener-clientes')
</script>

<style scoped>
.home-clientes {
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

.btn-principal {
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
.btn-principal:hover {
  background-color: #1abc5c;
}

.acciones {
  background: #000;
  padding: 60px 20px;
  width: 100%;
  text-align: center;
}

.subtitulo {
  font-size: 2rem;
  font-weight: 700;
  color: #3ded97;
  margin-bottom: 40px;
}

.botones {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
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

.footer {
  margin-top: auto;
  padding: 30px 0;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
}
</style>
