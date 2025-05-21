<template>
  <div class="app-container">
    <Sidebar/>
    
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
    margin-left: 70px; /* Para el sidebar colapsado */
  }
}
</style>