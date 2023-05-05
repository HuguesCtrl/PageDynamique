// Selection de la section qui contient tous les travaux
let galleryWork = document.querySelector(".gallery");
console.log(galleryWork);
let h2Projects = document.querySelector("#portfolio h2");
console.log(h2Projects);
//Création d'un tableau intitulé works qui récupère tous les travaux de l'Api
let works = [];
//Allez rechercher les travaux de la gallerie via l'API et les stocker dans le tableau
let appelWorks = await fetch("http://localhost:5678/api/works");
let responseWorks = await appelWorks.json();
works = await responseWorks;
console.log(works);

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

//Création d'un tableau intitulé categories qui récupère toutes les catégories des travaux
let categories = [];
//Récupération de toutes les catégories de l'API
let appelCategories = await fetch("http://localhost:5678/api/categories");
let responseCategories = await appelCategories.json();
categories = await responseCategories;

//Création des différents boutons de la gallerie via le Javascript
function createButton() {
  let divButton = document.createElement("div");
  divButton.setAttribute("class", "divButton");
  let createButton = document.createElement("button");
  createButton.innerText = "Tous";
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
//Appel à la fonction
createButton();

//Création des filtres selon les différentes catégories des travaux
//Renvois la catégorie Objet
let categorieObjets = works.filter(
  (filterCategorie) => filterCategorie.category.name === "Objets"
);
console.log(categorieObjets);
//Renvois la catégorie Appartement
let categorieAppartements = works.filter(
  (filterCategorie) => filterCategorie.category.name === "Appartements"
);
//Renvois la catégorie Hotel & restaurants
let categorieHotelsRestaurants = works.filter(
  (filterCategorie) => filterCategorie.category.name === "Hotels & restaurants"
);
//Récupération de tous les boutons créé via le DOM
let buttonTout = document.querySelector("#Bouton0");
buttonTout.classList.add("active");
let buttonObjets = document.querySelector("#Bouton1");
let buttonAppartements = document.querySelector("#Bouton2");
let buttonHotelsRestaurants = document.querySelector("#Bouton3");
//Affichage de tous les travaux
buttonTout.addEventListener("click", async function () {
  galleryWork.innerHTML = "";
  displayWorks(works);
  allChildRemoveActive();
  this.classList.add("active");
});
//Affichage de tous les travaux de la catégorie Appartement
buttonAppartements.addEventListener("click", function () {
  galleryWork.innerHTML = "";
  displayWorks(categorieAppartements);
  allChildRemoveActive();
  this.classList.add("active");
});
//Affichage de tous les travaux de la catégorie Objet
buttonObjets.addEventListener("click", function () {
  galleryWork.innerHTML = "";
  displayWorks(categorieObjets);
  allChildRemoveActive();
  this.classList.add("active");
});
//Affichage de tous les travaux de la catégorie Hotels et Restaurants
buttonHotelsRestaurants.addEventListener("click", function () {
  galleryWork.innerHTML = "";
  displayWorks(categorieHotelsRestaurants);
  allChildRemoveActive();
  this.classList.add("active");
});
//Fonction servant à afficher en vert la catégorie sélectionnée et à retirer le vert sur les autres boutons
function allChildRemoveActive() {
  let tousLesBoutons = document.querySelectorAll(".divButton button");
  tousLesBoutons.forEach((boutons) => boutons.classList.remove("active"));
}
