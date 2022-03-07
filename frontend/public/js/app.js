const home = document.getElementById("main-home");
if (home) {
  home.click();
}

//***********Authentication**********************/

setTimeout(() => {
  if (
    localStorage.authToken != null &&
    window.location.href == "http://localhost:8000/"
  ) {
    window.location.href = "/drive?";
  }
}, 100);

//*********************************************************/

const sign_in_btn = document.querySelector("#auth_sign-in-btn");
const sign_up_btn = document.querySelector("#auth_sign-up-btn");
const auth_container = document.querySelector(".auth_container");

if (sign_up_btn) {
  sign_up_btn.addEventListener("click", () => {
    auth_container.classList.add("auth_sign-up-mode");
  });
}

if (sign_in_btn) {
  sign_in_btn.addEventListener("click", () => {
    auth_container.classList.remove("auth_sign-up-mode");
  });
}

//*******************************/

var authName = document.getElementById("authName");

if (authName) {
  authName.innerHTML = JSON.parse(localStorage.getItem("authUser")).name;
}

//************************************************/
