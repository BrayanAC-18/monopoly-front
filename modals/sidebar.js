import Ferrocarril from "../modals/ferrocarril.js";
import ModalPopup from "../modals/popup.js";
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
    const cards = document.querySelectorAll(`[data-player="${playerId}"]`); //modificar tanto para desktop como para movil
    cards.forEach((card) => {
      const scoreEl = card.querySelector(".score");
      if (scoreEl) scoreEl.textContent = newScore;
    });
  }

  añadirPropiedad(playerId, propiedad) {
    const cards = document.querySelectorAll(`[data-player="${playerId}"]`);
    if (!cards.length) return;

    cards.forEach((card) => {
      // Buscar o crear el select de propiedades
      let select = card.querySelector("select.properties-select");
      if (!select) {
        select = document.createElement("select");
        select.classList.add("properties-select");
        select.innerHTML = `<option disabled selected>Propiedades</option>`;
        card.appendChild(select);

        // Evento al cambiar la selección
        select.addEventListener("change", (e) => {
          const option = e.target.options[e.target.selectedIndex];
          if (option && option.propiedadObj) {
            const p = option.propiedadObj;
            const jugador = this.jugadores.find(
                (j) => j.getId() === playerId
              );
            // Diferenciar Propiedad y Ferrocarril
            let renta = 0;
            if (p instanceof Ferrocarril) {
              
              renta = p.calcularRenta(jugador);
            } else {
              renta = p.calcularRenta();
            }
              const modal = new ModalPopup(true)

              modal.show( //mensaje
                `<b>Informacion de propiedad</b> <br> 
                <b>Nombre:</b> ${p.getNombre()} <br> 
                <b>Renta:</b> $${renta} <br> 
                <b>Color:</b> ${p.getColor?p.getColor():"N/A"} <br> 
                <b>Mortgage:</b> ${p.getMortgage()} <br> 
                <b>Hipotecada:</b> ${p.getHipotecada()?"Sí":"No"}`, 
                jugador,null,null,false,null, 
                {
                onHipotecar: () => {
                  jugador.hipotecar(p);
                  this.actualizarScore(jugador.getId(), jugador.getDinero());
                },
                onComprarCasa: () => {
                  //implementar
                }
              });
          }

          e.target.selectedIndex = 0; // volver al placeholder
        });
      }

      // Crear la opción para la propiedad
      const option = document.createElement("option");
      option.textContent = propiedad.getNombre();
      option.propiedadObj = propiedad;

      select.appendChild(option);
    });
  }
}
