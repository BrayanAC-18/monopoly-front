const coloresSemaforo = ["green", "yellow","red"]  ;

export function semaforoHipoteca(jugador,sidebar,juego){
    const  hipotecas = jugador.getHipotecas();

    let color = "green";
    if(hipotecas === 1) color = "yellow";
    if(hipotecas === 2) color = "red";

    // buscar la tarjeta del jjugador
    const card = document.querySelector(`[data-player="${jugador.getId()}"]`);
     if (card) {
    let indicador = card.querySelector(".semaforo");
    if (!indicador) {
      indicador = document.createElement("div");
      indicador.classList.add("semaforo");
      card.appendChild(indicador);
    }
    indicador.style.backgroundColor = color;

    if(hipotecas > 3){
        const resultado = juego.finalizarJuego(jugador);
        alert(`Juego terminado 🚨. Ganador: ${resultado.jugador.getNombre()}`);
        window.location.href = "html/ranking.html";
    }
  }
}