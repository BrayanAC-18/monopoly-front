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
  iniciarJuego() {}

  siguienteTurno(dados) {
    if (!dados.isDouble) {
      this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
    }
  }

  tirarDados() {
    const d1 = this.dado1.lanzar();
    const d2 = this.dado2.lanzar();
    const dados = { d1, d2, sum: d1 + d2, isDouble: d1 === d2 };
    return dados;
  }

  getTurnoActual() {
    return this.turnoActual;
  }
  getJugadores() {
    return this.jugadores;
  }
  getRanking() {
    return this.ranking;
  }
  calcularGanador() {
    //sumar dinero + valor de propiedades (casas/hotel) - hipotecas
  }
  finalizarJuego() {
    const ganador = this.calcularGanador();
    //enviar POST a backend para raking
  }
}
