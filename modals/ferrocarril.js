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

  hipotecar() {
    if (!this.hipotecada) {
      this.hipotecada = true;
      this.marcarComoHipotecada();
      return this.mortgage;
    }
    return 0;
  }

  deshipotecar() {
    if (this.hipotecada) {
      const costo = Math.floor(this.mortgage * 1.1); // +10% interés
      if (this.dueño.getDinero() >= costo) {
        this.hipotecada = false;
        this.marcarComoDeshipotecada();
        return costo;
      }
    }
    return 0;
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
    casillaDiv.classList.add(`propietario-${jugador.getColor()}`);
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

  marcarComoDeshipotecada() {
    const casillaDiv = document.getElementById(`casilla-${this.posicion}`);
    if (!casillaDiv) return;

    casillaDiv.classList.remove("hipotecada");
    casillaDiv.classList.add(`propietario-${this.dueño.getColor()}`);
  }
}
