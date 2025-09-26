import Dado from "./dado.js";

export default class Juego {
  constructor(jugadores = [], tablero = null) {
    this.tablero = tablero;
    this.jugadores = jugadores;
    this.turnoActual = 0;
    this.ranking = [];
    this.dado1 = new Dado();
    this.dado2 = new Dado();
  }

  iniciarJuego() {
    this.turnoActual = 0;
  }

  tirarDados() {
    const d1 = this.dado1.lanzar();
    const d2 = this.dado2.lanzar();
    return { d1, d2, sum: d1 + d2, isDouble: d1 === d2 };
  }

  turno() {
    const jugador = this.jugadores[this.turnoActual];
    const dados = this.tirarDados();

    jugador.mover(dados.sum, this.tablero);

    if (!dados.isDouble) {
      this.siguienteTurno();
    }
    return { jugador, dados };
  }

  siguienteTurno() {
    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
  }

  getTurnoActual() {
    return this.jugadores[this.turnoActual];
  }

  getJugadores() {
    return this.jugadores;
  }

  getRanking() {
    return this.ranking;
  }

  calcularGanador() {
    return this.jugadores.reduce((max, j) => {
      const valorPropiedades = j.propiedades.reduce((acc, p) => acc + p.getPrecio(), 0);
      const total = j.getDinero() + valorPropiedades;
      return total > max.total ? { jugador: j, total } : max;
    }, { jugador: null, total: 0 });
  }

  finalizarJuego() {
    const ganador = this.calcularGanador();
    console.log("Ganador:", ganador.jugador.getNombre(), "con", ganador.total);
    return ganador;
  }
}
