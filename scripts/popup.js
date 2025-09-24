// popup.js
export function showPopup(message, onYes, onNo) {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");
  const yesBtn = document.getElementById("popup-yes");
  const noBtn = document.getElementById("popup-no");

  msg.textContent = message;
  popup.classList.remove("hidden");

  yesBtn.onclick = () => {
    popup.classList.add("hidden");
    if (onYes) onYes();
  };

  noBtn.onclick = () => {
    popup.classList.add("hidden");
    if (onNo) onNo();
  };
}
