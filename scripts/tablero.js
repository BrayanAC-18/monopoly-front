import Player from "../modals/player.js";
import Game from "../modals/game.js";

document.addEventListener("DOMContentLoaded", async function () {
  let tablero = document.getElementById("tablero");
  let casillas = [];

  try {
    const response = await fetch("http://127.0.0.1:5000/board");
    const data = await response.json();

    cargarTablero(data);

    // Unir todas las casillas en un solo array
    casillas = ["bottom", "top", "left", "right"].reduce((acc, key) => {
      return acc.concat(data[key] || []);
    }, []);
  } catch (error) {
    console.error("Error cargando tablero:", error);
  }

  function cargarTablero(data) {
    tablero.innerHTML = "";
    let indexD = 0;
    for (let i = data.left.length - 1; i >= 0; i--) {
      if (i == data.left.length - 1) {
        tablero.innerHTML += `<div id="casilla-${
          data.left[i].id
        }" class="celda nombre ${data.left[i].color || ""}">${
          data.left[i].name
        }<br>${data.left[i].price || ""}</div>`;
        data.top.forEach((casilla) => {
          tablero.innerHTML += `<div id="casilla-${
            casilla.id
          }" class="celda nombre ${casilla.color || ""}">${casilla.name}<br>${
            casilla.price ? `<span class="precio">$${casilla.price}</span>` : ""
          }</div>`;
        });
      } else if (i == 0) {
        tablero.innerHTML += `<div id="casilla-${
          data.left[i].id
        }" class="celda nombre ${data.left[i].color || ""}">${
          data.left[i].name
        }<br>${data.left[i].price || ""}</div>`;
        data.bottom
          .slice()
          .reverse()
          .forEach((casilla) => {
            tablero.innerHTML += `<div id="casilla-${
              casilla.id
            }" class="celda nombre ${casilla.color || ""}">${casilla.name}<br>${
              casilla.price
                ? `<span class="precio">$${casilla.price}</span>`
                : ""
            }</div>`;
          });
      } else {
        tablero.innerHTML += `<div id="casilla-${
          data.left[i].id
        }" class="celda nombre columna-izquierda ${data.left[i].color || ""}">${
          data.left[i].name
        }<br>${
          data.left[i].price
            ? `<span class="precio">$${data.left[i].price}</span>`
            : ""
        }</div>`;
        tablero.innerHTML += `<div class="centro"></div>`;
        tablero.innerHTML += `<div id="casilla-${
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
    tablero.innerHTML += `<img id="logo" src="/assets/imagenes/logo.png">`;
  }

  // Crear juego
  let game = new Game(casillas);

  // Cargar jugadores desde localStorage
  const playersData = JSON.parse(localStorage.getItem("monopolyPlayers")) || [];
  playersData.forEach((p) => {
    game.addPlayer(p.nickname, p.country, p.score);
  });

  // Renderizar sidebar
  const sidebar = document.getElementById("sidebar");
  function renderSidebar() {
    const desktop = document.getElementById("sidebarDesktop");
    const mobile = document.getElementById("sidebarMobileContent");
    desktop.innerHTML = "";
    mobile.innerHTML = "";

    game.players.forEach((p, i) => {
      const cardHTML = `
      <div class="player-card mb-3 p-2 bg-white text-dark rounded" data-player="${i}">
        <div class="d-flex align-items-center justify-content-between">
          <span class="color-box me-2" style="background:${
            p.color || "gray"
          }; width:15px; height:15px; border-radius:50%; display:inline-block"></span>
          <strong>${p.nick}</strong>
          <img src="https://flagsapi.com/${
            p.country
          }/flat/32.png" class="ms-auto">
        </div>
        <p class="mt-2 mb-1">💰 <span class="score">${p.cash}</span></p>
        <h6 class="small">Propiedades:</h6>
        <ul class="properties list-unstyled"></ul>
      </div>
    `;
      desktop.insertAdjacentHTML("beforeend", cardHTML);
      mobile.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  renderSidebar();

  // Funciones para actualizar sidebar
  function updateScore(playerIndex, newScore) {
    const card = document.querySelector(`[data-player="${playerIndex}"]`);
    if (card) card.querySelector(".score").textContent = newScore;
  }

  function addProperty(playerIndex, propertyName) {
    const card = document.querySelector(`[data-player="${playerIndex}"]`);
    if (card) {
      const ul = card.querySelector(".properties");
      const li = document.createElement("li");
      li.textContent = propertyName;

      const btn = document.createElement("button");
      btn.textContent = "Hipotecar";
      btn.onclick = () => {
        li.classList.add("mortgaged");
        console.log(`Jugador ${playerIndex} hipotecó ${propertyName}`);
      };

      li.appendChild(btn);
      ul.appendChild(li);
    }
  }

  // Dados
  let dados = document.getElementById("dados");
  dados.addEventListener("click", () => {
    if (!dados.classList.contains("desactivado")) {
      game.takeTurn();
      renderSidebar(); // refrescar sidebar después de turno
    }
  });

  dados.addEventListener("dblclick", () => {
    if (!dados.classList.contains("desactivado")){
      let valor = prompt("Ingresa el valor de los dados (2-12):");
    }
  });
});
