export const roteador = () => {
  const urlPageTitle = "Guardiões da Natureza";

  const routes = {
    404: {
      template: "./source/html/404.html",
      title: "404 | " + urlPageTitle,
      description: "Página não encontrada",
    },
    "/": {
      template: "./source/html/home.html",
      title: urlPageTitle,
      description: "Página Inicial",
    },
    sobre: {
      template: "./source/html/sobre.html",
      title: "Sobre | " + urlPageTitle,
      description: "Sessão Sobre",
    },
    projetos: {
      template: "./source/html/projetos.html",
      title: "Projetos | " + urlPageTitle,
      description: "Sessão de Projetos",
    },
    doacoes: {
      template: "./source/html/doacoes.html",
      title: "Doações | " + urlPageTitle,
      description: "Página de Doações",
    },
    contato: {
      template: "./source/html/contato.html",
      title: "Contato | " + urlPageTitle,
      description: "Página de Contato",
    },
  };

  const locationHandler = async () => {
    let location = window.location.hash.replace("#", "");
    let anchor = "";

    // Verificar se há âncora
    if (location.includes("#")) {
      [location, anchor] = location.split("#");
    }

    if (location.length == 0) {
      location = "/";
    }

    const rout = routes[location] || routes[404];
    const html = await fetch(rout.template).then((response) => response.text());
    const mainContent = document.getElementById("__main--content");
    mainContent.innerHTML = html;
    document.title = rout.title;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", rout.description);

    // Adicionar classe de transição de página
    mainContent.classList.add("page-transition-enter");

    // Reinicializar animações após carregar novo conteúdo
    setTimeout(async () => {
      const { initAnimations } = await import("./animations.js");
      initAnimations();
    }, 50);

    // Inicializar validação do formulário se estiver na página de contato
    if (location === "contato") {
      // Pequeno delay para garantir que o DOM seja carregado
      setTimeout(async () => {
        const { FormValidator, addCharacterCounter } = await import(
          "./form-validation.js"
        );
        new FormValidator("contact-form");
        addCharacterCounter("message", 1000);
      }, 100);
    }

    // Scroll para âncora se existir
    if (anchor) {
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } else {
      // Scroll para o topo se não houver âncora
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Adicionar event listeners aos links de navegação para garantir navegação
  const navLinks = document.querySelectorAll(".__navbar--menu_link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href && href !== "/" && href !== "#") {
        window.location.hash = href;
      } else {
        window.location.hash = "";
      }
      // Fechar menu mobile se estiver aberto
      const navMenu = document.querySelector("#__nav--menu");
      const hamburgerBtn = document.querySelector("#__hamburger--btn");
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        hamburgerBtn.classList.remove("active");
      }
    });
  });

  window.addEventListener("hashchange", locationHandler);

  locationHandler();
};
