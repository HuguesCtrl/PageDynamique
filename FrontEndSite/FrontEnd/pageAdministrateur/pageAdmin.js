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
    newFigure.setAttribute("id", `imageGallery${works[i].id}`);
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
//Retire le token d'identification du localStorage lorsqu'on se déconnecte
let logout = document.querySelector("#logout");
logout.addEventListener("click", localRemove);
function localRemove() {
  localStorage.removeItem("authentification");
}
//Création du comportement de la modale
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
    newDiv.setAttribute("id", `imageModal${works[i].id}`);
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
    trash.setAttribute("id", `${works[i].id}`);
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
let imgModalAll = document.querySelectorAll(".imgContainer");
let trashAll = document.querySelectorAll(".trashStyle");
for (let i = 0; i < trashAll.length; i++) {
  trashAll[i].addEventListener("click", function (e) {
    e.preventDefault();
    let trashId = this.getAttribute("id");

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
      .then(document.querySelector(`#imageGallery${trashId}`))
      .then(document.querySelector(`#imageModal${trashId}`))
      .then(
        (addWork.style.backgroundColor = "#D65353"),
        (addWork.style.borderColor = "#D65353"),
        (addWork.innerText = "Projet supprimé"),
        setTimeout(() => {
          addWork.style.backgroundColor = null;
          (addWork.style.borderColor = null),
            (addWork.innerText = "Ajouter une photo");
        }, 1000)
      );
  });
}

//Fonction qui permet d'ajouter un travail (POST)
//Selection du formulaire via le DOM
let formPostWork = document.querySelector("#addWorkForm");
let buttonValidation = document.querySelector("#validation");
let inputFile = document.querySelector("#file");

let fileContainer = document.querySelector("#fileContainer");
let fileContainerSpan = document.querySelector("#fileContainer span");
let fileContainerLabel = document.querySelector("#fileContainer label");
let imgUploadText = document.querySelector("#imgUploadText");

//Ecoute de l'envois du formulaire
formPostWork.addEventListener("submit", function (e) {
  e.preventDefault();
  let inputTitle = document.querySelector("#title").value;
  let inputCategory = document.querySelector("#category").value;

  let workSend = new FormData();
  workSend.append("image", inputFile.files[0]);
  workSend.append("title", inputTitle);
  workSend.append("category", inputCategory);
  let imageSize = workSend.get("image").size;
  let imageType = workSend.get("image").type;

  let tokenAuthentification = JSON.parse(
    localStorage.getItem("authentification")
  ).token;
  let optionsPost = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenAuthentification}`,
    },
    body: workSend,
  };
  if (
    (imageSize < 4e6 && imageType === "image/png") ||
    imageType === "image/jpg"
  ) {
    fetch("http://localhost:5678/api/works", optionsPost)
      .then((res) => {
        if (res.ok) {
          buttonValidation.innerText = "Projet ajouté";
          buttonValidation.style.backgroundColor = "#1D6154";
          setTimeout(() => {
            buttonValidation.style.backgroundColor = null;
            buttonValidation.innerText = "Valider";
          }, 1000);
        }
      })
      .catch((err) => console.log(err + "Non"));
  } else {
    console.log("Echec de l'envois");
  }
});

inputFile.addEventListener("change", function () {
  let imgUpload = this.files[0];
  console.log(imgUpload);
  if (
    (imgUpload.size < 4e6 && imgUpload.type === "image/png") ||
    imgUpload.type === "image/jpeg"
  ) {
    imgUploadText.remove();
    let newImg = document.createElement("img");
    fileContainer.prepend(newImg);
    fileContainer.style.padding = 0;
    fileContainer.style.height = "200px";
    newImg.style.height = "100%";
    newImg.style.display = "block";
    fileContainerSpan.remove();
    fileContainerLabel.remove();
    let fileReader = new FileReader();
    fileReader.onload = function (e) {
      newImg.setAttribute("src", e.target.result);
    };
    fileReader.readAsDataURL(imgUpload);
  } else {
    imgUploadText.style.color = "red";
    imgUploadText.innerText = `Image 4Mo max / Format acceptés: Jpeg, Png`;
  }
});
