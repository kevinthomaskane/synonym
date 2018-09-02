let word;
const modal = document.createElement("div");
modal.className = "injected-modal";
document.body.appendChild(modal);

chrome.runtime.onMessage.addListener(msgObj => {
  if (msgObj) {
    word = msgObj.word;
    modal.style.visibility = "visible";
    modal.style.right = "20px";
    modal.style.animation = "slide .5s";
    closeModal();
  }
});

function closeModal() {
  document.body.addEventListener("click", () => {
    modal.setAttribute(
      "style",
      "right: -9999px; visibility: hidden; transition: .2s ease-in-out;"
    );
  });
}
