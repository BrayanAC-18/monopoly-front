import Dado from "./dado.js";
import Propiedad from "./propiedad.js";

export default class Juego {
  constructor(jugadores = [], tablero = null) {
    this.tablero = tablero; // 👈 instancia de Tablero, no de casillas sueltas
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
    if (!jugador.enCarcel) {
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
        const valorPropiedades = j
          .getPropiedades()
          .reduce((acc, p) => acc + (p.getPrecio ? p.getPrecio() : 0), 0);
        const total = j.getDinero() + valorPropiedades;
        return total > max.total ? { jugador: j, total } : max;
      },
      { jugador: null, total: 0 }
    );
  }

  async finalizarJuego() {
    // Calcular puntaje de todos los jugadores
    const resultadosArray = this.jugadores.map((j) => {
      const valorPropiedades = j.getPropiedades().reduce((acc, p) => {
        if (p.getHipotecada()) return acc; // Ignora propiedades hipotecadas

        let valor = p.getPrecio();

        // Si la propiedad tiene casas y hoteles, sumar su valor adicional
        if (p instanceof Propiedad) {
          valor += p.getCasas() * 100;
          valor += p.getHotel() * 250;
        }
        return acc + valor;
      }, 0);

      const total = j.getDinero() + valorPropiedades;

      return {
        nickname: j.getNombre(),
        score: total,
        country_code: j.getPais().toLowerCase(),
      };
    });

    // Calcular ganador
    const ganador = resultadosArray.reduce(
      (max, j) => (j.score > max.score ? j : max),
      resultadosArray[0]
    );

    console.log("Ganador:", ganador.nickname, "con", ganador.score);

    // Enviar cada jugador por separado
    for (const jugador of resultadosArray) {
      try {
        const response = await fetch("http://127.0.0.1:5000/score-recorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nick_name: jugador.nickname,
            score: jugador.score,
            country_code: jugador.country_code,
          }),
        });

        if (!response.ok) throw new Error("Error enviando ranking");

        console.log(`Ranking de ${jugador.nickname} guardado ✅`);
      } catch (err) {
        console.error("Error en finalizarJuego:", err);
      }
    }

    // Guardar local
    localStorage.setItem("rankingActual", JSON.stringify(resultadosArray));

    return { ganador, resultados: resultadosArray };
  }
}
