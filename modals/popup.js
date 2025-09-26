export default class ModalPopup {
  constructor() {
    this.modalElement = document.getElementById("popupDados");
    this.messageElement = document.getElementById("popupMessage");
    this.fichaElement = document.getElementById("popupJugadorFicha");
    this.confirmButton = document.getElementById("popupConfirm");

    // Instancia Bootstrap Modal
    this.modal = new bootstrap.Modal(this.modalElement, {
      backdrop: "static",
      keyboard: false
    });
  }

  
  show(message, jugador, onConfirm, onCancel) {
    // Mensaje
    this.messageElement.innerHTML = message;

    // Mostrar ficha/emoji
    this.fichaElement.textContent = jugador.getFicha();

    // Limpiar eventos previos
    this.confirmButton.onclick = null;
    this.modalElement.querySelector('[data-bs-dismiss="modal"]').onclick = null;

    // Confirmar
    this.confirmButton.onclick = () => {
      this.modal.hide();
      if (onConfirm) onConfirm();
    };

    // Cancelar
    this.modalElement.querySelector('[data-bs-dismiss="modal"]').onclick = () => {
      if (onCancel) onCancel();
    };

    // Mostrar modal
    this.modal.show();
  }
}
