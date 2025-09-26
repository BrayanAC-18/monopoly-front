export default class Tablero {
  constructor(casillas = [], tablero) {
    this.casillas = casillas;
    this.tablero = tablero;
  }

  renderizar(data) {
    this.tablero.innerHTML = "";
    let indexD = 0;
    for (let i = data.left.length - 1; i >= 0; i--) {
      if (i == data.left.length - 1) {
        this.tablero.innerHTML += `<div id="casilla-${
          data.left[i].id
        }" class="celda nombre ${data.left[i].color || ""}">${
          data.left[i].name
        }<br>${data.left[i].price || ""}</div>`;
        data.top.forEach((casilla) => {
          this.tablero.innerHTML += `<div id="casilla-${
            casilla.id
          }" class="celda nombre ${casilla.color || ""}">${casilla.name}<br>${
            casilla.price ? `<span class="precio">$${casilla.price}</span>` : ""
          }</div>`;
        });
      } else if (i == 0) {
        this.tablero.innerHTML += `<div id="casilla-${
          data.left[i].id
        }" class="celda nombre ${data.left[i].color || ""}">${
          data.left[i].name
        }<br>${data.left[i].price || ""}</div>`;
        data.bottom
          .slice()
          .reverse()
          .forEach((casilla) => {
            this.tablero.innerHTML += `<div id="casilla-${
              casilla.id
            }" class="celda nombre ${casilla.color || ""}">${casilla.name}<br>${
              casilla.price
                ? `<span class="precio">$${casilla.price}</span>`
                : ""
            }</div>`;
          });
      } else {
        this.tablero.innerHTML += `<div id="casilla-${
          data.left[i].id
        }" class="celda nombre columna-izquierda ${data.left[i].color || ""}">${
          data.left[i].name
        }<br>${
          data.left[i].price
            ? `<span class="precio">$${data.left[i].price}</span>`
            : ""
        }</div>`;
        this.tablero.innerHTML += `<div class="centro"></div>`;
        this.tablero.innerHTML += `<div id="casilla-${
          data.right[indexD].id
        }"class="celda nombre columna-derecha ${
          data.right[indexD].color || ""
        }">${data.right[indexD].name}<br>${
          data.right[indexD].price
            ? `<span class="precio">$${data.right[indexD].price}</span>`
            : ""
        }</div>`;
        indexD++;
      }
    }
    this.tablero.innerHTML += `<img id="logo" src="/assets/imagenes/logo.png">`;
  }

  

  obtenerCasilla(idCasilla) {
    //devolver casilla mediante su id
    return this.casillas[posicion];
  }

  getCasillas() {
    return this.casillas;
  }
}
