<template>
  <div class="obtener-clientes">
    <section class="hero">
      <h1 class="titulo">Listado de Clientes</h1>
      <p class="descripcion">
        Visualiza y gestiona todos los clientes registrados en el sistema.
      </p>
    </section>

    <section class="filtros">
      <div class="busqueda">
        <input
          type="text"
          v-model="filtroNombre"
          placeholder="Buscar por nombre..."
          class="input-busqueda"
        />
        <input
          type="text"
          v-model="filtroDocumento"
          placeholder="Buscar por documento..."
          class="input-busqueda"
        />
        <button @click="resetFiltros" class="btn-accion btn-limpiar">
          Limpiar
        </button>
      </div>
    </section>

    <section class="tabla-container">
      <div class="tabla-header">
        <div class="total-clientes">
          Mostrando {{ clientesFiltrados.length }} de {{ clientes.length }} clientes
        </div>
        <!--
        <button @click="descargarExcel" class="btn-accion btn-exportar">
          Exportar a Excel
        </button> -->
      </div>

      <div class="tabla-scroll">
        <table class="tabla-clientes">
          <thead>
            <tr>
              <th @click="ordenarPor('fullName')">
                Nombre
                <span v-if="campoOrden === 'fullName'">
                  {{ ordenAscendente ? '↑' : '↓' }}
                </span>
              </th>
              <th>Email</th>
              <th>Teléfono</th>
              <th @click="ordenarPor('documentType')">
                Tipo Doc.
                <span v-if="campoOrden === 'documentType'">
                  {{ ordenAscendente ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="ordenarPor('documentNumber')">
                N° Documento
                <span v-if="campoOrden === 'documentNumber'">
                  {{ ordenAscendente ? '↑' : '↓' }}
                </span>
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
                  Editar
                </button>
                <button 
                  @click="eliminarCliente(cliente.id)" 
                  class="btn-accion btn-pequeno btn-eliminar"
                >
                  Eliminar
                </button>
              </td> -->
            </tr>
            <tr v-if="clientesFiltrados.length === 0">
              <td colspan="6" class="sin-resultados">
                No se encontraron clientes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <footer class="footer">
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
.obtener-clientes {
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
}

.descripcion {
  font-size: 1.2rem;
  color: #ccc;
  margin: 20px 0;
}

.filtros {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 30px;
}

.busqueda {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.input-busqueda {
  flex: 1;
  min-width: 200px;
  padding: 12px 15px;
  border: 1px solid #3ded97;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 1rem;
}

.tabla-container {
  width: 100%;
  max-width: 1000px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.2);
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.total-clientes {
  color: #ccc;
}

.tabla-scroll {
  overflow-x: auto;
}

.tabla-clientes {
  width: 100%;
  border-collapse: collapse;
}

.tabla-clientes th,
.tabla-clientes td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #333;
}

.tabla-clientes th {
  color: #3ded97;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.tabla-clientes th:hover {
  background-color: rgba(61, 237, 151, 0.1);
}

.tabla-clientes tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.sin-resultados {
  text-align: center;
  padding: 30px;
  color: #ccc;
}

.acciones {
  display: flex;
  gap: 10px;
}

.btn-pequeno {
  padding: 8px 15px;
  font-size: 0.9rem;
}

.btn-accion {
  background-color: #24d26a;
  color: #fff;
  padding: 12px 25px;
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

.btn-limpiar {
  background-color: #555;
  box-shadow: 0 0 10px #555;
}

.btn-limpiar:hover {
  background-color: #444;
}

.btn-exportar {
  background-color: #2a7dd1;
  box-shadow: 0 0 10px #2a7dd1;
}

.btn-exportar:hover {
  background-color: #1a6cbe;
}

.btn-eliminar {
  background-color: #d9534f;
  box-shadow: 0 0 10px #d9534f;
}

.btn-eliminar:hover {
  background-color: #c9302c;
}

.footer {
  margin-top: auto;
  padding: 30px 0;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
}

@media (max-width: 768px) {
  .tabla-clientes th,
  .tabla-clientes td {
    padding: 10px 5px;
    font-size: 0.9rem;
  }
  
  .acciones {
    flex-direction: column;
    gap: 5px;
  }
  
  .btn-pequeno {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
}
</style>