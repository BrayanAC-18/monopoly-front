// Game.js
import Player from "./player.js";
import { showPopup } from "./popup.js";

export default class Game { 
  constructor(tablero) {
    this.tablero = tablero;
    this.players = [];
    this.turnIndex = 0;
    this.log = [];
  }

  addPlayer(nick_name, country, score = 1500) {
    const player = new Player(nick_name, country, score);
    this.players.push(player);
    return player;
  }

  currentPlayer() {
    return this.players[this.turnIndex];
  }

  rollDice() {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    return { d1, d2, sum: d1 + d2, isDouble: d1 === d2 };
  }

  takeTurn() {
    const player = this.currentPlayer();
    const dice = this.rollDice();

    player.move(dice.sum, this.tablero);
    const casilla = this.tablero[player.position];
    this.accionCasilla(player, casilla);

    if (!dice.isDouble) {
      this.turnIndex = (this.turnIndex + 1) % this.players.length;
    }

    return { dice, casilla, player };
  }

  accionCasilla(player, casilla) {
    if (casilla.type === "property" || casilla.type === "railroad") {
      if (!casilla.owner) {
        showPopup(
          `${player.nick}, ¿quieres comprar ${casilla.name} por $${casilla.price}?`,
          () => player.buyProperty(casilla),
          () => console.log(`${player.nick} no compró ${casilla.name}`)
        );
      } else if (casilla.owner !== player.id) {
        const owner = this.players.find(p => p.id === casilla.owner);
        const rent = casilla.rent.base || casilla.rent["1"];
        player.pay(rent, owner);
        this.log.push(`${player.nick} pagó $${rent} a ${owner.nick}`);
      }
    } else if (casilla.type === "tax") {
      player.pay(-casilla.action.money);
      this.log.push(`${player.nick} pagó impuesto $${-casilla.action.money}`);
    } else if (casilla.type === "special" && casilla.action?.goTo === "jail") {
      player.position = 10;
      player.inJail = true;
      this.log.push(`${player.nick} fue enviado a la cárcel`);
    }
  }
}
