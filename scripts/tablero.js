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
        tablero.innerHTML += `<div class="celda ${data.left[i].color || ""}">${data.left[i].name}<br>${data.left[i].price || ""}</div>`;
        data.top.forEach(casilla => {
          tablero.innerHTML += `<div class="celda ${casilla.color || ""}">${casilla.name}<br>${casilla.price || ""}</div>`;
        });
      }
      else if (i==0){
          tablero.innerHTML += `<div class="celda ${data.left[i].color || "" }">${data.left[i].name}<br>${data.left[i].price || ""}</div>`;
            for (let j = data.bottom.length-1 ; j >= 0; j--) {
              tablero.innerHTML += `<div class="celda ${data.bottom[j].color || ""}">${data.bottom[j].name}<br>${data.bottom[j].price || ""}</div>`;
            }
      }
      else{
        tablero.innerHTML += `<div class="celda columna-izquierda ${data.left[i].color || ""}">${data.left[i].name}<br>${data.left[i].price || ""}</div>`;
        tablero.innerHTML += `<div class="centro"></div>`;
        tablero.innerHTML += `<div class="celda columna-derecha ${data.right[indexD].color || ""}">${data.right[indexD].name}<br>${data.right[indexD].price || ""}</div>`;
        indexD++;
      }
    };
    tablero.innerHTML += `<img id="logo" src="/assets/imagenes/logo.png">`;
  }
})
