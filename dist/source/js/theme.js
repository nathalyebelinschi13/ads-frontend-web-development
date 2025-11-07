export const themeHandler = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.getElementById("theme-button");
    const html = document.documentElement;

    // Função para aplicar o tema
    const applyTheme = (theme) => {
      html.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      // Atualizar imagem do botão com animação
      const img = themeButton.querySelector("img");
      if (img) {
        img.style.opacity = "0";
        setTimeout(() => {
          img.src = `./source/images/icons/Visual/Modo ${theme === "dark" ? "Light" : "Dark"}.svg`;
          img.alt = `Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`;
          img.style.opacity = "1";
        }, 200); // Tempo da transição
      }
    };

    // Detectar preferência do sistema
    const getSystemTheme = () => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    // Inicializar tema
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || getSystemTheme();
    applyTheme(initialTheme);

    // Alternar tema ao clicar no botão
    if (themeButton) {
      themeButton.addEventListener("click", (e) => {
        e.preventDefault();
        const currentTheme = html.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme(newTheme);
      });
    }

    // Ouvir mudanças na preferência do sistema se não houver tema salvo
    if (!savedTheme) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          const newTheme = e.matches ? "dark" : "light";
          applyTheme(newTheme);
        });
    }
  });
};
