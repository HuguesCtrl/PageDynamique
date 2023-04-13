let galleryWork = document.querySelector(".gallery");
console.log(galleryWork);
let h2Projects = document.querySelector("#portfolio h2");
console.log(h2Projects);
//Création d'un tableau intitulé works qui récupère tous les travaux
let works = [];
//Allez rechercher les travaux de la gallerie via l'API
async function getWorks() {
  let appel = await fetch("http://localhost:5678/api/works");
  let response = await appel.json();
  works = response;
}
await getWorks();
console.log(works);

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
displayWorks(works);

let categories = [];

async function getCategories() {
  let appel = await fetch("http://localhost:5678/api/categories");
  let response = await appel.json();
  categories = response;
}
//Création d'un tableau intitulé categories qui récupère toutes les catégories
await getCategories();
console.log(categories);

function createButton() {
  let divButton = document.createElement("div");
  divButton.setAttribute("class", "divButton");
  let createButton = document.createElement("button");
  createButton.innerText = "Tout";
  createButton.setAttribute("id", "Bouton0");
  divButton.append(createButton);
  for (let i = 0; i < categories.length; i++) {
    let createButtonCategories = document.createElement("button");
    createButtonCategories.innerText = `${categories[i].name}`;
    createButtonCategories.setAttribute("id", `Bouton${categories[i].id}`);
    divButton.append(createButtonCategories);
  }
  h2Projects.insertAdjacentElement("afterend", divButton);
}
createButton();

//Création des filtres selon les différentes catégories des travaux

let categorieObjets = works.filter(
  (filterCategorie) => filterCategorie.category.name === "Objets"
);
let categorieAppartements = works.filter(
  (filterCategorie) => filterCategorie.category.name === "Appartements"
);
console.log(categorieAppartements);
let categorieHotelsRestaurants = works.filter(
  (filterCategorie) => filterCategorie.category.name === "Hotels & restaurants"
);

let buttonTout = document.querySelector("#Bouton0");
buttonTout.classList.add("active");
let buttonObjets = document.querySelector("#Bouton1");
let buttonAppartements = document.querySelector("#Bouton2");
let buttonHotelsRestaurants = document.querySelector("#Bouton3");

buttonTout.addEventListener("click", async function () {
  galleryWork.innerHTML = "";
  displayWorks(works);
  allChildRemoveActive();
  this.classList.add("active");
});

buttonAppartements.addEventListener("click", function () {
  galleryWork.innerHTML = "";
  displayWorks(categorieAppartements);
  allChildRemoveActive();
  this.classList.add("active");
});

buttonObjets.addEventListener("click", function () {
  galleryWork.innerHTML = "";
  displayWorks(categorieObjets);
  allChildRemoveActive();
  this.classList.add("active");
});
buttonHotelsRestaurants.addEventListener("click", function () {
  galleryWork.innerHTML = "";
  displayWorks(categorieHotelsRestaurants);
  allChildRemoveActive();
  this.classList.add("active");
});
//Fonction servant à afficher en vert la catégorie sélectionnée
function allChildRemoveActive() {
  let tousLesBoutons = document.querySelectorAll(".divButton button");
  tousLesBoutons.forEach((boutons) => boutons.classList.remove("active"));
}
