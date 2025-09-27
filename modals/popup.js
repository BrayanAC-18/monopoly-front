export default class ModalPopup {
  constructor() {
    this.modalElement = document.getElementById("popup");
    this.messageElement = document.getElementById("popupMessage");
    this.fichaElement = document.getElementById("popupJugadorFicha");
    this.mainButton = document.getElementById("popupConfirm");
    this.cancelButton = document.getElementById("popupCancel");

    // Botones extra (definidos en el HTML con hidden)
    this.hipotecar = document.getElementById("popupHipotecar");
    this.comprarCasa = document.getElementById("popupComprar");

    // Instancia de Bootstrap Modal
    this.modal = new bootstrap.Modal(this.modalElement, {
      backdrop: "static",
      keyboard: false,
    });

    this.onHiddenCallback = null;

    this.modalElement.addEventListener("hidden.bs.modal", () => {
      if (this.onHiddenCallback) {
        const callback = this.onHiddenCallback;
        this.onHiddenCallback = null;
        callback();
      }
    });
  }

  /**
   * @param {string} message - Mensaje HTML
   * @param {Jugador} jugador - jugador actual
   * @param {function} onConfirm - acción botón Aceptar
   * @param {function} onCancel - acción botón Cancelar
   * @param {boolean} showCancel - mostrar botón Cancelar
   * @param {function} onHidden - callback al cerrar modal
   * @param {object} accionesProp - { onHipotecar, onComprarCasa }
   */
  show(
    message,
    jugador,
    onConfirm,
    onCancel,
    showCancel = true,
    onHidden = null,
    accionesProp = {}
  ) {
    this.messageElement.innerHTML = message;
    this.fichaElement.textContent = jugador.getFicha();

    // Mostrar/ocultar botones básicos
    this.cancelButton.style.display = showCancel ? "inline-block" : "none";

    // Resetear eventos
    this.mainButton.onclick = null;
    this.cancelButton.onclick = null;
    this.hipotecar.onclick = null;
    this.comprarCasa.onclick = null;

    // Acción confirmar
    this.mainButton.onclick = () => {
      this.modal.hide();
      if (onConfirm) onConfirm();
    };

    // Acción cancelar
    this.cancelButton.onclick = () => {
      this.modal.hide();
      if (onCancel) onCancel();
    };

    // Botones de propiedades
    if (accionesProp.onHipotecar) {
      this.hipotecar.hidden = false;
      this.hipotecar.onclick = () => {
        this.modal.hide();
        accionesProp.onHipotecar();
      };
    } else {
      this.hipotecar.hidden = true;
    }

    if (accionesProp.onComprarCasa) {
      this.comprarCasa.hidden = false;
      this.comprarCasa.onclick = () => {
        this.modal.hide();
        accionesProp.onComprarCasa();
      };
    } else {
      this.comprarCasa.hidden = true;
    }

    // Guardar callback onHidden
    this.onHiddenCallback = onHidden;

    this.modal.show();
  }
  actualizarContenido(nuevoMensaje) {
    this.messageElement.innerHTML = nuevoMensaje;
  }
}
