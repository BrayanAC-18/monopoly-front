import Jugador from "../modals/jugador.js";
import Juego from "../modals/juego.js";
import Tablero from "../modals/tablero.js";
import Sidebar from "../modals/sidebar.js";
import Propiedad from "../modals/propiedad.js";
import Especial from "../modals/especial.js";
import Ferrocarril from "../modals/ferrocarril.js";
import ModalPopup from "../modals/popup.js";

document.addEventListener("DOMContentLoaded", async function () {
  let tableroHtml = document.getElementById("tablero");
  let casillas = [];
  let data;

  //  Cargar datos del backend
  try {
    const response = await fetch("http://127.0.0.1:5000/board");
    data = await response.json();

  casillas = ["bottom","top","left","right"].flatMap(key => {
  const lado = data[key] || [];
  return lado.map(c => {
    switch(c.type) {
      case "property": return new Propiedad(c.id, c.name, c.price, c.rent, c.color, c.mortgage);
      case "railroad": return new Ferrocarril(c.id,c.name, c.price,c.mortgage,c.rent);
      case "special":
      case "tax":
      case "chance":
      case "community_chest": return new Especial(c.id, c.name, c.type, c.action);
      default:
        console.warn("Tipo desconocido:", c.tipo);
        return null; // o undefined
    }
  }).filter(c => c !== null); // eliminar casillas inválidas
});
} catch (error) {
  console.error("Error cargando tablero:", error);
}
  console.log(casillas)
  //crear instancia de tablero y renderizarlo
  const tablero = new Tablero(casillas, tableroHtml);
  tablero.renderizar(data);

  //  Crear lista de jugadores desde localStorage
  const playersData = JSON.parse(localStorage.getItem("monopolyPlayers")) || [];
  const jugadores = playersData.map(
    (p) => new Jugador(p.id, p.nickname, p.country, p.ficha)
  );
  localStorage.clear();

  //  Renderizar sidebar
  const desktop = document.getElementById("sidebarDesktop");
  const mobile = document.getElementById("sidebarMobileContent");
  const sidebar = new Sidebar(desktop,mobile,jugadores)
  sidebar.renderizar()

  await Especial.cargarCartas();

  //  Crear juego con el tablero, no con las casillas
  let juego = new Juego(jugadores, tablero);

  //  Función para renderizar jugadores en el tablero
  function renderJugadores(jugadores) {
    // Limpiar fichas previas
    document.querySelectorAll(".jugadores").forEach((div) => div.remove());

    jugadores.forEach((jugador) => {
      const casillaDiv = document.getElementById(
        `casilla-${jugador.getPosicion()}`
      );
      if (!casillaDiv) {
        console.warn(
          `No existe casilla con id casilla-${jugador.getPosicion()}`
        );
        return;
      }

      // Crear contenedor de fichas si no existe
      let contenedor = casillaDiv.querySelector(".jugadores");
      if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.classList.add("jugadores");
        contenedor.style.display = "flex";
        contenedor.style.gap = "4px";
        casillaDiv.appendChild(contenedor);
      }

      // Añadir ficha (emoji/ícono)
      const span = document.createElement("span");
      span.textContent = jugador.getFicha();
      span.title = jugador.getNombre();
      contenedor.appendChild(span);
    });
  }

  //  Dibujar fichas al inicio
  renderJugadores(juego.getJugadores());

  //  Instancia modal
  const modal = new ModalPopup();

  //  Evento dados con popup
  let dadosBtn = document.getElementById("dados");
  dadosBtn.addEventListener("click", () => {
    const { jugador, dados } = juego.turno();

    modal.show(
      `${jugador.getNombre()} sacó ${dados.d1} + ${dados.d2} = ${dados.sum}`,
      jugador,
      () => {
        juego.moverJugadorActual(dados.sum);
        renderJugadores(juego.getJugadores());
        juego.siguienteTurno(dados.isDouble);
      }
    );
      const resultadoDados = juego.tirarDados()
      console.log(resultadoDados)
      
  });

  //  Tirada manual con doble click
  dados.addEventListener("dblclick", () => {
    let valor = parseInt(prompt("Ingresa el valor de los dados (2-12):"));
    if (isNaN(valor)) return;

    const jugador = juego.getTurnoActual();
    jugador.mover(valor, tablero);
    renderJugadores(juego.getJugadores());
    juego.siguienteTurno();
  });
});
