document.addEventListener("DOMContentLoaded", function () {
  const profileDropdown = document.querySelector(".group");
  const dropdownContent = profileDropdown.querySelector("ul");

  // Abra o dropdown quando o botão for clicado
  profileDropdown.addEventListener("click", function () {
    dropdownContent.classList.toggle("hidden");
  });

  // Feche o dropdown quando clicar fora dele
  document.addEventListener("click", function (event) {
    if (!profileDropdown.contains(event.target)) {
      dropdownContent.classList.add("hidden");
    }
  });
});
