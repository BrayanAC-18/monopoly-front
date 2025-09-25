// Player.js
export default class Player {
  constructor(nick_name, country, score = 1500) {
    this.nick = nick_name;       // nombre del jugador
    this.country = country;      // código de país
    this.cash = score;           // dinero inicial
    this.position = 0;           // empieza en salida
    this.properties = [];
    this.inJail = false;
    this.jailTurns = 0;

    // ID único generado con nick + timestamp
    this.id = `${nick_name}_${Date.now()}`;
  }

  move(steps, board) {
    const oldPos = this.position;
    this.position = (this.position + steps) % board.length;

    if (oldPos + steps >= board.length) {
      this.cash += 200;
      console.log(`${this.nick} pasó por salida (+$200)`);
    }
  }

  pay(amount, receiver = null) {
    this.cash -= amount;
    if (receiver) receiver.cash += amount;
    console.log(`${this.nick} pagó $${amount} ${receiver ? "a " + receiver.nick : ""}`);
  }

  buyProperty(casilla) {
    if (!casilla.owner && this.cash >= casilla.price) {
      this.cash -= casilla.price;
      this.properties.push(casilla.id);
      casilla.owner = this.id;sapce
      console.log(`${this.nick} compró ${casilla.name} por $${casilla.price}`);
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      nick_name: this.nick,
      country: this.country,
      score: this.cash,
      position: this.position,
      properties: this.properties,
      inJail: this.inJail,
      jailTurns: this.jailTurns
    };
  }
}
