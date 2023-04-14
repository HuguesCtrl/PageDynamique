let openModalButton = document.querySelector("#openModal");
let modal = document.querySelector(".modal-container");
let modalTrigger = document.querySelectorAll(".modal-trigger");

for (let trigger of modalTrigger) {
  trigger.addEventListener("click", openModal);
}

function openModal() {
  modal.classList.toggle("active");
}
