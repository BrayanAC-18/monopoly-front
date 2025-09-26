export default class Casilla {
    constructor(id, nombre) {
        this.getPosicion = id;
        this.nombre = nombre;
    }

    accion(jugador) {
        // Implementado en subclases
        throw new Error("Método abstracto 'accion' debe ser implementado");
    }

    getPosicion() {
        return this.getPosicion
    }

    getNombre() {
        return this.id;
    }
}
