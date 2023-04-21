// Selection de la section qui contient tous les travaux
let galleryWork = document.querySelector(".gallery");

let works = [];
//Allez rechercher les travaux depuis l'API
let appel = await fetch("http://localhost:5678/api/works");
let response = await appel.json();
works = await response;

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

//Function qui permet de supprimer un travail (DELETE)
let imgGalleryAll = document.querySelectorAll(".gallery figure");
let imgGalleryAllTab = Array.from(imgGalleryAll);

for (let i = 0; i < imgGalleryAll.length; i++) {
  imgGalleryAll[i].setAttribute("id", `imageGallery${i + 1}`);
}
let imgModalAll = document.querySelectorAll(".imgContainer");
let imgModalAllTab = Array.from(imgGalleryAll);

for (let i = 0; i < imgModalAll.length; i++) {
  imgModalAll[i].setAttribute("id", `imageModal${i + 1}`);
}

let trashAll = document.querySelectorAll(".trashStyle");
for (let i = 0; i < trashAll.length; i++) {
  //Mettre un id à chaque corbeille
  trashAll[i].setAttribute("id", `${i + 1}`);
  trashAll[i].addEventListener("click", function (e) {
    e.preventDefault();
    let trashId = this.getAttribute("id");
    console.log(trashId);

    let tokenAuthentification = JSON.parse(
      localStorage.getItem("authentification")
    );
    let optionsDelete = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${tokenAuthentification.token}`,
      },
    };
    fetch(`http://localhost:5678/api/works/${trashId}`, optionsDelete)
      .then(imgGalleryAllTab.splice(`${trashId}`, 1))
      .then(imgModalAllTab.splice(`${trashId}`, 1));
  });
}

//Function qui permet d'ajouter un travail
let formPostWork = document.querySelector("#addWorkForm");
formPostWork.addEventListener("submit", function (e) {
  e.preventDefault();
  let inputFile = document.querySelector("#file");
  let inputTitle = document.querySelector("#inputTitre");
  let inputCategorie = document.querySelector("#inputCategorie");
  if (
    inputFile.value != "" &&
    inputTitle.value != "" &&
    inputCategorie.value != ""
  ) {
    let newWork = {
      title: inputTitle.value,
      categoryId: inputCategorie.value,
      imageUrl: inputFile.value,
    };
    let newWorkString = JSON.stringify(newWork);

    let tokenAuthentification = JSON.parse(
      localStorage.getItem("authentification")
    );
    let optionsPost = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${tokenAuthentification.token}`,
      },
      body: newWorkString,
    };
    fetch("http://localhost:5678/api/works", optionsPost);
  } else {
    alert("Veuillez remplir tous les champs");
  }
});
