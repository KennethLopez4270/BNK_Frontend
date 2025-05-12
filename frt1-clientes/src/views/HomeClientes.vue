<template>
  <div class="container text-center mt-5 animate__animated animate__fadeIn">
    <h1 class="mb-4">Gestión de Clientes</h1>

    <div class="d-grid gap-3 col-6 mx-auto">
      <button class="btn btn-primary" @click="irACrear">
        Crear Cliente
      </button>
      <button class="btn btn-danger" @click="irAEliminar">
        Eliminar Cliente
      </button>
      <button class="btn btn-warning" @click="irAActualizar">
        Actualizar Cliente
      </button>
      <button class="btn btn-success" @click="irAObtener">
        Obtener Clientes
      </button>
    </div>
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
@import "animate.css";
</style>
