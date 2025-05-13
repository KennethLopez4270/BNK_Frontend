<template>
  <div class="container py-5 animate__animated animate__fadeIn">
    <div class="text-center mb-5">
      <h1 class="display-4 fw-bold text-primary animate__animated animate__fadeInDown">Gestión de Cuentas</h1>
      <p class="text-muted">Administra las cuentas de tus clientes de forma rápida y sencilla</p>
    </div>

    <div class="row justify-content-center g-4">
      <div class="col-md-4" v-for="boton in botones" :key="boton.label">
        <div class="card shadow-lg h-100 border-0 animate__animated animate__zoomIn">
          <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
            <i :class="`bi ${boton.icon} fs-1 text-${boton.color} mb-3`"></i>
            <h5 class="card-title">{{ boton.label }}</h5>
            <button
              class="btn btn-outline-primary mt-3"
              :class="`btn-${boton.color}`"
              @click="boton.action"
            >
              Ir
            </button>
          </div>
        </div>
      </div>
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
@import "animate.css";
</style>
