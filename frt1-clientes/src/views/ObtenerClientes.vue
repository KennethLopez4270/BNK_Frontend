<template>
  <div class="clientes-app">
    <section class="hero animate__animated animate__fadeIn">
      <h1 class="titulo">Listado de Clientes</h1>
      <p class="descripcion">
        Visualiza y gestiona todos los clientes registrados en el sistema
      </p>
    </section>

    <section class="filtros-container animate__animated animate__fadeInUp">
      <div class="filtros">
        <div class="input-group">
          <i class="bi bi-search icono-input"></i>
          <input
            type="text"
            v-model="filtroNombre"
            placeholder="Buscar por nombre..."
            class="input-busqueda"
          />
        </div>
        
        <div class="input-group">
          <i class="bi bi-card-text icono-input"></i>
          <input
            type="text"
            v-model="filtroDocumento"
            placeholder="Buscar por documento..."
            class="input-busqueda"
          />
        </div>
        
        <button @click="resetFiltros" class="btn-accion btn-limpiar">
          <i class="bi bi-arrow-counterclockwise"></i> Limpiar
        </button>
      </div>
    </section>

    <section class="tabla-container animate__animated animate__fadeInUp">
      <div class="tabla-header">
        <div class="total-clientes">
          <i class="bi bi-people-fill"></i> Mostrando {{ clientesFiltrados.length }} de {{ clientes.length }} clientes
        </div>
        <!--
        <button @click="descargarExcel" class="btn-accion btn-exportar">
          <i class="bi bi-file-earmark-excel"></i> Exportar
        </button> -->
      </div>

      <div class="tabla-scroll">
        <table class="tabla-clientes">
          <thead>
            <tr>
              <th @click="ordenarPor('fullName')" class="sortable-header">
                <div class="header-content">
                  <span>Nombre</span>
                  <i class="bi" :class="{
                    'bi-arrow-up': campoOrden === 'fullName' && ordenAscendente,
                    'bi-arrow-down': campoOrden === 'fullName' && !ordenAscendente
                  }"></i>
                </div>
              </th>
              <th>Email</th>
              <th>Teléfono</th>
              <th @click="ordenarPor('documentType')" class="sortable-header">
                <div class="header-content">
                  <span>Tipo Doc.</span>
                  <i class="bi" :class="{
                    'bi-arrow-up': campoOrden === 'documentType' && ordenAscendente,
                    'bi-arrow-down': campoOrden === 'documentType' && !ordenAscendente
                  }"></i>
                </div>
              </th>
              <th @click="ordenarPor('documentNumber')" class="sortable-header">
                <div class="header-content">
                  <span>N° Documento</span>
                  <i class="bi" :class="{
                    'bi-arrow-up': campoOrden === 'documentNumber' && ordenAscendente,
                    'bi-arrow-down': campoOrden === 'documentNumber' && !ordenAscendente
                  }"></i>
                </div>
              </th>
              <!--
              <th>Acciones</th>-->
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
              <td>{{ cliente.fullName }}</td>
              <td>{{ cliente.email }}</td>
              <td>{{ cliente.phoneNumber }}</td>
              <td>{{ cliente.documentType }}</td>
              <td>{{ cliente.documentNumber }}</td>
              <!--
              <td class="acciones">
                <button 
                  @click="editarCliente(cliente.id)" 
                  class="btn-accion btn-pequeno"
                >
                  <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button 
                  @click="eliminarCliente(cliente.id)" 
                  class="btn-accion btn-pequeno btn-eliminar"
                >
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </td> -->
            </tr>
            <tr v-if="clientesFiltrados.length === 0">
              <td colspan="6" class="sin-resultados">
                <i class="bi bi-exclamation-circle"></i> No se encontraron clientes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <footer class="footer animate__animated animate__fadeIn">
      © 2025 Gestión Premium. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const clientes = ref([])
const filtroNombre = ref('')
const filtroDocumento = ref('')
const campoOrden = ref('fullName')
const ordenAscendente = ref(true)

// Obtener clientes al cargar el componente
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8081/api/clients')
    clientes.value = response.data
  } catch (error) {
    console.error('Error al obtener clientes:', error)
  }
})

// Filtrar y ordenar clientes
const clientesFiltrados = computed(() => {
  let filtrados = [...clientes.value]

  // Aplicar filtros
  if (filtroNombre.value) {
    filtrados = filtrados.filter(cliente =>
      cliente.fullName.toLowerCase().includes(filtroNombre.value.toLowerCase())
    )
  }

  if (filtroDocumento.value) {
    filtrados = filtrados.filter(cliente =>
      cliente.documentNumber.includes(filtroDocumento.value))
  }

  // Aplicar ordenación
  filtrados.sort((a, b) => {
    const valorA = a[campoOrden.value]
    const valorB = b[campoOrden.value]
    
    if (valorA < valorB) return ordenAscendente.value ? -1 : 1
    if (valorA > valorB) return ordenAscendente.value ? 1 : -1
    return 0
  })

  return filtrados
})

// Ordenar por campo
const ordenarPor = (campo) => {
  if (campoOrden.value === campo) {
    ordenAscendente.value = !ordenAscendente.value
  } else {
    campoOrden.value = campo
    ordenAscendente.value = true
  }
}

// Resetear filtros
const resetFiltros = () => {
  filtroNombre.value = ''
  filtroDocumento.value = ''
}

// Navegar a edición
const editarCliente = (id) => {
  router.push(`/actualizar-cliente/${id}`)
}

// Eliminar cliente
const eliminarCliente = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return

  try {
    await axios.delete(`http://localhost:8081/api/clients/${id}`)
    clientes.value = clientes.value.filter(cliente => cliente.id !== id)
  } catch (error) {
    console.error('Error al eliminar cliente:', error)
    alert('No se pudo eliminar el cliente')
  }
}

// Exportar a Excel (simulado)
const descargarExcel = () => {
  alert('Funcionalidad de exportación a Excel simulada')
  // En una implementación real, usarías una librería como xlsx
}
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

.filtros-container {
  width: 100%;
  max-width: 1100px;
  margin-bottom: 30px;
}

.filtros {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.input-group {
  flex: 1;
  min-width: 200px;
  position: relative;
  display: flex;
  align-items: center;
}

.icono-input {
  position: absolute;
  left: 15px;
  color: #a0a8c0;
  font-size: 1rem;
}

.input-busqueda {
  flex: 1;
  padding: 12px 15px 12px 40px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-busqueda:focus {
  outline: none;
  border-color: #3ded97;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.2);
}

.tabla-container {
  width: 100%;
  max-width: 1100px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.05);
  margin-bottom: 40px;
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.total-clientes {
  color: #a0a8c0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabla-scroll {
  overflow-x: auto;
  border-radius: 10px;
}

.tabla-clientes {
  width: 100%;
  border-collapse: collapse;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  overflow: hidden;
}

.tabla-clientes th,
.tabla-clientes td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid rgba(61, 237, 151, 0.1);
}

.tabla-clientes th {
  color: #3ded97;
  font-weight: 600;
  background: rgba(15, 23, 42, 0.8);
}

.sortable-header {
  cursor: pointer;
  transition: background-color 0.3s;
}

.sortable-header:hover {
  background-color: rgba(61, 237, 151, 0.1) !important;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabla-clientes tbody tr {
  transition: all 0.3s;
}

.tabla-clientes tbody tr:hover {
  background-color: rgba(61, 237, 151, 0.05);
}

.sin-resultados {
  text-align: center;
  padding: 30px;
  color: #a0a8c0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2fa8f8);
  color: #fff;
  padding: 10px 20px;
  font-size: 0.95rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.3);
}

.btn-accion:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(61, 237, 151, 0.5);
}

.btn-limpiar {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.btn-limpiar:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-exportar {
  background: linear-gradient(135deg, #4cc9f0, #4361ee);
}

.btn-eliminar {
  background: linear-gradient(135deg, #f72585, #b5179e);
}

.btn-pequeno {
  padding: 6px 12px;
  font-size: 0.85rem;
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
  .filtros {
    flex-direction: column;
    align-items: stretch;
  }
  
  .tabla-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .tabla-clientes th,
  .tabla-clientes td {
    padding: 10px 8px;
    font-size: 0.9rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .tabla-clientes {
    display: block;
  }
  
  .tabla-clientes thead {
    display: none;
  }
  
  .tabla-clientes tbody tr {
    display: block;
    margin-bottom: 15px;
    border: 1px solid rgba(61, 237, 151, 0.2);
    border-radius: 8px;
    padding: 10px;
  }
  
  .tabla-clientes tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border: none;
  }
  
  .tabla-clientes tbody td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #3ded97;
    margin-right: 15px;
  }
  
  .sin-resultados {
    display: block;
    padding: 20px;
  }
}
</style>