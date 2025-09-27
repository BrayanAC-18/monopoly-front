import Especial from "../modals/especial.js";
import Ferrocarril from "../modals/ferrocarril.js";
import Juego from "../modals/juego.js";
import Jugador from "../modals/jugador.js";
import ModalPopup from "../modals/popup.js";
import Propiedad from "../modals/propiedad.js";
import Sidebar from "../modals/sidebar.js";
import Tablero from "../modals/tablero.js";

document.addEventListener("DOMContentLoaded", async function () {
  let tableroHtml = document.getElementById("tablero");
  let casillas = [];
  let data;

  //  Cargar datos del backend
  try {
    const response = await fetch("http://127.0.0.1:5000/board");
    data = await response.json();

    casillas = ["bottom", "top", "left", "right"].flatMap((key) => {
      const lado = data[key] || [];
      return lado
        .map((c) => {
          switch (c.type) {
            case "property":
              return new Propiedad(
                c.id,
                c.name,
                c.price,
                c.rent,
                c.color,
                c.mortgage
              );
            case "railroad":
              return new Ferrocarril(c.id, c.name, c.price, c.mortgage, c.rent);
            case "special":
            case "tax":
            case "chance":
            case "community_chest":
              return new Especial(c.id, c.name, c.type, c.action);
            default:
              console.warn("Tipo desconocido:", c.tipo);
              return null; // o undefined
          }
        })
        .filter((c) => c !== null); // eliminar casillas inválidas
    });
  } catch (error) {
    console.error("Error cargando tablero:", error);
  }
  console.log(casillas);
  //crear instancia de tablero y renderizarlo
  const tablero = new Tablero(casillas, tableroHtml);
  tablero.renderizar(data);

  //  Crear lista de jugadores desde localStorage
  const playersData = JSON.parse(localStorage.getItem("monopolyPlayers")) || [];
  const jugadores = playersData.map(
    (p) => new Jugador(p.id, p.nickname, p.country, p.ficha, p.color)
  );

  //  Renderizar sidebar
  const desktop = document.getElementById("sidebarDesktop");
  const mobile = document.getElementById("sidebarMobileContent");
  const sidebar = new Sidebar(desktop, mobile, jugadores);
  sidebar.renderizar();

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

        // Insertar después del contenedor de emojis
        const emojisContainer = casillaDiv.querySelector(".emojis-container");
        emojisContainer.insertAdjacentElement("afterend", contenedor);
      }

      // Añadir ficha (emoji/ícono personalizado del jugador)
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
  // Click normal → turno con dados aleatorios

  dadosBtn.addEventListener("click", () => {
    const { jugador, dados } = juego.turno();
    console.log(jugador);
    if (!jugador.getEnCarcel()) {
      ejecutarTurno(jugador, dados);
    } else {
      jugadorEnCarcel(jugador);
    }
  });

  // Doble click → turno con dados ingresados manualmente
  dadosBtn.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // evitar el menú contextual del navegador
    const jugador = juego.getTurnoActual();
    if (!jugador.getEnCarcel()) {
      let d1 = parseInt(prompt("Ingresa el valor del primer dado:"), 10);
      let d2 = parseInt(prompt("Ingresa el valor del segundo dado:"), 10);

      if (isNaN(d1) || isNaN(d2)) {
        alert("Ingrese valores inválidos.");
        return;
      }

      const dados = { d1, d2, sum: d1 + d2, isDouble: d1 === d2 };

      ejecutarTurno(jugador, dados);
    } else {
      jugadorEnCarcel(jugador);
    }
  });

  function jugadorEnCarcel(jugador) {
    modal.show(
      `<b>Estas en carcel.</b> <br>
      Para seguir jugando debes de pagar <b>$50</b>`,
      jugador,
      () => {
        if (jugador.pagar(50)) {
          jugador.setEnCarcel(false);
          sidebar.actualizarScore(jugador.getId(), jugador.getDinero());
        } else {
          alert(
            "Parece que no tienes suficiente dinero para salir de carcel 🙈"
          );
          juego.siguienteTurno();
          actualizarEmojiTurno(juego.getTurnoActual());
        }
      },
      () => {
        juego.siguienteTurno();
        actualizarEmojiTurno(juego.getTurnoActual());
      },
      true,
      null,
      {}
    );
  }

  function ejecutarTurno(jugador, dados) {
    // Mostrar emoji del jugador actual en la navbar
    actualizarEmojiTurno(juego.getTurnoActual());
    juego.moverJugadorActual(dados.sum);
    renderJugadores(juego.getJugadores());
    sidebar.actualizarScore(jugador.getId(), jugador.dinero);

    let posicion = jugador.getPosicion();
    let casillaActual = tablero.obtenerCasilla(posicion);

    modal.show(
      `<b>${jugador.getNombre()}</b> sacó ${dados.d1} + ${dados.d2} = ${
        dados.sum
      } <br>
        Cae en la casilla #${posicion} - ${casillaActual.nombre}`,
      jugador,
      null,
      null,
      false,
      () => {
        if (
          casillaActual instanceof Propiedad ||
          casillaActual instanceof Ferrocarril
        ) {
          manejarCompraOCobro(casillaActual, jugador, dados);
        } else {
          juego.siguienteTurno(dados.isDouble);
          actualizarEmojiTurno(juego.getTurnoActual());
        }
      }
    );
  }

  function manejarCompraOCobro(casilla, jugador, dados) {
    const dueño = casilla.getDueño();
    if (dueño && !casilla.getHipotecada()) {
      // Calcular renta según el tipo de casilla
      let renta =
        casilla instanceof Ferrocarril
          ? casilla.calcularRenta(dueño) // aquí sí pasamos el jugador
          : casilla.calcularRenta();

      modal.show(
        `Esta ${
          casilla instanceof Ferrocarril ? "ferrocarril" : "propiedad"
        } pertenece a <b>${dueño.getNombre()}</b>. <br>
        Debe pagar <b>$${renta}</b>`,
        jugador,
        () => {
          console.log(renta);
          jugador.pagar(renta);
          dueño.cobrar(renta);
          sidebar.actualizarScore(jugador.getId(), jugador.getDinero());
          sidebar.actualizarScore(dueño.getId(), dueño.getDinero());
          juego.siguienteTurno(dados.isDouble);
          actualizarEmojiTurno(juego.getTurnoActual());
        },
        null,
        false
      );
    } else if (!dueño) {
      modal.show(
        `<b>${casilla.getNombre()}</b> ${
          casilla.getColor ? "- " + casilla.getColor() : ""
        } <br>
        <b>Valor: $${casilla.getPrecio()}</b> <br>
        Aún no tiene dueño. ¿Desea adquirirla?`,
        jugador,
        () => {
          const comprado =
            casilla instanceof Ferrocarril
              ? jugador.comprarFerro(casilla)
              : jugador.comprarPropiedad(casilla);

          if (comprado) {
            sidebar.añadirPropiedad(jugador.getId(), casilla, tablero);
            sidebar.actualizarScore(jugador.getId(), jugador.getDinero());

            casilla.marcarComoDelJugador(jugador);
          }
          juego.siguienteTurno(dados.isDouble);
          actualizarEmojiTurno(juego.getTurnoActual());
        },
        () => {
          juego.siguienteTurno(dados.isDouble);
          actualizarEmojiTurno(juego.getTurnoActual());
        },
        true
      );
    } else {
      juego.siguienteTurno(dados.isDouble);
      actualizarEmojiTurno(juego.getTurnoActual());
    }
  }
  function actualizarEmojiTurno(jugador) {
    const turnoDiv = document.getElementById("turnoActual");
    if (turnoDiv) {
      turnoDiv.textContent = jugador.getFicha(); // Emoji del jugador
    }
  }

  btnFinalizar.addEventListener("click", async () => {
  const { ganador, resultados } = await juego.finalizarJuego();
  alert(`El juego terminó 🎉 Ganó ${ganador.nick} con $${ganador.score}`);
});
});
