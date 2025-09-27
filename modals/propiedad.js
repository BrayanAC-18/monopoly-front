import Casilla from "./casilla.js";

export default class Propiedad extends Casilla {
  constructor(posicion, nombre, precio, renta, color, mortgage) {
    super(posicion, nombre);
    this.precio = precio;
    this.renta = renta; // { base, casas: [r1, r2, r3, r4], hotel }
    this.color = color;
    this.dueño = null;
    this.casas = 0;
    this.hotel = false;
    this.hipotecada = false;
    this.mortgage = mortgage; // Valor de hipoteca
  }


  //  Renta dinámica
  calcularRenta() {
    if (this.hotel) return this.renta.hotel;
    if (this.casas > 0) return this.renta.casas[this.casas - 1];
    return this.renta.base;
  }
  getMortgage(){
    return this.mortgage;
  }

  getColor(){
    return this.color
  }
  getPrecio(){
    return this.precio
  }
  getHipotecada(){
    return this.hipotecada
  }

  // 🔑 Dueño
  getDueño() {
    return this.dueño;
  }

  setDueño(jugador) {
    this.dueño = jugador;
    jugador.propiedades.push(this);
  }

  // 🏦 Hipoteca
  hipotecar() {
    if (!this.hipotecada) {
      this.hipotecada = true;
      return this.mortgage;
    }
    return 0;
  }

  deshipotecar() {
    if (this.hipotecada) {
      const costo = Math.floor(this.mortgage * 1.1); // +10% interés
      if (this.dueño.cash >= costo) {
        this.dueño.cash -= costo;
        this.hipotecada = false;
        return costo;
      }
    }
    return 0;
  }

  //  Construcciones
  puedeConstruir(tablero) {
    if (!this.dueño) return false;
    // Todas las propiedades del mismo color
    const grupo = tablero.casillas.filter(
      (c) => c.color === this.color && c instanceof Propiedad
    );
    return grupo.every((p) => p.dueño === this.dueño);
  }

  construirCasa(tablero) {
    if (this.puedeConstruir(tablero) && this.casas < 4 && !this.hotel) {
      const costo = 100
      if (this.dueño.cash >= costo) {
        this.dueño.pagar(costo)
        this.casas++;
        return true;
      }
    }
    return false;
  }

  construirHotel(juego) {
    if (this.puedeConstruir(juego) && this.casas === 4 && !this.hotel) {
      const costo = 250;
      if (this.dueño.cash >= costo) {
        this.dueño.pagar(costo)
        this.casas = 0;
        this.hotel = true;
        return true;
      }
    }
    return false;
  }

  //  Para sidebar
  renderSidebar() {
    let estado = "";
    if (this.hipotecada) estado = " (Hipotecada)";
    else if (this.hotel) estado = " 🏨 Hotel";
    else if (this.casas > 0) estado = ` 🏠 x${this.casas}`;

    return `
      <li class="${this.hipotecada ? "mortgaged" : ""}">
        ${this.nombre}${estado}
      </li>
    `;
  }
}
