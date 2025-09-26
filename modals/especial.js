import Jugador from "./jugador";
export default class Especial extends Casilla {
    constructor(posicion, nombre, tipo, accion) {
        super(posicion, nombre);
        this.tipo = tipo; // special, tax, chance.
        this.accion = accion; //objeto o null
        this.chance = [];
        this.community = [];


    }

    async cargarCartas(){
        try {
            const response = await fetch(`http://127.0.0.1:5000/board`);
            const data = await response.json();

            this.chance = data.chance;
            this.community = data.community_chest
        } catch (error) {
            console.error("Error cargando cartas:", error);
        }
    }

    async accion(jugador) {
        switch (this.tipo) {
            case "special": // pueden o no tener acción
                if (this.accion){
                    if (this.accion.money){
                        jugador.cobrar(this.accion.money)
                    }
                    else{
                        jugador.setEnCarcel(true)
                        jugador.setPosicion(10)
                    }
                }
                break;
            case "tax":
                jugador.pagar(-this.accion.money) //en backend esta como negativo, se convierte n positivo
                break;
            case "chance":{
                if (!this.chance.length) await this.cargarCartas();
                const carta = this.tomarCarta(this.chance)
                console.log(`${jugador.getNombre()} tomó carta: ${carta.description}`);
                if (carta.action.money < 0){
                    jugador.pagar(-carta.action.money)
                }else{
                    jugador.cobrar(carta.action.money)
                }
                break;
            }
            case "community":{
               if (!this.community.length) await this.cargarCartas();
                const carta = this.tomarCarta(this.community)
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
