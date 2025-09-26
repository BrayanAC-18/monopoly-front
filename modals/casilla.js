export default class Casilla {
  constructor(id, nombre) {
    this.id = id;         // posición o identificador de la casilla
    this.nombre = nombre; // nombre que se muestra
  }

  accion(jugador) {
    throw new Error("Método abstracto 'accion' debe ser implementado por la subclase");
  }

  getPosicion() {
    return this.id;
  }

  getNombre() {
    return this.nombre;
  }
}
