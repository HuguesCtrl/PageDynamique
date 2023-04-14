// Selection de la section qui contient tous les travaux
let galleryWork = document.querySelector(".gallery");
console.log(galleryWork);

let works = [];
//Allez rechercher les travaux de la gallerie via l'API et les stocker dans localStorage
let localWorks = localStorage.getItem("works");
if (localWorks === null) {
  let appel = await fetch("http://localhost:5678/api/works");
  let response = await appel.json();
  let responseString = JSON.stringify(response);
  localStorage.setItem("works", responseString);
} else {
  localWorks = JSON.parse(localWorks);
  works = localWorks;
}

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
