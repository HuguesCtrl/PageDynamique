// Selection de la section qui contient tous les travaux
let galleryWork = document.querySelector(".gallery");

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
//Fonction qui permet d'afficher les images dans la div de la modale
function displayPictures() {
  for (let i = 0; i < works.length; i++) {
    let newDiv = document.createElement("div");
    newDiv.style.width = "20%";
    newDiv.setAttribute("class", "imgContainer");
    let newImg = document.createElement("img");
    newImg.setAttribute("class", "imgWorks");
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

//Fonction qui permet d'afficher les icones en position absolute
function displayIcon() {
  let divImgAll = document.querySelectorAll(".imgContainer");
  console.log(divImgAll);
  for (let i = 0; i < divImgAll.length; i++) {
    divImgAll[i].style.position = "relative";
    let trash = document.createElement("div");
    trash.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    trash.classList.add("trashStyle");
    divImgAll[i].append(trash);
  }
  for (let i = 0; i < divImgAll.length; i++) {
    let move;
    divImgAll[i].addEventListener("mouseenter", function () {
      divImgAll[i].style.position = "relative";
      move = document.createElement("div");
      move.innerHTML = `<i class="fa-solid fa-arrows-up-down-left-right"></i>`;
      move.classList.add("moveStyle");
      divImgAll[i].append(move);
    });
    divImgAll[i].addEventListener("mouseleave", function () {
      move.style.display = "none";
    });
  }
}
displayIcon();

//Function qui permet de supprimer un travail
function removeWork() {
  let trashAll = document.querySelectorAll(".trashStyle");
  let divImgAll = document.querySelectorAll(".imgContainer");
  let imgGalleryAll = document.querySelectorAll(".gallery figure");
  console.log(imgGalleryAll);
  for (let i = 0; i < trashAll.length; i++) {
    trashAll[i].addEventListener("click", function () {
      let authentificationToken = JSON.parse(
        localStorage.getItem("authentification")
      ).token;
      let options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${authentificationToken}`,
        },
      };
      fetch(`http://localhost:5678/api/works/${i}`, options)
        .then(divImgAll[i].remove())
        .then(imgGalleryAll[i].remove());
    });
  }
}
removeWork();
