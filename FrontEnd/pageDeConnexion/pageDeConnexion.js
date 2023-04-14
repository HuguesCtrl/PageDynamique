let form = document.querySelector("#form-login");
let inputSubmit = document.querySelector("#sub");

inputSubmit.addEventListener("click", connect);

function connect(e) {
  e.preventDefault();
  let inputEmail = document.querySelector("#email");
  let inputPassword = document.querySelector("#password");
  if (!inputEmail.value.length == 0 && !inputPassword.value.length == 0) {
    if (
      inputEmail.value === "sophie.bluel@test.tld" &&
      inputPassword.value === "S0phie"
    ) {
      window.document.location.href =
        "http://127.0.0.1:5500/FrontEnd/pageAdministrateur/pageAdmin.html";
    } else {
      alert("Mot de passe ou email incorrect");
    }
  } else {
    alert("Veuillez remplir tous les champs");
  }
}
