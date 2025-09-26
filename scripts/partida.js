import Jugador from "../modals/jugador.js";
import Juego from "../modals/juego.js";
import Tablero from "../modals/tablero.js";
import Sidebar from "../modals/sidebar.js";
import Propiedad from "../modals/propiedad.js";
import Especial from "../modals/especial.js";
import Ferrocarril from "../modals/ferrocarril.js";
import Casilla from "../modals/casilla.js";
import Dado from "../modals/dado.js";

document.addEventListener("DOMContentLoaded", async function () {
  let tableroHtml = document.getElementById("tablero");
  let casillas = [];
  let data;
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

  //crear una lista de jugadores
  const playersData = JSON.parse(localStorage.getItem("monopolyPlayers")) || [];
  const jugadores = playersData.map(
    (p) => new Jugador(p.id, p.nickname, p.country, p.ficha)
  );
  localStorage.clear();

  // Renderizar sidebar
  const desktop = document.getElementById("sidebarDesktop");
  const mobile = document.getElementById("sidebarMobileContent");
  const sidebar = new Sidebar(desktop,mobile,jugadores)
  sidebar.renderizar()

  await Especial.cargarCartas();

  // Crear juego
  let juego = new Juego(jugadores, casillas);

  function renderJugadores(jugadores) {
    // 1️⃣ Limpia fichas anteriores
    document.querySelectorAll(".jugadores").forEach((div) => div.remove());

    // 2️⃣ Coloca cada jugador en su casilla actual
    jugadores.forEach((jugador) => {
      const casillaDiv = document.getElementById(
        `casilla-${jugador.getPosicion()}`
      );
      if (!casillaDiv) return;

      // Contenedor de jugadores dentro de la casilla
      let contenedor = casillaDiv.querySelector(".jugadores");
      if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.classList.add("jugadores");
        casillaDiv.appendChild(contenedor);
      }

      // Agregar la ficha (emoji)
      const span = document.createElement("span");
      span.textContent = jugador.getFicha(); // emoji del jugador
      span.title = jugador.getNombre();
      contenedor.appendChild(span);
    });
  }

  dados.addEventListener("click", () => {
    const { jugador, dados } = juego.turno();

    showPopup(
      `${jugador.getNombre()} sacó ${dados.sum} (${dados.d1} + ${
        dados.d2
      }). ¿Mover ficha?`,
      () => {
        // ✅ mover al jugador actual
        juego.moverJugadorActual(dados.sum);

        // ✅ renderizar fichas en tablero
        renderJugadores(juego.getJugadores());

        // ✅ pasar turno si no es doble
        juego.siguienteTurno(dados.isDouble);
      },
      () => {
        console.log("El jugador decidió no moverse aún.");
      }
    );
      const resultadoDados = juego.tirarDados()
      console.log(resultadoDados)
      
  });

  dados.addEventListener("dblclick", () => {
    let valor = prompt("Ingresa el valor de los dados (2-12):");
  });
});
