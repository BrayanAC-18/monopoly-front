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
    if (this.hotel) return this.renta.withHotel;
    if (this.casas > 0) return this.renta.withHouse[this.casas - 1];
    return this.renta.base;
  }
  getMortgage() {
    return this.mortgage;
  }

  getColor() {
    return this.color;
  }
  getPrecio() {
    return this.precio;
  }
  getHipotecada() {
    return this.hipotecada;
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
      const costo = 100;
      if (this.dueño.getDinero() >= costo) {
        this.dueño.pagar(costo);
        this.casas++;
        return true;
      }
    }
    return false;
  }

  getCasas(){
    return this.casas
  }

  construirHotel(juego) {
    if (this.puedeConstruir(juego) && this.casas === 4 && !this.hotel) {
      const costo = 250;
      if (this.dueño.getDinero() >= costo) {
        this.dueño.pagar(costo);
        this.casas = 0;
        this.hotel = true;
        return true;
      }
    }
    return false;
  }
  getHotel(){
    return this.hotel?1:0
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
