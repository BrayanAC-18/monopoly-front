import Casilla from "../modals/casilla.js";

export default class Especial extends Casilla {
    constructor(posicion, nombre, tipo, accion) {
        super(posicion, nombre);
        this.tipo = tipo; // special, tax, chance.
        this.accion = accion; //objeto o null      
    }

    static chance = [];
    static community = [];

    static async cargarCartas() {
        const response = await fetch("http://127.0.0.1:5000/board");
        const data = await response.json();
        Especial.chance = data.chance || [];
        Especial.community = data.community_chest || [];
    }

    async ejecutar(jugador) {
        switch (this.tipo) {
            case "special": // pueden o no tener acción
                if (this.accion){
                    if (this.accion.money){
                        console.log(`${jugador.getNombre()} ha cobrado $${this.accion.money} por ${this.nombre}`)
                        jugador.cobrar(this.accion.money)
                    }
                    else{
                        jugador.setEnCarcel(true)
                        jugador.setPosicion(10)
                    }
                }
                break;
            case "tax":
                console.log(`${jugador.getNombre()} pagó ${-(this.accion.money)} por ${this.nombre}`);
                jugador.pagar(-this.accion.money) //en backend esta como negativo, se convierte n positivo
                break;
            case "chance":{
                const carta = this.tomarCarta(Especial.chance)
                console.log(`${jugador.getNombre()} tomó carta: ${carta.description}`);
                if (carta.action.money < 0){
                    jugador.pagar(-carta.action.money)
                }else{
                    jugador.cobrar(carta.action.money)
                }
                break;
            }
            case "community_chest":{
                const carta = this.tomarCarta(Especial.community)
                console.log(`${jugador.getNombre()} tomó carta: ${carta.description}`);
                if (carta.action.money < 0){
                    jugador.pagar(-carta.action.money)
                }else{
                    jugador.cobrar(carta.action.money)
                }
                break;
            }
        }
    }

    tomarCarta(cartas){
        const index = Math.floor(Math.random() * cartas.length);
        const carta = cartas[index];
        return carta;
    }

    getTipo() {
        return this.tipo;
    }
}
