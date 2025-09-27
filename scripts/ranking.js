async function cargarRanking() {
  try {
    const response = await fetch("http://127.0.0.1:5000/ranking");
    if (!response.ok) throw new Error("Error al cargar el ranking");

    const data = await response.json();
    const tbody = document.getElementById("ranking-body");

    tbody.innerHTML = "";
    data.forEach((item, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${item.nick_name}</td>
          <td>$${item.score}</td>
          <td>
            <img src="https://flagsapi.com/${item.country_code.toUpperCase()}/flat/32.png" 
                 alt="${item.country_code}" />
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error cargando ranking:", error);
  }
}

btnVolver = document.getElementById("btnVolver");
btnVolver.addEventListener("click", () => {
  window.location.href = "index.html"; // Redirige al HTML de inicio
});