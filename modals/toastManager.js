// toastManager.js
export default class ToastManager {
  constructor(containerId = "toast-container", templateId = "toast-template") {
    this.container = document.getElementById(containerId);
    this.template = document.getElementById(templateId);

    if (!this.container || !this.template) {
      throw new Error("Toast container o template no encontrados en el DOM. Asegúrate de incluirlos en el HTML.");
    }
  }

  /**
   * show options:
   * { title, message, type, delay }
   * type: primary, success, danger, warning, info
   */
  show({ title = "", message = "", type = "primary", delay = 4000 } = {}) {
    // clona el template
    const node = this.template.content.firstElementChild.cloneNode(true);

    // ajustar clase de color
    // eliminamos clases text-bg-* por si acaso
    node.classList.remove("text-bg-primary","text-bg-success","text-bg-danger","text-bg-warning","text-bg-info");
    node.classList.add(`text-bg-${type}`);

    // setear texto
    const titleEl = node.querySelector(".toast-title");
    const msgEl = node.querySelector(".toast-message");
    if (titleEl) titleEl.innerHTML = title;
    if (msgEl) msgEl.innerHTML = message;

    // append sin tocar nada más del DOM
    this.container.appendChild(node);

    // iniciar bootstrap toast
    const bsToast = new bootstrap.Toast(node, { delay });
    bsToast.show();

    // limpiar cuando termine
    node.addEventListener("hidden.bs.toast", () => node.remove());

    return bsToast;
  }
}
