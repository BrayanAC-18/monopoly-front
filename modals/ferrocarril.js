import Propiedad from "../modals/propiedad.js";
export default class  Ferrocarril extends Propiedad {
  constructor(nombre, precio) {
    super(nombre, precio, 25); // renta base 25
  }

  calcularRenta(jugador, todasPropiedades) {
    let ferros = todasPropiedades.filter(
      p => p instanceof Ferrocarril && p.dueñoId === jugador.id
    ).length;

    return this.rentaBase * Math.pow(2, ferros - 1); 
    // 25, 50, 100, 200 según cuántos tenga
  }
}