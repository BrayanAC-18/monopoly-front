export default class Especial extends Casilla {
    constructor(posicion, nombre, tipo) {
        super(posicion, nombre);
        this.tipo = tipo; // impuesto, carcel, sorpresa, etc.
    }

    accion(jugador) {
        // Implementar lógica según tipo
        switch (this.tipo) {
            case "impuesto":
                jugador.pagar(this.cantidad);
                break;
            case "carcel":
                jugador.setEnCarcel(true);
                break;
            case "sorpresa":
            case "cajaComunidad":
                // Se obtiene carta aleatoria
                break;
        }
    }

    getTipo() {
        return this.tipo;
    }
}
