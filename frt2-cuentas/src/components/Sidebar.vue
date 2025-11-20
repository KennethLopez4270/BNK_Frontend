<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <div class="sidebar-header">
      <h2 class="logo" @click="toggleCollapse">
        <span v-if="!collapsed">Gestión de Cuentas</span>
        <i v-else class="bi bi-list"></i>
      </h2>
      <button class="collapse-btn" @click="toggleCollapse">
        <i class="bi" :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in navItems" :key="item.path">
          <router-link 
            :to="item.path" 
            class="nav-link"
            :class="{ 'active': $route.path === item.path }"
          >
            <i class="bi" :class="item.icon"></i>
            <span v-if="!collapsed">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer" v-if="!collapsed">
      <p class="user-info">
        <i class="bi bi-person-circle"></i> {{ currentUser }}
      </p>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['toggle']);

const props = defineProps({
  user: {
    type: String,
    default: 'Funcionario'
  },
  navConfig: {
    type: Array,
    default: () => [
      { path: '/', title: 'Inicio', icon: 'bi-house' },
      { path: '/crear-cuenta', title: 'Crear Cuenta', icon: 'bi-plus-circle' },
      { path: '/actualizar-cuenta', title: 'Actualizar Cuenta', icon: 'bi-pencil-square' },
      { path: '/eliminar-cuentas', title: 'Eliminar Cuentas', icon: 'bi-trash' },
      { path: '/obtener-cuentas', title: 'Consultar Cuentas', icon: 'bi-search' },
      { path: '/depositar', title: 'Depositar', icon: 'bi-arrow-down-circle' },
      { path: '/extraer', title: 'Extraer', icon: 'bi-arrow-up-circle' }
    ]
  }
});

const collapsed = ref(true);
const navItems = computed(() => props.navConfig);
const currentUser = computed(() => props.user);

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

const checkScreenSize = () => {
  if (window.innerWidth < 768) {
    collapsed.value = true;
  }
};

watch(collapsed, (val) => {
  emit('toggle', val);
});

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

.sidebar {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #0f2027, #203a43);
  color: #fff;
  width: 350px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border-right: 1px solid rgba(61, 237, 151, 0.1);
  overflow: hidden;
  position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    height: 100%;
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(to right, #3ded97, #2fa8f8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  white-space: nowrap;
}

.collapse-btn {
  background: transparent;
  border: none;
  color: #a0a8c0;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
}

.collapse-btn:hover {
  color: #3ded97;
  background: rgba(61, 237, 151, 0.1);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.5rem;
  color: #a0a8c0;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link:hover::before,
.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(to bottom, #3ded97, #2fa8f8);
}

.nav-link.active {
  color: #fff;
  background: rgba(61, 237, 151, 0.1);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a8c0;
  margin: 0;
}

/* Ocultar texto en modo colapsado */
.sidebar-collapsed .logo span,
.sidebar-collapsed .nav-link span,
.sidebar-collapsed .user-info {
  display: none;
}

.sidebar-collapsed .nav-link {
  justify-content: center;
  padding: 0.8rem 0;
}

.sidebar-collapsed .sidebar-nav {
  padding: 1rem 0.5rem;
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    height: 100%;
    transform: translateX(-100%);
  }

  .sidebar.sidebar-collapsed {
    transform: translateX(0);
    width: 70px;
  }

  .sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
    width: 250px;
  }
}
</style>
