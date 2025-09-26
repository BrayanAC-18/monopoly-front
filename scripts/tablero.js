import Player from "../modals/player.js";
import Game from "../modals/game.js";
document.addEventListener("DOMContentLoaded", async function () {
  
    let tablero = document.getElementById("tablero");
    let casillas = [];

    try {
        const response = await fetch("http://127.0.0.1:5000/board");
        const data = await response.json();

        // Cargar el tablero
        cargarTablero(data);

        // Unir todas las casillas en un solo array
        casillas = ["bottom", "top", "left", "right"].reduce((acc, key) => {
            return acc.concat(data[key] || []);
        }, []);

        console.log(casillas); // ✅ siempre tendrá los datos
    } catch (error) {
        console.error("Error cargando tablero:", error);
    }

  function cargarTablero(data){
    tablero.innerHTML = "";
    let indexD = 0;
    for (let i = data.left.length-1 ; i >= 0; i--) {
      if (i == data.left.length-1){
        tablero.innerHTML += `<div id="casilla-${data.left[i].id}" class="celda nombre ${data.left[i].color || ""}">${data.left[i].name}<br>${data.left[i].price || ""}</div>`;
        data.top.forEach(casilla => {
          tablero.innerHTML += `<div id="casilla-${casilla.id}" class="celda nombre ${casilla.color || ""}">${casilla.name}<br>${casilla.price ? `<span class="precio">$${casilla.price}</span>` : ""}</div>`;
        });
      }
      else if (i==0){
          tablero.innerHTML += `<div id="casilla-${data.left[i].id}" class="celda nombre ${data.left[i].color || "" }">${data.left[i].name}<br>${data.left[i].price || ""}</div>`;
            data.bottom.slice().reverse().forEach(casilla => {
               tablero.innerHTML += `<div id="casilla-${casilla.id}" class="celda nombre ${casilla.color || ""}">${casilla.name}<br>${casilla.price ? `<span class="precio">$${casilla.price}</span>`: ""}</div>`;
            });
      }
      else{
        tablero.innerHTML += `<div id="casilla-${data.left[i].id}" class="celda nombre columna-izquierda ${data.left[i].color || ""}">${data.left[i].name}<br>${data.left[i].price ? `<span class="precio">$${data.left[i].price}</span>` : ""}</div>`;
        tablero.innerHTML += `<div class="centro"></div>`;
        tablero.innerHTML += `<div id="casilla-${data.right[indexD].id}"class="celda nombre columna-derecha ${data.right[indexD].color || ""}">${data.right[indexD].name}<br>${data.right[indexD].price ? `<span class="precio">$${data.right[indexD].price}</span>` : ""}</div>`;
        indexD++;
      }
    };
    tablero.innerHTML += `<img id="logo" src="/assets/imagenes/logo.png">`;
    let casillas = []
    
  }

  let game = new Game(casillas)
  let dados = document.getElementById("dados")
  dados.addEventListener("click", () => {
    if (!dados.classList.contains("desactivado")){
      game.takeTurn()
    }
  })
  dados.addEventListener("dblclick", () => {
    if (!dados.classList.contains("desactivado")){
      let valor = prompt("Ingresa el valor de los dados (2-12):");
    }
  })
  
  
})
