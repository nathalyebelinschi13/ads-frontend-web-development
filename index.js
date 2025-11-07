// Entry point - Guardiões da Natureza
// Importa e inicializa todos os módulos JavaScript

import { roteador } from "./source/js/router.js";
import { themeHandler } from "./source/js/theme.js";
import { initAnimations } from "./source/js/animations.js";

// Inicializar roteamento SPA
roteador();

// Inicializar alternância de tema
themeHandler();

// Inicializar animações
document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
});