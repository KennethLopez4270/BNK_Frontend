<template>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.prestamos-app {
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
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.input-group {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.icono-input {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #3ded97;
  font-size: 1.2rem;
}

.input-busqueda {
  width: 100%;
  padding: 12px 15px 12px 45px;
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

.lista-container {
  width: 100%;
  max-width: 1100px;
  margin-bottom: 30px;
}

.lista-prestamos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.card-prestamo {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.card-prestamo:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(61, 237, 151, 0.1);
  border-color: rgba(61, 237, 151, 0.3);
}

.card-prestamo.seleccionado {
  border: 2px solid #3ded97;
  box-shadow: 0 0 20px rgba(61, 237, 151, 0.2);
}

.icono-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
}

.icono {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s;
}

.bg-blue { background-color: #4361ee; }
.bg-purple { background-color: #7b2cbf; }
.bg-pink { background-color: #f72585; }
.bg-green { background-color: #4cc9f0; }

.icono i {
  color: white;
}

.glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(15px);
  transition: all 0.3s;
}

.glow-blue { background-color: #4361ee; }
.glow-purple { background-color: #7b2cbf; }
.glow-pink { background-color: #f72585; }
.glow-green { background-color: #4cc9f0; }

.info-prestamo {
  text-align: center;
  width: 100%;
}

.info-prestamo h3 {
  color: #3ded97;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.detalle {
  color: #a0a8c0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.detalle i {
  color: #3ded97;
}

.estado {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.estado.activo {
  background: rgba(61, 237, 151, 0.2);
  color: #3ded97;
}

.estado.pendiente {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
}

.estado.rechazado {
  background: rgba(244, 63, 94, 0.2);
  color: #f43f5e;
}

.estado.pagado {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
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

.btn-pequeno {
  padding: 8px 15px;
  font-size: 0.9rem;
}

.btn-guardar {
  background: linear-gradient(135deg, #3ded97, #2fa8f8);
}

.btn-guardar:disabled {
  background: rgba(108, 117, 125, 0.5);
  box-shadow: none;
  cursor: not-allowed;
}

.btn-secundario {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.btn-secundario:hover {
  background: rgba(255, 255, 255, 0.2);
}

.cargando,
.sin-resultados,
.mensaje {
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.cargando {
  color: #a0a8c0;
}

.sin-resultados {
  color: #a0a8c0;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(61, 237, 151, 0.1);
}

.mensaje {
  background: rgba(61, 237, 151, 0.2);
  border: 1px solid rgba(61, 237, 151, 0.5);
}

.mensaje.error {
  background: rgba(244, 63, 94, 0.2);
  border: 1px solid rgba(244, 63, 94, 0.5);
  color: #f43f5e;
}

.formulario-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
}

.formulario-modificacion {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(61, 237, 151, 0.1);
  box-shadow: 0 15px 30px rgba(61, 237, 151, 0.05);
}

.subtitulo {
  font-size: 1.5rem;
  color: #3ded97;
  margin-bottom: 25px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.form-modificar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.campo {
  margin-bottom: 15px;
}

.input-text,
.input-select {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-text:focus,
.input-select:focus {
  outline: none;
  border-color: #3ded97;
  box-shadow: 0 0 0 2px rgba(61, 237, 151, 0.2);
}

.input-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233ded97' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 15px;
}

.botones-form {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.resultado-calculo {
  text-align: center;
  padding: 15px;
  background: rgba(61, 237, 151, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(61, 237, 151, 0.3);
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.resultado-calculo p {
  margin: 0;
  color: #fff;
  font-size: 1.1rem;
}

.resultado-calculo strong {
  color: #3ded97;
}

.boton-volver {
  margin-bottom: 30px;
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
  .form-columnas {
    grid-template-columns: 1fr;
  }
  
  .botones-form {
    flex-direction: column;
  }
  
  .lista-prestamos {
    grid-template-columns: 1fr;
  }
  
  .subtitulo {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .input-text,
  .input-select {
    padding: 12px 12px 12px 40px;
    font-size: 0.95rem;
  }
  
  .icono-input {
    font-size: 1rem;
    left: 12px;
  }
  
  .card-prestamo {
    padding: 20px;
  }
}
</style>
