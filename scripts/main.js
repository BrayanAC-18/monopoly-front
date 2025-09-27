document.addEventListener("DOMContentLoaded", () => {
  const btnJugar = document.getElementById("btnJugar");
  const playersContainer = document.getElementById("playersContainer");
  const playerForm = document.getElementById("playerForm");
  const userModal = document.getElementById("userModal");
  const numPlayersInput = document.getElementById("numPlayers");
  const confirmCountBtn = document.getElementById("confirmCountBtn");
  const iniciarPartida = document.getElementById("iniciarPartida");

  let playerCount = 0;
  const fichas = ["🐸", "🚗", "🚀", "🌻"];
  const colores = ["verde","rojo","azul","amarillo"]

  //  Obtener lista de países desde API
  async function fetchCountries() {
    try {
      const response = await fetch("http://127.0.0.1:5000/countries");
      if (!response.ok) throw new Error("Error al consultar la API");

      const data = await response.json();

      return data
        .map((c) => {
          const [code, name] = Object.entries(c)[0];
          return { code, name };
        })
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
      const ficha = fichas[i - 1]; // asigna color único

      const countryOptions = countries
      .map((c) => {return `<option value="${c.code}">${c.name}</option>`;
      })
      .join("");

      const playerFormHTML = `
        <div class="card mb-3 p-3" id="player-${i}">
          <h6>Jugador ${i}</h6>
          <div class="row g-2">
            <div class="col-md-4">
              <input type="text" class="form-control" name="nickname-${i}" placeholder="Nickname" required>
            </div>
            <div class="col-md-4">
              <select class="form-select country" name="country-${i}" data-player="${i}" required>
                <option value="">Seleccione un país</option>
                ${countryOptions}
              </select>
            </div>
            <div class="col-md-2">
              <input type="text" class="form-control" value="${ficha}" readonly>
              <small class="text-muted">Ficha</small>
            </div>
            <div id="countryImg-${i}" class="col-md-2">
            </div>
          </div>
        </div>
      `;
      playersContainer.insertAdjacentHTML("beforeend", playerFormHTML);
      playersContainer.querySelectorAll(".country").forEach(select => {
        select.addEventListener("change", (e) => {
          let countryValue = e.target.value.toUpperCase(); //nombre del country
          let playerId = e.target.dataset.player;
          let flagDiv = document.getElementById(`countryImg-${playerId}`);
          flagDiv.innerHTML = `<img class="bandera" id="${playerId}-${countryValue}" src="https://flagsapi.com/${countryValue}/flat/64.png">`;
        });

      });
    }
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
  iniciarPartida.addEventListener("click", (e) => {
    e.preventDefault();
    const players = [];

    for (let i = 1; i <= playerCount; i++) {
      const nickname = playerForm.querySelector(
        `[name="nickname-${i}"]`
      )?.value;
      const country = playerForm.querySelector(`[name="country-${i}"]`)?.value.toUpperCase();
      const ficha = fichas[i - 1];
      const color = colores[i - 1]
      const id = i
      if (nickname && country) {
        players.push({id,nickname, country, ficha, color});
      }
    }

    if (players.length < 2) {
      alert("Debes registrar al menos 2 jugadores.");
      return;
    }

    // Guardar en localStorage
    localStorage.setItem("monopolyPlayers", JSON.stringify(players));

    alert("Jugadores guardados. ¡Vamos al tablero!");
    document.location.href = "html/tablero.html"; // Redirigir al tablero
  });
});
