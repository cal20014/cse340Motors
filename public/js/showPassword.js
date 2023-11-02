const showPasswordBtn = document.querySelector("#show-password-btn");
showPasswordBtn.addEventListener("click", () => {
  const passwordInput = document.querySelector("#account_password");
  const type = passwordInput.getAttribute("type");
  if (type === "password") {
    passwordInput.setAttribute("type", "text");
    showPasswordBtn.innerHTML = "Hide Password";
  } else {
    passwordInput.setAttribute("type", "password");
    showPasswordBtn.innerHTML = "Show Password";
  }
});
