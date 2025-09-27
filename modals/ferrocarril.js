import Casilla from "../modals/casilla.js";
export default class Ferrocarril extends Casilla {
  constructor(posicion, nombre, precio, mortgage, rent) {
    super(posicion, nombre);
    this.precio = precio;
    this.mortgage = mortgage;
    this.renta = rent;
    this.dueño = null;
    this.hipotecada = false;
  }

  calcularRenta(dueño) {
    const todasPropiedades = dueño.getPropiedades();
    let ferros = todasPropiedades.filter((p) => p instanceof Ferrocarril).length;
    if (ferros === 0) return 0;
    const renta = this.renta[ferros.toString()]
    return renta
  }

  getMortgage() {
    return this.mortgage;
  }
  getHipotecada() {
    return this.hipotecada;
  }
  getDueño() {
    return this.dueño;
  }
  setDueño(jugador) {
    this.dueño = jugador;
    jugador.propiedades.push(this);
  }
  getPrecio() {
    return this.precio;
  }
  //marcar como comprada
  marcarComoDelJugador(jugador) {
    const casillaDiv = document.getElementById(`casilla-${this.posicion}`);
    if (!casillaDiv) return;

    // quitar colores de grupo que vienen del backend
    casillaDiv.classList.remove(
      "brown",
      "purple",
      "pink",
      "orange",
      "red",
      "yellow",
      "green",
      "blue"
    );

    // quitar posibles colores de jugadores anteriores
    casillaDiv.classList.remove(
      "propietario-verde",
      "propietario-rojo",
      "propietario-azul",
      "propietario-amarillo"
    );

    // añadir clase según el color del jugador
    casillaDiv.classList.add(`propietario-${jugador.color}`);
  }

  marcarComoHipotecada() {
    const casillaDiv = document.getElementById(`casilla-${this.posicion}`);
    if (!casillaDiv) return;

    casillaDiv.classList.remove(
      "brown",
      "purple",
      "pink",
      "orange",
      "red",
      "yellow",
      "green",
      "blue",
      "propietario-verde",
      "propietario-rojo",
      "propietario-azul",
      "propietario-amarillo"
    );

    casillaDiv.classList.add("hipotecada");
  }

  marcarComoDeshipotecada(jugador) {
    const casillaDiv = document.getElementById(`casilla-${this.posicion}`);
    if (!casillaDiv) return;

    casillaDiv.classList.remove("hipotecada");
    casillaDiv.classList.add(`propietario-${jugador.color}`);
  }
}
