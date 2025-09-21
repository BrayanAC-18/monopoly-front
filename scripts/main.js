document.addEventListener("DOMContentLoaded", () => {
  const btnJugar = document.getElementById("btnJugar");
  const playersContainer = document.getElementById("playersContainer");
  const addPlayerBtn = document.getElementById("addPlayerBtn");
  const playerForm = document.getElementById("playerForm");
  const userModal = document.getElementById("userModal");
  const maxPlayers = 4;
  let playerCount = 0;

  function createPlayerForm(id) {
    return `
      <div class="card mb-3 p-3" id="player-${id}">
        <h6>Jugador ${id}</h6>
        <div class="row g-2">
          <div class="col-md-4">
            <input type="text" class="form-control" name="nickname-${id}" placeholder="Nickname" required>
          </div>
          <div class="col-md-4">
            <input type="text" class="form-control" name="country-${id}" placeholder="País" required>
          </div>
          <div class="col-md-3">
            <input type="number" class="form-control" value="1000" readonly>
            <small class="text-muted">Score inicial</small>
          </div>
          <div class="col-md-1 d-flex align-items-center">
            <button type="button" class="btn btn-danger btn-sm remove-player" data-id="${id}">❌</button>
          </div>
        </div>
      </div>
    `;
  }

  // Mostrar modal
  btnJugar.addEventListener("click", () => {
    const modal = new bootstrap.Modal(userModal);
    modal.show();
  });

  // Agregar jugador
  addPlayerBtn.addEventListener("click", () => {
    if (playerCount < maxPlayers) {
      playerCount++;
      playersContainer.insertAdjacentHTML("beforeend", createPlayerForm(playerCount));
    } else {
      alert("Máximo 4 jugadores.");
    }
  });

  // Eliminar jugador
  playersContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-player")) {
      const id = e.target.getAttribute("data-id");
      document.getElementById(`player-${id}`).remove();
      playerCount--;
    }
  });

  // Guardar jugadores
  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const players = [];

    for (let i = 1; i <= playerCount; i++) {
      const nickname = playerForm.querySelector(`[name="nickname-${i}"]`)?.value;
      const country = playerForm.querySelector(`[name="country-${i}"]`)?.value;

      if (nickname && country) {
        players.push({ nickname, country, score: 1000 });
      }
    }

    console.log("Jugadores registrados:", players);
    alert("Jugadores guardados en consola.");
  });
});
