<template>
  <div class="gestor-cuentas">
    <!-- Pantalla de validación de documento -->
    <div v-if="!isAuthenticated" class="auth-screen">
      <section class="hero">
        <h1 class="titulo">Validación de Identidad</h1>
        <p class="descripcion">Por favor, ingresa tu número de documento para continuar.</p>
      </section>
      <form @submit.prevent="validateDocument" class="auth-form">
        <label for="document-number" class="label">Número de documento:</label>
        <input
          type="text"
          v-model="documentNumber"
          id="document-number"
          placeholder="Ej: 12345678"
          required
          class="input"
        />
        <button type="submit" class="btn-accion">Validar</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>

    <!-- Pantalla de gestión de pagos (se muestra después de validar) -->
    <div v-else>
      <section class="hero">
        <h1 class="titulo">Gestión de Pagos de Servicios</h1>
        <p class="descripcion">Administra y paga tus servicios de agua, luz, teléfono, gas y más.</p>
      </section>

      <!-- Lista de servicios disponibles -->
      <section class="botones-grid">
        <div v-for="service in services" :key="service.id" class="card-accion">
          <div class="icono" :class="`bg-${service.color}`">
            <i :class="`bi ${service.icon}`"></i>
          </div>
          <h3>{{ service.name }}</h3>
          <p>Monto pendiente: ${{ service.amount }}</p>
          <button @click="payService(service.id)" class="btn-accion">Pagar ahora</button>
        </div>
      </section>

      <!-- Formulario para agregar un nuevo servicio -->
      <section class="add-service">
        <h2 class="titulo">Agregar un nuevo servicio</h2>
        <form @submit.prevent="addService" class="auth-form">
          <label for="service-type" class="label">Tipo de servicio:</label>
          <select v-model="newService.type" id="service-type" required class="input">
            <option value="agua">Agua</option>
            <option value="luz">Luz</option>
            <option value="telefono">Teléfono</option>
            <option value="gas">Gas</option>
            <option value="otro">Otro</option>
          </select>

          <label for="service-amount" class="label">Monto:</label>
          <input
            type="number"
            v-model="newService.amount"
            id="service-amount"
            placeholder="Ingresa el monto"
            required
            class="input"
          />

          <button type="submit" class="btn-accion">Agregar servicio</button>
        </form>
      </section>

      <!-- Mensaje de confirmación -->
      <p v-if="message" class="message">{{ message }}</p>

      <footer class="footer">
        © 2025 Gestión Premium. Todos los derechos reservados.
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePagos',
  data() {
    return {
      isAuthenticated: false,
      documentNumber: '',
      errorMessage: '',
      services: [
        { id: 1, name: 'Agua', amount: 1500, icon: 'bi-droplet', color: 'primary' },
        { id: 2, name: 'Luz', amount: 3200, icon: 'bi-lightbulb', color: 'warning' },
        { id: 3, name: 'Teléfono', amount: 1200, icon: 'bi-telephone', color: 'success' },
      ],
      newService: {
        type: '',
        amount: null,
      },
      message: '',
    };
  },
  methods: {
    validateDocument() {
      const documentRegex = /^\d{8}$/;
      if (!documentRegex.test(this.documentNumber)) {
        this.errorMessage = 'Por favor, ingresa un número de documento válido (8 dígitos).';
        return;
      }
      this.isAuthenticated = true;
      this.errorMessage = '';
      this.message = 'Validación exitosa. Ahora puedes gestionar tus pagos.';
    },
    payService(serviceId) {
      const service = this.services.find((s) => s.id === serviceId);
      if (service) {
        this.message = `Procesando pago de ${service.name} por $${service.amount}...`;
        setTimeout(() => {
          this.services = this.services.filter((s) => s.id !== serviceId);
          this.message = `Pago de ${service.name} realizado con éxito.`;
        }, 2000);
      }
    },
    addService() {
      const newId = this.services.length + 1;
      const serviceName = this.newService.type.charAt(0).toUpperCase() + this.newService.type.slice(1);
      const newService = {
        id: newId,
        name: serviceName,
        amount: parseFloat(this.newService.amount),
        icon: 'bi-' + (this.newService.type === 'agua' ? 'droplet' : this.newService.type === 'luz' ? 'lightbulb' : this.newService.type === 'telefono' ? 'telephone' : this.newService.type === 'gas' ? 'fire' : 'gear'),
        color: this.newService.type === 'agua' ? 'primary' : this.newService.type === 'luz' ? 'warning' : this.newService.type === 'telefono' ? 'success' : this.newService.type === 'gas' ? 'danger' : 'primary',
      };
      this.services.push(newService);
      this.message = `Servicio de ${serviceName} agregado con éxito.`;
      this.newService.type = '';
      this.newService.amount = null;
    },
  },
};
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

.card-accion p {
  color: #ccc;
  font-size: 1rem;
  margin: 10px 0;
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

.auth-screen {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-form {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 30px 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.label {
  font-size: 1rem;
  color: #ccc;
}

.input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #333;
  color: #fff;
}

.input::placeholder {
  color: #888;
}

.error {
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 10px;
}

.add-service {
  width: 100%;
  max-width: 500px;
  padding: 40px 20px;
}

.message {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  color: #3ded97;
  margin: 20px 0;
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