// Selection de la section qui contient tous les travaux
let galleryWork = document.querySelector(".gallery");
console.log(galleryWork);

let works = [];
//Allez rechercher les travaux de la gallerie via le localStorage et les stocker dans le tableau
let localWorks = localStorage.getItem("works");
works = JSON.parse(localWorks);

//Fonction qui génère l'affichage de la gallerie
function displayWorks(filtreCategorie) {
  for (let i = 0; i < filtreCategorie.length; i++) {
    let newFigure = document.createElement("figure");
    let newImg = document.createElement("img");
    let newFigCaption = document.createElement("figcaption");
    newImg.src = `${filtreCategorie[i].imageUrl}`;
    newFigCaption.innerText = `${filtreCategorie[i].title}`;
    newFigure.append(newImg);
    newFigure.append(newFigCaption);
    galleryWork.append(newFigure);
  }
}
//Appel par défaut qui permet au chargement de la page d'afficher tous les travaux
displayWorks(works);
//Retire le token d'identification du localStorage lorqu'on se déconnecte
let logout = document.querySelector("#logout");
logout.addEventListener("click", localRemove);
function localRemove() {
  localStorage.removeItem("authentification");
}

let modalRemove = document.querySelectorAll(".modale-remove");
let buttonModal = document.querySelector("#edit-gallery");
let modal = document.querySelector("#modale-container");
buttonModal.addEventListener("click", function () {
  modal.classList.add("active");
});

modalRemove.forEach((remove) =>
  remove.addEventListener("click", function () {
    modal.classList.remove("active");
  })
);
//Ferme la modale avec la touche echap
window.document.addEventListener("keydown", function (e) {
  console.log(e);
  if (e.key === "Escape") {
    modal.classList.remove("active");
  }
});
//Recupère la liste de la modale
let listPicturesModal = document.querySelector("#list-works");

function displayPictures() {
  for (let i = 0; i < works.length; i++) {
    let newDiv = document.createElement("div");
    newDiv.style.width = "20%";
    let newImg = document.createElement("img");
    newImg.src = `${works[i].imageUrl}`;
    let newPara = document.createElement("p");
    newPara.innerText = "éditer";
    newPara.style.color = "black";
    newDiv.append(newImg);
    newDiv.append(newPara);
    listPicturesModal.append(newDiv);
  }
}
displayPictures();
