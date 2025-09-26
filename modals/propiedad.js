export default class Propiedad extends Casilla {
    constructor(posicion, nombre, precio, renta, color, mortgage) {
        super(posicion, nombre);
        this.precio = precio;
        this.renta = renta;
        this.color = color;
        this.dueño = null;
        this.casas = 0;
        this.hotel = false;
        this.hipotecada = false;
        this.mortgage = mortgage; // Valor de hipoteca
    }

    accion(jugador) {
        if (!this.dueño) {
            // Opción de compra
            jugador.comprar(this);
        } else if (this.dueño !== jugador && !this.hipotecada) {
            jugador.pagar(this.calcularRenta());
        }
    }

    calcularRenta() {
        if (this.hotel) return this.renta.hotel;
        if (this.casas > 0) return this.renta.casas[this.casas - 1];
        return this.renta.base;
    }

    getDueño() {
        return this.dueño;
    }

    setDueño(jugador) {
        this.dueño = jugador;
    }

    getPrecio() {
        return this.precio;
    }

    getCasas() {
        return this.casas;
    }

    construirCasa() {
        if (this.casas < 4) this.casas++;
        else this.construirHotel();
    }

    construirHotel() {
        if (this.casas === 4 && !this.hotel) {
            this.casas = 0;
            this.hotel = true;
        }
    }

    hipotecar() {
        if (!this.hipotecada) {
            this.hipotecada = true;
            return this.mortgage;
        }
        return 0;
    }

    deshipotecar() {
        if (this.hipotecada) {
            this.hipotecada = false;
            return this.mortgage * 1.1; // +10% interés
        }
        return 0;
    }
}
