// Game.js
import Player from "./player.js";
import { showPopup } from "./popup.js";

export default class Game {
  constructor(board, uiCallbacks) {
    this.board = board;
    this.players = [];
    this.turnIndex = 0;
    this.log = [];
    this.ui = uiCallbacks; // { renderSidebar, updateScore, addProperty }
  }

  addPlayer(nick_name, country, score = 1500, color = "gray") {
    const player = new Player(nick_name, country, score);
    player.color = color; // guardar color también
    this.players.push(player);
    if (this.ui?.renderSidebar) this.ui.renderSidebar(this.players);
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
    const playerIndex = this.turnIndex;
    const player = this.currentPlayer();
    const dice = this.rollDice();

    player.move(dice.sum, this.board);
    const space = this.board[player.position];
    this.resolverCasilla(player, space, playerIndex);

    if (!dice.isDouble) {
      this.turnIndex = (this.turnIndex + 1) % this.players.length;
    }

    return { dice, space, player };
  }

  resolverCasilla(player, space, playerIndex) {
    if (space.type === "property" || space.type === "railroad") {
      if (!space.owner) {
        showPopup(
          `${player.nick}, ¿quieres comprar ${space.name} por $${space.price}?`,
          () => {
            if (player.buyProperty(space)) {
              this.ui?.addProperty(playerIndex, space.name);
              this.ui?.updateScore(playerIndex, player.cash);
            }
          },
          () => console.log(`${player.nick} no compró ${space.name}`)
        );
      } else if (space.owner !== player.id) {
        const ownerIndex = this.players.findIndex(p => p.id === space.owner);
        const owner = this.players[ownerIndex];
        const rent = space.rent.base || space.rent["1"];
        player.pay(rent, owner);
        this.ui?.updateScore(playerIndex, player.cash);
        this.ui?.updateScore(ownerIndex, owner.cash);
      }
    } else if (space.type === "tax") {
      player.pay(-space.action.money);
      this.ui?.updateScore(playerIndex, player.cash);
    } else if (space.type === "special" && space.action?.goTo === "jail") {
      player.position = 10;
      player.inJail = true;
      this.log.push(`${player.nick} fue enviado a la cárcel`);
    }
  }
}
