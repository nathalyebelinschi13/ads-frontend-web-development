document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("nav__menu");

  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
      menu.classList.toggle("navbar__menu--open");
    });

    // Fechar menu ao clicar em um link
    menu.addEventListener("click", (e) => {
      if (e.target.classList.contains("navbar__menu--link")) {
        hamburger.setAttribute("aria-expanded", "false");
        menu.classList.remove("navbar__menu--open");
      }
    });
  }
});
