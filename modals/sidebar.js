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

  añadirPropiedad(playerId, propertyName) {
    const card = document.querySelector(`[data-player="${playerId}"]`);
    if (card) {
      const ul = card.querySelector(".properties");
      const li = document.createElement("li");
      li.textContent = propertyName;

      const btn = document.createElement("button");
      btn.textContent = "Hipotecar";
      btn.onclick = () => {
        li.classList.add("mortgaged");
        console.log(`Jugador ${playerId} hipotecó ${propertyName}`);
      };

      li.appendChild(btn);
      ul.appendChild(li);
    }
  }
}
