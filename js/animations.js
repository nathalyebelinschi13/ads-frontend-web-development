/**
 * Sistema de Animações - Guardiões da Natureza
 * Animações de scroll, transições de página e micro-interações
 */

export const initAnimations = () => {
  // Intersection Observer para animações de scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        // Opcional: parar de observar depois da primeira aparição
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos os elementos com classe animate-on-scroll
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => observer.observe(el));

  // Aplicar animação de entrada na página
  const mainContent = document.getElementById("__main--content");
  if (mainContent) {
    mainContent.classList.add("page-transition-enter");
  }

  // Adicionar classes de animação aos cards automaticamente
  const cards = document.querySelectorAll(
    ".project-card, .donation-method, .about__card, .section"
  );
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Smooth scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Atualizar o foco para acessibilidade
        target.setAttribute("tabindex", "-1");
        target.focus();
      }
    });
  });

  // Adicionar classe grid-stagger automaticamente aos grids
  const grids = document.querySelectorAll(
    ".projects__grid, .donations__ways, .container-grid"
  );
  grids.forEach((grid) => {
    grid.classList.add("grid-stagger");
  });

  // Adicionar animação de shake em erros de formulário
  const formGroups = document.querySelectorAll(".form-group");
  formGroups.forEach((group) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          if (group.classList.contains("form-group--error")) {
            group.classList.add("shake-error");
            setTimeout(() => {
              group.classList.remove("shake-error");
            }, 500);
          }
        }
      });
    });

    observer.observe(group, { attributes: true });
  });
};

// Adicionar animações aos elementos dinamicamente carregados
export const animateNewContent = (container) => {
  const elements = container.querySelectorAll(
    ".card, .section, .project-card, .donation-method"
  );
  elements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    setTimeout(() => {
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 100);
  });
};

// Efeito parallax suave (apenas para telas grandes)
export const initParallax = () => {
  if (window.innerWidth < 1024) return;

  const parallaxElements = document.querySelectorAll(
    ".hero, .hero__sections--bg"
  );

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((el) => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
};

// Prevenção de animações em movimento reduzido
export const respectReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty(
      "--animation-duration",
      "0.01ms"
    );
  }
};
