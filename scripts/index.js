document.addEventListener("DOMContentLoaded", function () {
document.getElementById("jugarBtn").addEventListener("click", () => {
    localStorage.setItem("jugarBtn", "crearTablero");
    document.location.href = "/html/tablero.html";
});
});