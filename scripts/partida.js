import Jugador from "../modals/jugador.js";
import Juego from "../modals/juego.js";
import Tablero from "../modals/tablero.js";
import Sidebar from "../modals/sidebar.js";
import Propiedad from "../modals/propiedad.js";
import Especial from "../modals/especial.js";

document.addEventListener("DOMContentLoaded", async function () {
  let tableroHtml = document.getElementById("tablero");
  let casillas = [];

  let data
  try {
    const response = await fetch("http://127.0.0.1:5000/board");
    data = await response.json();
    // Unir todas las casillas en un solo array
    const casillasLados = ["bottom", "top", "left", "right"].reduce((acc, key) => {
      const lado = data[key] || [];

      casillas = lado.map(c => {
        switch (c.tipo){
          case "propiedad":
            return new Propiedad(c.id,)

        }

      })
    }, []);
  } catch (error) {
    console.error("Error cargando tablero:", error);
  }

  //crear instancia de tablero y renderizarlo
  const tablero = new Tablero(casillas,tableroHtml)
  tablero.renderizar(data)


  //crear una lista de jugadores
  const playersData = JSON.parse(localStorage.getItem("monopolyPlayers")) || [];
  const jugadores = playersData.map(p => new Jugador(p.id,p.nickname, p.country, p.ficha));
  localStorage.clear()
  
  // Renderizar sidebar
  const desktop = document.getElementById("sidebarDesktop");
  const mobile = document.getElementById("sidebarMobileContent");
  const sidebar = new Sidebar(desktop,mobile,jugadores)
  sidebar.renderizar()

  // Crear juego
  let juego = new Juego(jugadores,casillas);

  // Dados
  let dados = document.getElementById("dados");
  dados.addEventListener("click", () => {
      dados = juego.tirarDados()
      
  });

  dados.addEventListener("dblclick", () => {
    let valor = prompt("Ingresa el valor de los dados (2-12):");

  });
  
  
});
