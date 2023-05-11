let form = document.querySelector("#form-login");
let inputSubmit = document.querySelector("#sub");
let messageForm = document.querySelector("#messageForm");
messageForm.classList.remove("active");
inputSubmit.addEventListener("click", connect);

async function connect(e) {
  e.preventDefault();
  let inputEmail = document.querySelector("#email");
  let inputPassword = document.querySelector("#password");
  if (inputEmail.value.length != 0 && inputPassword.value.length != 0) {
    let appel = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inputEmail.value,
        password: inputPassword.value,
      }),
    });
    if (appel.ok) {
      let response = await appel.json();
      console.log(response);
      let responseString = JSON.stringify(response);
      localStorage.setItem("authentification", responseString);
      window.document.location.href = "/pageAdministrateur/pageAdmin.html";
    } else {
      messageForm.classList.add("active");
      messageForm.innerText = "Email ou mot de passe incorrect";
    }
  } else {
    messageForm.classList.add("active");
    messageForm.innerText =
      "Veuillez remplir tous les champs pour vous connectez";
  }
}

function resetFields(...args) {
  for (let i = 0; i < arguments.length; i++) {
    args[i].value = "";
  }
}
