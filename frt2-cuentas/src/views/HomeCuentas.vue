<template>
  <div class="container text-center mt-5 animate__animated animate__fadeIn">
    <h1 class="mb-4">Gestión de Cuentas</h1>

    <div class="d-grid gap-3 col-6 mx-auto">
      <button class="btn btn-primary" @click="irACrear">
        Crear Cuenta
      </button>
      <button class="btn btn-danger" @click="irAEliminar">
        Eliminar CUenta
      </button>
      <button class="btn btn-warning" @click="irAActualizar">
        Actualizar Cuenta
      </button>
      <button class="btn btn-success" @click="irAObtener">
        Obtener Cuentas
      </button>
      <button class="btn btn-success" @click="irADepositar">
        Depositar
      </button>
      <button class="btn btn-success" @click="irAExtraer">
        Extraer
      </button>
    </div>
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
</script>

<style scoped>
@import "animate.css";
</style>
