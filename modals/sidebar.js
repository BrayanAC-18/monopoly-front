import ModalPopup from "../modals/popup.js";
import Ferrocarril from "../modals/ferrocarril.js";
export default class Sidebar {
  constructor(desktopContainer, mobileContainer, jugadores) {
    this.desktop = desktopContainer;
    this.mobile = mobileContainer;
    this.jugadores = jugadores;
  }

  renderizar() {
    this.desktop.innerHTML = "";
    this.mobile.innerHTML = "";

    this.jugadores.forEach((p) => {
      const cardHTML = `
        <div class="player-card mb-3 p-2 bg-white text-dark rounded" data-player="${p.getId()}">
          <div class="d-flex align-items-center justify-content-between">
            <span>${p.getFicha()}</span>
            <strong>${p.getNombre()}</strong>
            <img src="https://flagsapi.com/${p.getPais()}/flat/32.png" class="ms-auto">
          </div>
          <p class="mt-2 mb-1">💰 <span class="score">${p.getDinero()}</span></p>
          <h6 class="small">Propiedades:</h6>
          <ul class="properties list-unstyled"></ul>
        </div>
      `;
      this.desktop.insertAdjacentHTML("beforeend", cardHTML);
      this.mobile.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  actualizarScore(playerId, newScore) {
    const cards = document.querySelectorAll(`[data-player="${playerId}"]`);
    cards.forEach((card) => {
      const scoreEl = card.querySelector(".score");
      if (scoreEl) scoreEl.textContent = newScore;
    });
  }

  añadirPropiedad(playerId, propiedad, tablero) {
    const cards = document.querySelectorAll(`[data-player="${playerId}"]`);
    if (!cards.length) return;

    cards.forEach((card) => {
      let select = card.querySelector("select.properties-select");
      if (!select) {
        select = document.createElement("select");
        select.classList.add("properties-select");
        select.innerHTML = `<option disabled selected>Propiedades</option>`;
        card.appendChild(select);

        select.addEventListener("change", (e) => {
          const option = e.target.options[e.target.selectedIndex];
          if (option && option.propiedadObj) {
            const p = option.propiedadObj;
            const jugador = this.jugadores.find((j) => j.getId() === playerId);

            this.mostrarModalPropiedad(jugador, p, tablero);
          }
          e.target.selectedIndex = 0;
        });
      }

      const option = document.createElement("option");
      option.textContent = propiedad.getNombre();
      option.propiedadObj = propiedad;
      select.appendChild(option);
    });
  }

  // Nueva función para manejar la compra de casa y actualizar información
  comprarCasa(jugador, propiedad, tablero) {
    const exito = propiedad.construirCasa(tablero);
    if (exito) {
      this.actualizarScore(jugador.getId(), jugador.getDinero());
      return true;
    } else {
      alert("No puedes hacer esto");
      return false;
    }
  }
  comprarHotel(jugador, propiedad, tablero) {
    const exito = propiedad.construirHotel(tablero);
    if (exito) {
      this.actualizarScore(jugador.getId(), jugador.getDinero());
      return true;
    } else {
      alert("No puedes hacer esto");
      return false;
    }
  }

  mostrarModalPropiedad(jugador, propiedad, tablero) {
    const modal = new ModalPopup();

    const generarContenido = () => {
      const renta =
        propiedad instanceof Ferrocarril
          ? propiedad.calcularRenta(jugador)
          : propiedad.calcularRenta();

      const nombre = propiedad.getNombre?.() ?? "N/A";
      const color = propiedad.getColor?.() ?? "N/A";
      const mortgage = propiedad.getMortgage?.() ?? 0;
      const hipotecada = propiedad.getHipotecada?.() ? "Sí" : "No";
      const casas = propiedad.getCasas?.() ?? 0;
      const hotel = propiedad.getHotel?.() ?? 0;
      const dinero = jugador.getDinero?.() ?? 0;

      const casasInfo =
        propiedad instanceof Ferrocarril
          ? ""
          : `<b>🏠 Casas:</b> ${
              propiedad.getCasas?.() ?? 0
            }    <b>🏢 Hotel:</b> ${propiedad.getHotel?.() ?? 0}`;

      return `
      <b>Jugador:</b> ${jugador.getNombre()} 💰 $${dinero} <br>
      <b>Propiedad:</b> ${nombre} <br> 
      <b>Renta:</b> $${renta ?? 0} <br> 
      <b>Color:</b> ${color} <br> 
      <b>Mortgage:</b> ${mortgage} <br> 
      <b>Hipotecada:</b> ${hipotecada} <br>
      ${casasInfo}
    `;
    };

    const actualizarModal = () => {
      modal.actualizarContenido(generarContenido());
      this.actualizarScore(jugador.getId(), jugador.getDinero());

      if (propiedad instanceof Ferrocarril) {
        modal.comprarCasa.hidden = true;
      } else {
        modal.comprarCasa.hidden = !propiedad.puedeConstruir(tablero);
        modal.comprarCasa.textContent =
          propiedad.getCasas() < 4
            ? "Comprar Casa ($100)"
            : "Comprar Hotel($250)";
      }
      // Actualizar texto y visibilidad del botón hipotecar/deshipotecar
      if (propiedad.getHipotecada()) {
        modal.hipotecar.textContent = "Deshipotecar";
      } else {
        modal.hipotecar.textContent = "Hipotecar";
      }
    };

    // Mostrar modal la primera vez
    modal.show(generarContenido(), jugador, null, null, false, null, {
      onHipotecar: () => {
        if (propiedad.getHipotecada()) {
          jugador.deshipotecar(propiedad);
        } else {
          jugador.hipotecar(propiedad);
        }
        actualizarModal();
      },
      onComprarCasa:
        propiedad instanceof Ferrocarril
          ? null
          : propiedad.puedeConstruir(tablero)
          ? () => {
              if (propiedad.getCasas() < 4) {
                this.comprarCasa(jugador, propiedad, tablero);
              } else {
                this.comprarHotel(jugador, propiedad, tablero); // hotel
              }
              actualizarModal();
            }
          : null,
    });

    actualizarModal(); // Inicializar estado correcto del botón
  }
}
