// Selection de la section qui contient tous les travaux
let galleryWork = document.querySelector(".gallery");

let works = [];
//Allez rechercher les travaux depuis l'API

let appel = await fetch("http://localhost:5678/api/works");
let response = await appel.json();
works = await response;
console.log(works);

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
      .then(document.querySelector(`#imageGallery${trashId}`).remove())
      .then(document.querySelector(`#imageModal${trashId}`).remove());
  });
}

//Fonction qui permet d'ajouter un travail (POST)
//Selection du formulaire via le DOM
let formPostWork = document.querySelector("#addWorkForm");
let buttonValidation = document.querySelector("#validation");
let inputFile = document.querySelector("#file");
let inputTitle = document.querySelector("#title");
let inputCategory = document.querySelector("#category");

//Condition bouton vert

window.addEventListener("load", function () {
  inputFile.value = "";
  inputTitle.value = "";
});

formPostWork.addEventListener("change", function () {
  if (inputFile.value) {
    if (inputFile.files[0] !== "" && inputTitle.value !== "") {
      buttonValidation.style.backgroundColor = "#1D6154";
      buttonValidation.innerText = "Champs valides";
    }
  }
});

console.log(inputTitle.value);
console.log(inputFile.value);

let fileContainer = document.querySelector("#fileContainer");
let fileContainerSpan = document.querySelector("#fileContainer span");
let fileContainerLabel = document.querySelector("#fileContainer label");
let imgUploadText = document.querySelector("#imgUploadText");
let errorText = document.querySelector("#errorText");

//Ecoute de l'envois du formulaire
formPostWork.addEventListener("submit", async function (e) {
  e.preventDefault();

  let workSend = new FormData();
  workSend.append("image", inputFile.files[0]);
  workSend.append("title", inputTitle.value);
  workSend.append("category", inputCategory.value);
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
    (inputTitle.value != "" &&
      inputFile.files[0] != "" &&
      imageSize < 4e6 &&
      imageType === "image/png") ||
    (inputTitle.value != "" &&
      inputFile.files[0] != "" &&
      imageSize < 4e6 &&
      imageType === "image/jpeg")
  ) {
    let postWorks = await fetch("http://localhost:5678/api/works", optionsPost);

    //Second appel à l'api lors de la soumission du formulaire
    let appelApi = await fetch("http://localhost:5678/api/works");
    let responseAPI = await appelApi.json();
    works = await responseAPI;
    console.log(works);
    addWorkGallery(
      works[works.length - 1].imageUrl,
      works[works.length - 1].title,
      works[works.length - 1].id
    );
    addWorkModal(works[works.length - 1].imageUrl, works[works.length - 1].id);
    console.log(trashAll);
    //Supprimer de la modale et de la gallery et de l'api un projet ajouté au clic sur la corbeille
    let trashWorksAdd = document.querySelectorAll(".trashStyle");
    trashWorksAdd.forEach((trashSingle) =>
      trashSingle.addEventListener("click", async function () {
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
        fetch(`http://localhost:5678/api/works/${this.id}`, optionsDelete)
          .then(document.querySelector(`#imageModal${this.id}`).remove())
          .then(document.querySelector(`#imageGallery${this.id}`).remove());
      })
    );

    if (postWorks) {
      modal2.classList.remove("visible");
      modal1.classList.add("visible");
      //Le bouton de validation redevient gris
      buttonValidation.style.backgroundColor = null;
      buttonValidation.innerText = "Valider";
      //Le inputFile se vide et redevient normal sans l'image de previsualisation
      // avec les labels et les messages affichés
      inputFile.value = "";
      inputTitle.value = "";
      fileContainer.children[0].remove();
      fileContainerSpan.style.display = "";
      fileContainerLabel.style.display = "";
      imgUploadText.style.display = "";
      imgUploadText.style.color = "";
      imgUploadText.innerText = "jpg, png : 4mo max";
      fileContainer.style.padding = "";
      fileContainer.style.height = "";
      errorText.classList.remove("activeText");
    } else {
      console.log("Echec du status");
    }
  } else {
    if (inputTitle.value == "") {
      errorText.classList.add("activeText");
    }
    imgUploadText.innerText = "Image non ajoutée";
    imgUploadText.style.color = "red";
  }
});

//Erreur titre disparait
inputTitle.addEventListener("input", function () {
  if (inputTitle.value != "") {
    errorText.classList.remove("activeText");
  } else {
    errorText.classList.add("activeText");
    buttonValidation.style.backgroundColor = null;
    buttonValidation.innerText = "Valider";
  }
});

inputFile.addEventListener("change", function () {
  let imgUpload = this.files[0];
  console.log(imgUpload);
  if (
    (imgUpload.size < 4e6 && imgUpload.type === "image/png") ||
    imgUpload.type === "image/jpeg"
  ) {
    let newImg = document.createElement("img");
    fileContainer.prepend(newImg);
    fileContainer.style.padding = 0;
    fileContainer.style.height = "200px";
    newImg.style.height = "100%";
    newImg.style.display = "block";
    fileContainerSpan.style.display = "none";
    imgUploadText.style.display = "none";
    fileContainerLabel.style.display = "none";
    let fileReader = new FileReader();
    fileReader.onload = function (e) {
      newImg.setAttribute("src", e.target.result);
    };
    fileReader.readAsDataURL(imgUpload);
  } else {
    imgUploadText.style.color = "red";
    imgUploadText.innerText = `Image 4Mo max / Format acceptés: Jpeg, Png`;
    inputFile.value = "";
  }
});

//Ajouter la photo à la gallery
function addWorkGallery(url, text, id) {
  let newFigure = document.createElement("figure");
  newFigure.setAttribute("id", `imageGallery${id}`);
  let newImg = document.createElement("img");
  newImg.src = `${url}`;
  let newFigCaption = document.createElement("figcaption");
  newFigCaption.innerText = text;
  newFigure.append(newImg, newFigCaption);
  galleryWork.append(newFigure);
}

//Ajouter la photo à la modale
function addWorkModal(url, id) {
  let newDiv = document.createElement("div");
  newDiv.style.width = "18%";
  newDiv.setAttribute("class", "imgContainer");
  newDiv.setAttribute("id", `imageModal${id}`);
  let newImg = document.createElement("img");
  newImg.setAttribute("class", "imgWorks");
  newImg.src = `${url}`;
  let newPara = document.createElement("p");
  newPara.innerText = "éditer";
  newPara.style.color = "black";
  newDiv.append(newImg);
  newDiv.append(newPara);
  listPicturesModal.append(newDiv);

  //Creation des icones en position absolute
  newDiv.style.position = "relative";
  let trash = document.createElement("div");
  trash.setAttribute("id", `${id}`);
  trash.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  trash.classList.add("trashStyle");
  newDiv.append(trash);
  //Le bouton move
  let move;
  newDiv.addEventListener("mouseenter", function () {
    newDiv.style.position = "relative";
    move = document.createElement("div");
    move.innerHTML = `<i class="fa-solid fa-arrows-up-down-left-right"></i>`;
    //Ajouter les boutons move et delete
    move.classList.add("moveStyle");
    newDiv.append(move);
  });
  newDiv.addEventListener("mouseleave", function () {
    move.style.display = "none";
  });
}
