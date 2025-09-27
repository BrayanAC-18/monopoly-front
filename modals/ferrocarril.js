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
    const renta = this.renta.ferros.toString()
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
}
