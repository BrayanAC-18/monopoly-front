import Sidebar from "../modals/sidebar.js";
export default class Jugador {
  constructor(id, nombre, pais, ficha, color) {
    this.id = id;
    this.nombre = nombre;
    this.pais = pais;
    this.ficha = ficha;   // emoji o ícono
    this.color = color;
    this.dinero = 1500;
    this.propiedades = [];
    this.enCarcel = false;
    this.posicion = 0;
  }

  mover(pasos, tablero) {
  // Total de casillas en el tablero
  const totalCasillas = tablero.getCasillas().length;

  const posicionInicial = this.posicion;
  // Nueva posición (ciclo tipo 0 → 39 → 0 otra vez)
  this.posicion = (this.posicion + pasos) % totalCasillas;

  // Si pasó por la casilla de salida
  if (this.posicion < posicionInicial) {
    this.dinero += 200; // Dar 200 al jugador
    console.log(`${this.nombre} pasó por la salida y recibió 200`);
  }

  // Buscar la casilla por ID
  const casilla = tablero.obtenerCasilla(this.posicion);

  if (casilla) {
    // Ejecutar acción de la casilla
    casilla.ejecutar(this);
  } else {
    console.warn(`No se encontró casilla con id ${this.posicion}`);
  }
}


  comprarPropiedad(propiedad) {
    if (this.dinero >= propiedad.precio && !propiedad.getDueño()) {
      this.dinero -= propiedad.precio;
      propiedad.setDueño(this);
      return true;
    }
    alert("Sin saldo suficiente")
    return false;
  }

  comprarFerro(ferrocarril) {
    console.log(ferrocarril)
    if (this.dinero >= ferrocarril.precio && !ferrocarril.getDueño()) {
      this.dinero -= ferrocarril.precio;
      ferrocarril.setDueño(this);
      return true;
    }
    alert("Sin saldo suficiente")
    return false;
  }

  pagar(cantidad) {
    this.dinero -= cantidad;
    if (this.dinero < 0) {
      // aquí podrías marcar bancarrota
      this.dinero = 0;
      return false;
    }
    return true;
  }

  cobrar(cantidad) {
    this.dinero += cantidad;
  }

  hipotecar(propiedad) {
    if (this.propiedades.includes(propiedad)) {
      const dineroRecibido = propiedad.hipotecar();
      if (dineroRecibido > 0){
        this.cobrar(dineroRecibido);
      }
    }
  }

  deshipotecar(propiedad) {
    if (this.propiedades.includes(propiedad)) {
      const costo = propiedad.deshipotecar();
      this.pagar(costo);
    }
  }

  eliminarPropiedad(propiedad) {
    this.propiedades = this.propiedades.filter(p => p !== propiedad);
  }

  // Getters y Setters
  getDinero() { return this.dinero; }
  setDinero(cantidad) { this.dinero = Math.max(0, cantidad); }

  getPropiedades() { return this.propiedades; }

  getEnCarcel() { return this.enCarcel; }
  setEnCarcel(valor) { this.enCarcel = valor; }

  getId() { return this.id; }
  getNombre() { return this.nombre; }
  getPais() { return this.pais; }
  getFicha() { return this.ficha; }
  getPosicion() { return this.posicion; }
  setPosicion(casillaId) { this.posicion = casillaId; }
}
