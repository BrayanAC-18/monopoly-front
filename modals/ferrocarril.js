
import Casilla from "../modals/casilla.js";
export default class  Ferrocarril extends Casilla {
    constructor(posicion, nombre, precio, mortgage, rent) {
        super(posicion, nombre);
        this.precio = precio
        this.mortgage = mortgage
        this.rent = rent
    }
  calcularRenta(jugador, todasPropiedades) {
    let ferros = todasPropiedades.filter(
      p => p instanceof Ferrocarril && p.dueñoId === jugador.id
    ).length;

    return this.rentaBase * Math.pow(2, ferros - 1); 
    // 25, 50, 100, 200 según cuántos tenga
  }
}