<template>
  <div class="gestor-pagos">
    <!-- Pantalla de validación de documento -->
    <div v-if="!isAuthenticated" class="auth-screen animate__animated animate__fadeIn">
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

    <!-- Pantalla de gestión de pagos -->
    <div v-else class="animate__animated animate__fadeIn">
      <section class="hero">
        <h1 class="titulo">Gestión de Pagos de Servicios</h1>
        <p class="descripcion">Administra y paga tus servicios de agua, luz, teléfono, gas y más.</p>
      </section>

      <!-- Lista de servicios disponibles -->
      <section class="botones-grid">
        <div 
          v-for="service in services" 
          :key="service.id" 
          class="card-accion animate__animated animate__fadeInUp"
          :style="`animation-delay: ${service.id * 0.1}s`"
        >
          <div class="icono-wrapper">
            <div class="icono" :class="`bg-${service.color}`">
              <i :class="`bi ${service.icon}`"></i>
            </div>
            <div class="glow" :class="`glow-${service.color}`"></div>
          </div>
          <h3>{{ service.name }}</h3>
          <p class="descripcion-card">Monto pendiente: ${{ service.amount }}</p>
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

      <footer class="footer animate__animated animate__fadeIn">
        © 2025 Banco Digital. Todos los derechos reservados.
      </footer>
    </div>
  </div>
</template>

<script>
import 'animate.css';

export default {
  name: 'HomePagos',
  data() {
    return {
      isAuthenticated: false,
      documentNumber: '',
      errorMessage: '',
      services: [
        { id: 1, name: 'Agua', amount: 1500, icon: 'bi-droplet', color: 'blue' },
        { id: 2, name: 'Luz', amount: 3200, icon: 'bi-lightbulb', color: 'yellow' },
        { id: 3, name: 'Teléfono', amount: 1200, icon: 'bi-telephone', color: 'green' },
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
        icon: 'bi-' + (this.newService.type === 'agua' ? 'droplet' : 
              this.newService.type === 'luz' ? 'lightbulb' : 
              this.newService.type === 'telefono' ? 'telephone' : 
              this.newService.type === 'gas' ? 'fire' : 'gear'),
        color: this.newService.type === 'agua' ? 'blue' : 
              this.newService.type === 'luz' ? 'yellow' : 
              this.newService.type === 'telefono' ? 'green' : 
              this.newService.type === 'gas' ? 'red' : 'purple',
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

.gestor-pagos {
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
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #3ded97, #2fa8f8);
  -webkit-background-clip: text;
  background-clip: text; 
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(61, 237, 151, 0.3);
  letter-spacing: 1px;
}

.descripcion {
  font-size: 1.3rem;
  color: #a0a8c0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.botones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1100px;
  padding: 50px 20px;
  position: relative;
  z-index: 1;
}

.card-accion {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 35px 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(61, 237, 151, 0.1);
  position: relative;
  overflow: hidden;
}

.card-accion::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(61, 237, 151, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}

.card-accion:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.15);
  border-color: rgba(61, 237, 151, 0.3);
}

.card-accion:hover::before {
  opacity: 1;
}

.card-accion h3 {
  margin: 25px 0 15px;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.card-accion h3::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: currentColor;
  opacity: 0.5;
  transition: all 0.3s;
}

.card-accion:hover h3::after {
  width: 50px;
  opacity: 1;
}

.descripcion-card {
  color: #a0a8c0;
  font-size: 0.95rem;
  margin-bottom: 25px;
  min-height: 40px;
  line-height: 1.6;
  transition: color 0.3s;
}

.card-accion:hover .descripcion-card {
  color: #d1d9f0;
}

.icono-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.icono {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  position: relative;
  z-index: 2;
  transition: all 0.4s;
}

.icono i {
  color: white;
}

.bg-blue { background-color: #4361ee; }
.bg-yellow { background-color: #ffc107; }
.bg-green { background-color: #4cc9f0; }
.bg-red { background-color: #f72585; }
.bg-purple { background-color: #7b2cbf; }

.glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(15px);
  transition: all 0.4s;
}

.glow-blue { background-color: #4361ee; }
.glow-yellow { background-color: #ffc107; }
.glow-green { background-color: #4cc9f0; }
.glow-red { background-color: #f72585; }
.glow-purple { background-color: #7b2cbf; }

.card-accion:hover .icono {
  transform: scale(1.1) rotate(5deg);
}

.card-accion:hover .glow {
  transform: scale(1.2);
  opacity: 0.9;
}

.btn-accion {
  background: linear-gradient(135deg, #3ded97, #2fa8f8);
  color: #fff;
  padding: 10px 25px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(61, 237, 151, 0.5);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 500;
}

.btn-accion::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    transparent,
    transparent,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: rotate(30deg);
}

.btn-accion:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(61, 237, 151, 0.8);
}

.btn-accion:hover::before {
  animation: shine 1.5s infinite;
}

.auth-screen {
  width: 100%;
  max-width: 500px;
  padding: 50px 20px;
}

.auth-form {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 35px 25px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.label {
  font-size: 1rem;
  color: #a0a8c0;
}

.input {
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #16272c;
  font-size: 1rem;
  transition: all 0.3s;
}

.input:focus {
  outline: none;
  border-color: rgba(61, 237, 151, 0.3);
  box-shadow: 0 0 10px rgba(61, 237, 151, 0.2);
}

.input::placeholder {
  color: #6b7280;
}

.error {
  color: #f72585;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
}

.add-service {
  width: 100%;
  max-width: 600px;
  padding: 50px 20px;
}

.message {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px 25px;
  text-align: center;
  color: #3ded97;
  margin: 20px auto;
  max-width: 600px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.footer {
  margin-top: auto;
  padding: 40px 0 30px;
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  position: relative;
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

@keyframes shine {
  100% {
    transform: translateX(100%) rotate(30deg);
  }
}

@media (max-width: 768px) {
  .botones-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .titulo {
    font-size: 2.2rem;
  }
}

@media (max-width: 480px) {
  .botones-grid {
    grid-template-columns: 1fr;
  }
  
  .titulo {
    font-size: 1.8rem;
  }
  
  .descripcion {
    font-size: 1.1rem;
  }
  
  .card-accion {
    padding: 25px 20px;
  }
}
</style>