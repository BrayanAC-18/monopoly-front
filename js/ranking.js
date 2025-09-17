async function cargarRanking() {
      try {
        const response = await fetch("http://127.0.0.1:5000/ranking");
        const data = await response.json();
        const tbody = document.getElementById("ranking-body");

        tbody.innerHTML = "";
        data.forEach((item, index) => {
          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${item.nick_name}</td>
              <td>${item.score}</td>
              <td>${item.country_code.toUpperCase()}</td>
            </tr>
          `;
          tbody.innerHTML += row;
        });
      } catch (error) {
        console.error("Error cargando ranking:", error);
      }
    }

    cargarRanking();