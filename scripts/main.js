document.addEventListener("DOMContentLoaded", () => {
  const btnJugar = document.getElementById("btnJugar");
  const playersContainer = document.getElementById("playersContainer");
  const playerForm = document.getElementById("playerForm");
  const userModal = document.getElementById("userModal");
  const numPlayersInput = document.getElementById("numPlayers");
  const confirmCountBtn = document.getElementById("confirmCountBtn");
  const saveBtnContainer = document.getElementById("saveBtnContainer");

  let playerCount = 0;
  const colors = ["Verde", "Rojo", "Azul", "Amarillo"];

  //  Obtener lista de países desde API
  //  Obtener lista de países desde API
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) throw new Error("Error al consultar la API");

    const data = await response.json();

    return data
      .map(c => {
        // Si existe traducción al español, úsala. Si no, usa el nombre común en inglés
        return c.translations?.spa?.common || c.name.common;
      })
      .filter(Boolean) // elimina posibles valores null/undefined
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error(" Error al cargar países:", error);
    return [];
  }
}


  // Crear formulario dinámico de jugadores
  async function createPlayerForms(numPlayers) {
    const countries = await fetchCountries();
    playersContainer.innerHTML = "";

    for (let i = 1; i <= numPlayers; i++) {
      const color = colors[i - 1]; // asigna color único

      const countryOptions = countries
        .map(c => `<option value="${c}">${c}</option>`)
        .join("");

      const playerFormHTML = `
        <div class="card mb-3 p-3" id="player-${i}">
          <h6>Jugador ${i}</h6>
          <div class="row g-2">
            <div class="col-md-4">
              <input type="text" class="form-control" name="nickname-${i}" placeholder="Nickname" required>
            </div>
            <div class="col-md-4">
              <select class="form-select" name="country-${i}" required>
                <option value="">Seleccione un país</option>
                ${countryOptions}
              </select>
            </div>
            <div class="col-md-2">
              <input type="text" class="form-control" value="${color}" readonly>
              <small class="text-muted">Color</small>
            </div>
            <div class="col-md-2">
              <input type="number" class="form-control" value="1500" readonly>
              <small class="text-muted">Score</small>
            </div>
          </div>
        </div>
      `;
      playersContainer.insertAdjacentHTML("beforeend", playerFormHTML);
    }

    playersContainer.style.display = "block";
    saveBtnContainer.style.display = "flex";
  }

  // Abrir modal
  btnJugar.addEventListener("click", () => {
    const modal = new bootstrap.Modal(userModal);
    modal.show();
  });

  // Confirmar cantidad de jugadores
  confirmCountBtn.addEventListener("click", () => {
    const numPlayers = parseInt(numPlayersInput.value, 10);

    if (numPlayers < 2 || numPlayers > 4) {
      alert("El número de jugadores debe ser entre 2 y 4.");
      return;
    }

    playerCount = numPlayers;
    createPlayerForms(numPlayers);
  });

  // Guardar jugadores en localStorage
  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const players = [];

    for (let i = 1; i <= playerCount; i++) {
      const nickname = playerForm.querySelector(`[name="nickname-${i}"]`)?.value;
      const country = playerForm.querySelector(`[name="country-${i}"]`)?.value;
      const color = colors[i - 1];

      if (nickname && country) {
        players.push({ nickname, country, color, score: 1500 });
      }
    }

    if (players.length < 2) {
      alert("Debes registrar al menos 2 jugadores.");
      return;
    }

    // Guardar en localStorage
    localStorage.setItem("monopolyPlayers", JSON.stringify(players));

    alert("Jugadores guardados. ¡Vamos al tablero!");
    window.location.href = "html/tablero.html"; // Redirigir al tablero
  });
});
