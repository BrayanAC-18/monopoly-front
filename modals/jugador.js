export default class Jugador {
  constructor(id, nombre, pais, ficha) {
    this.id = id;
    this.nombre = nombre;
    this.pais = pais;
    this.ficha = ficha;   // emoji o ícono
    this.dinero = 1500;
    this.propiedades = [];
    this.enCarcel = false;
    this.posicion = 0;
  }

  mover(pasos, tablero) {
  // Total de casillas en el tablero
  const totalCasillas = tablero.getCasillas().length;

  // Nueva posición (ciclo tipo 0 → 39 → 0 otra vez)
  this.posicion = (this.posicion + pasos) % totalCasillas;

  // Buscar la casilla por ID
  const casilla = tablero.obtenerCasilla(this.posicion);

  if (casilla) {
    // Ejecutar acción de la casilla
    casilla.accion(this);
  } else {
    console.warn(`No se encontró casilla con id ${this.posicion}`);
  }
}


  comprar(propiedad) {
    if (this.dinero >= propiedad.precio && !propiedad.getDueño()) {
      this.dinero -= propiedad.precio;
      propiedad.setDueño(this);
      this.agregarPropiedad(propiedad);
      return true;
    }
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
      this.cobrar(dineroRecibido);
    }
  }

  deshipotecar(propiedad) {
    if (this.propiedades.includes(propiedad)) {
      const costo = propiedad.deshipotecar();
      this.pagar(costo);
    }
  }

  agregarPropiedad(propiedad) {
    this.propiedades.push(propiedad);
  }

  eliminarPropiedad(propiedad) {
    this.propiedades = this.propiedades.filter(p => p !== propiedad);
  }

  // Getters y Setters
  getDinero() { return this.dinero; }
  setDinero(cantidad) { this.dinero = Math.max(0, cantidad); }

  getPropiedades() { return this.propiedades; }

  isEnCarcel() { return this.enCarcel; }
  setEnCarcel(valor) { this.enCarcel = valor; }

  getId() { return this.id; }
  getNombre() { return this.nombre; }
  getPais() { return this.pais; }
  getFicha() { return this.ficha; }
  getPosicion() { return this.posicion; }
  setPosicion(casillaId) { this.posicion = casillaId; }
}
