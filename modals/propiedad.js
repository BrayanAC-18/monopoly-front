import Casilla from "./casilla.js";
import { showPopup } from "./popup.js";

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

  //  Acción al caer en la casilla
  accion(jugador, juego) {
    if (!this.dueño) {
      // Opción de compra
      if (jugador.cash >= this.precio) {    
        // aquí puedes abrir popup
        jugador.comprar(this);
        this.setDueño(jugador);
      }
    } else if (this.dueño !== jugador && !this.hipotecada) {
      // Paga renta
      const renta = this.calcularRenta();
      jugador.pagar(renta);
      this.dueño.cobrar(renta);
    } else if (this.dueño === jugador) {
      // Oportunidad de construir
      if (this.puedeConstruir(juego)) {
        // abrir popup: ¿Construir casa u hotel?
      }
    }
  }

  //  Renta dinámica
  calcularRenta() {
    if (this.hotel) return this.renta.hotel;
    if (this.casas > 0) return this.renta.casas[this.casas - 1];
    return this.renta.base;
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
      this.dueño.cash += this.mortgage;
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
  puedeConstruir(juego) {
    if (!this.dueño) return false;
    // Todas las propiedades del mismo color
    const grupo = juego.casillas.filter(
      (c) => c.color === this.color && c instanceof Propiedad
    );
    return grupo.every((p) => p.dueño === this.dueño);
  }

  construirCasa(juego) {
    if (this.puedeConstruir(juego) && this.casas < 4 && !this.hotel) {
      const costo = Math.floor(this.precio * 0.5);
      if (this.dueño.cash >= costo) {
        this.dueño.cash -= costo;
        this.casas++;
        return true;
      }
    }
    return false;
  }

  construirHotel(juego) {
    if (this.puedeConstruir(juego) && this.casas === 4 && !this.hotel) {
      const costo = this.precio;
      if (this.dueño.cash >= costo) {
        this.dueño.cash -= costo;
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
