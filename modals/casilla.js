export default class Casilla {
  constructor(id, nombre) {
    this.posicion = id;         // posición o identificador de la casilla
    this.nombre = nombre; // nombre que se muestra
  }

  ejecutar() {
  }

  getPosicion() {
    return this.posicion;
  }

  getNombre() {
    return this.nombre;
  }
}
