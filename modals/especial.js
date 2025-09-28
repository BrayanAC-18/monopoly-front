import Casilla from "../modals/casilla.js";

export default class Especial extends Casilla {
  constructor(posicion, nombre, tipo, accion) {
    super(posicion, nombre);
    this.tipo = tipo;
    this.accion = accion;
  }

  // contenedores de cartas (estáticos)
  static chance = [];
  static community = [];

  // toast manager (se setea desde partida.js)
  static toastManager = null;

  static setToastManager(manager) {
    Especial.toastManager = manager;
  }

  static async cargarCartas() {
    const response = await fetch("http://127.0.0.1:5000/board");
    const data = await response.json();
    Especial.chance = data.chance || [];
    Especial.community = data.community_chest || [];
  }

  async ejecutar(jugador) {
    // helper local para mostrar toast si hay manager
    const showToast = (title, message, type = "primary", delay = 4000) => {
      if (Especial.toastManager) {
        Especial.toastManager.show({ title, message, type, delay });
      } else {
        // fallback: console.log (no rompe nada)
        console.log(`[TOAST] ${title} - ${message}`);
      }
    };

    switch (this.tipo) {
      case "special":
        if (this.accion?.goTo) {
          jugador.setEnCarcel(true);
          jugador.setPosicion(10);
          showToast(
            "Casilla Especial",
            `${jugador.getNombre()} fue enviado a la cárcel.`,
            "danger"
          );
        }
        break;

      case "tax": {
        const pudoPagar = jugador.pagar(-this.accion.money);
        if (!pudoPagar) {
          jugador.setEnCarcel(true);
          jugador.setPosicion(10);
          alert(
            `${jugador.getNombre()} no tiene dinero y fue enviado a la cárcel.`
          );
        } else {
          showToast(
            "Impuesto",
            `${jugador.getNombre()} pagó $${-this.accion.money} por ${
              this.nombre
            }`,
            "warning"
          );
        }

        break;
      }
      case "chance": {
        const carta = this.tomarCarta(Especial.chance);
        showToast(
          "Sorpresa",
          `${jugador.getNombre()} tomó carta: ${carta.description}`,
          "info"
        );
        if (carta.action.money < 0) {
          const pudoPagar = jugador.pagar(-carta.action.money);
          if (!pudoPagar) {
            jugador.setEnCarcel(true);
            jugador.setPosicion(10);
            alert(
              `${jugador.getNombre()} no tiene dinero y fue enviado a la cárcel.`
            );
          }
        } else {
          jugador.cobrar(carta.action.money);
        }
        break;
      }
      case "community_chest": {
        const carta = this.tomarCarta(Especial.community);
        showToast(
          "Caja de Comunidad",
          `${jugador.getNombre()} tomó carta: ${carta.description}`,
          "primary"
        );
        if (carta.action.money < 0) {
          const pudoPagar = jugador.pagar(-carta.action.money);
          if (!pudoPagar) {
            jugador.setEnCarcel(true);
            jugador.setPosicion(10);
            alert(
              `${jugador.getNombre()} no tiene dinero y fue enviado a la cárcel.`
            );
          }
        } else {
          jugador.cobrar(carta.action.money);
        }
        break;
      }
    }
  }

  tomarCarta(cartas) {
    const index = Math.floor(Math.random() * cartas.length);
    return cartas[index];
  }

  getTipo() {
    return this.tipo;
  }
}
