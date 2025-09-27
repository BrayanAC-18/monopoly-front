import Dado from "./dado.js";

export default class Juego {
  constructor(jugadores = [], tablero = null) {
    this.tablero = tablero;        // 👈 instancia de Tablero, no de casillas sueltas
    this.jugadores = jugadores;
    this.turnoActual = 0;
    this.ranking = [];
    this.dado1 = new Dado();
    this.dado2 = new Dado();
  }

  iniciarJuego() {
    this.turnoActual = 0;
  }

  //  Tirar los dos dados
  tirarDados() {
    const d1 = this.dado1.lanzar();
    const d2 = this.dado2.lanzar();
    return { d1, d2, sum: d1 + d2, isDouble: d1 === d2 };
  }

  //  Solo devuelve quién juega y la tirada, no mueve
  turno() {
    const jugador = this.jugadores[this.turnoActual];
    const dados = this.tirarDados();
    return { jugador, dados };
  }

  //  Mover al jugador actual según pasos
  moverJugadorActual(pasos) {
    const jugador = this.jugadores[this.turnoActual];
    if (!jugador.enCarcel){
      jugador.mover(pasos, this.tablero);
      return jugador; // devuelve al jugador que se movió
    }
  }

  //  Cambiar de turno (si no sacó dobles)
  siguienteTurno(isDouble = false) {
    if (!isDouble) {
      this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
    }
  }

  // 👥 Getters
  getTurnoActual() {
    return this.jugadores[this.turnoActual];
  }

  getJugadores() {
    return this.jugadores;
  }

  getRanking() {
    return this.ranking;
  }

  //  Ganador según dinero + valor propiedades
  calcularGanador() {
    return this.jugadores.reduce(
      (max, j) => {
        const valorPropiedades = j.getPropiedades()
          .reduce((acc, p) => acc + (p.getPrecio ? p.getPrecio() : 0), 0);
        const total = j.getDinero() + valorPropiedades;
        return total > max.total ? { jugador: j, total } : max;
      },
      { jugador: null, total: 0 }
    );
  }

  finalizarJuego() {
    const ganador = this.calcularGanador();
    console.log(
      "🏆 Ganador:",
      ganador.jugador.getNombre(),
      "con",
      ganador.total
    );
    return ganador;
  }
}
