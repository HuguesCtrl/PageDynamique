// Selection de la section qui contient tous les travaux
let galleryWork = document.querySelector(".gallery");

let works = [];
//Allez rechercher les travaux depuis l'API
works = JSON.parse(localStorage.getItem("works"));

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
    newDiv.style.width = "18%";
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
  for (let i = 0; i < trashAll.length; i++) {
    trashAll[i].addEventListener("click", function (e) {
      e.preventDefault();
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

//Recuperation de la fleche precedente pour la navigation dans la modale
let arrowBack = document.querySelector("#back");
let modalContainer = document.querySelector("#modale-content-container");
let modal1 = document.querySelector("#modale-content");
modal1.classList.add("visible");
let modal2 = document.querySelector("#modale-content-2");
let addWork = document.querySelector("#AddWork");

arrowBack.addEventListener("click", function () {
  modal2.classList.remove("visible");
  modal1.classList.add("visible");
});
addWork.addEventListener("click", function () {
  modal1.classList.remove("visible");
  modal2.classList.add("visible");
});

//Requete POST
let formSendWork = document.querySelector("#addWorkForm");

formSendWork.addEventListener("submit", function (e) {
  e.preventDefault();
  let inputFile = document.querySelector("#file");
  let inputText = document.querySelector("#titrePicture");
  let inputCategorie = document.querySelector("#categorie");
  //Token pour s'identifier
  let authentificationToken = JSON.parse(
    localStorage.getItem("authentification")
  ).token;
  //Recuperation de tous les travaux
  let allWorks = JSON.parse(localStorage.getItem("works"));
  console.log(allWorks);
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authentificationToken}`,
    },
    body: JSON.stringify(allWorks),
  };
  fetch("http://localhost:5678/api/works", options).then((res) => {
    if (res.ok) {
      console.log("ok");
    }
  });
});
