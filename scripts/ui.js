// ui.js
export function renderSidebar(players) {
  const desktop = document.getElementById("sidebarDesktop");
  const mobile = document.getElementById("sidebarMobileContent");
  desktop.innerHTML = "";
  mobile.innerHTML = "";

  players.forEach((p, i) => {
    const cardHTML = `
      <div class="player-card mb-3 p-2 bg-white text-dark rounded" data-player="${i}">
        <div class="d-flex align-items-center justify-content-between">
          <span class="color-box me-2" style="background:${p.color || 'gray'}; width:15px; height:15px; border-radius:50%; display:inline-block"></span>
          <strong>${p.nick}</strong>
          <img src="https://flagsapi.com/${p.country}/flat/32.png" class="ms-auto">
        </div>
        <p class="mt-2 mb-1">💰 <span class="score">${p.cash}</span></p>
        <h6 class="small">Propiedades:</h6>
        <ul class="properties list-unstyled"></ul>
      </div>
    `;
    desktop.insertAdjacentHTML("beforeend", cardHTML);
    mobile.insertAdjacentHTML("beforeend", cardHTML);
  });
}

export function updateScore(playerIndex, newScore) {
  const cards = document.querySelectorAll(`[data-player="${playerIndex}"]`);
  cards.forEach(card => {
    const scoreSpan = card.querySelector(".score");
    if (scoreSpan) scoreSpan.textContent = newScore;
  });
}

export function addProperty(playerIndex, propertyName) {
  const cards = document.querySelectorAll(`[data-player="${playerIndex}"]`);
  cards.forEach(card => {
    const ul = card.querySelector(".properties");
    if (ul) {
      const li = document.createElement("li");
      li.textContent = propertyName;

      const btn = document.createElement("button");
      btn.textContent = "Hipotecar";
      btn.classList.add("btn", "btn-sm", "btn-outline-danger", "ms-2");
      btn.onclick = () => {
        li.classList.add("mortgaged");
        console.log(`Jugador ${playerIndex} hipotecó ${propertyName}`);
      };

      li.appendChild(btn);
      ul.appendChild(li);
    }
  });
}
