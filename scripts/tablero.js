document.addEventListener("DOMContentLoaded", function () {
  let accion = localStorage.getItem("jugarBtn");
  if (accion == "crearTablero") {
    let tablero = document.getElementById("tablero");
    fetch("http://127.0.0.1:5000/board")
      .then((response) => response.json())
      .then((data) => {
        cargarTablero(data)
      });
  }

  function cargarTablero(data){
    tablero.innerHTML = "";
    indexD = 0
    for (let i = data.left.length-1 ; i >= 0; i--) {
      if (i == data.left.length-1){
        tablero.innerHTML += `<div class="celda nombre ${data.left[i].color || ""}">${data.left[i].name}<br>${data.left[i].price || ""}</div>`;
        data.top.forEach(casilla => {
          tablero.innerHTML += `<div class="celda nombre ${casilla.color || ""}">${casilla.name}<br>${casilla.price ? `<span class="precio">$${casilla.price}</span>` : ""}</div>`;
        });
      }
      else if (i==0){
          tablero.innerHTML += `<div class="celda nombre ${data.left[i].color || "" }">${data.left[i].name}<br>${data.left[i].price || ""}</div>`;
            data.top.slice().reverse().forEach(casilla => {
               tablero.innerHTML += `<div class="celda nombre ${casilla.color || ""}">${casilla.name}<br>${casilla.price ? `<span class="precio">$${casilla.price}</span>`: ""}</div>`;
            });
      }
      else{
        tablero.innerHTML += `<div class="celda nombre columna-izquierda ${data.left[i].color || ""}">${data.left[i].name}<br>${data.left[i].price ? `<span class="precio">$${data.left[i].price}</span>` : ""}</div>`;
        tablero.innerHTML += `<div class="centro"></div>`;
        tablero.innerHTML += `<div class="celda nombre columna-derecha ${data.right[indexD].color || ""}">${data.right[indexD].name}<br>${data.right[indexD].price ? `<span class="precio">$${data.right[indexD].price}</span>` : ""}</div>`;
        indexD++;
      }
    };
    tablero.innerHTML += `<img id="logo" src="/assets/imagenes/logo.png">`;
  }
})
