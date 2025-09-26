export default class Carta {
    constructor(efecto, descripcion) {
        this.efecto = efecto; // función que altera jugador
        this.descripcion = descripcion;
    }

    aplicar(jugador) {
        this.efecto(jugador);
    }

    getDescripcion() {
        return this.descripcion;
    }
}