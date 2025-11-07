/**
 * Validação de Formulário - Guardiões da Natureza
 * Sistema completo de validação com feedback visual e máscaras
 */

export class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.fields = {
      name: this.form.querySelector("#name"),
      email: this.form.querySelector("#email"),
      phone: this.form.querySelector("#phone"),
      subject: this.form.querySelector("#subject"),
      message: this.form.querySelector("#message"),
    };

    this.init();
  }

  init() {
    // Aplicar máscaras
    this.applyMasks();

    // Validação em tempo real
    Object.entries(this.fields).forEach(([key, field]) => {
      if (field) {
        field.addEventListener("blur", () => this.validateField(key));
        field.addEventListener("input", () => this.clearError(key));
      }
    });

    // Validação no submit
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  applyMasks() {
    if (this.fields.phone) {
      this.fields.phone.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 6) {
          value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
        } else if (value.length > 2) {
          value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
        } else if (value.length > 0) {
          value = value.replace(/^(\d*)/, "($1");
        }

        e.target.value = value;
      });
    }
  }

  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return true;

    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        if (value.length < 3) {
          isValid = false;
          errorMessage = "Nome deve ter pelo menos 3 caracteres";
        } else if (!/^[a-záàâãéèêíïóôõöúçñ\s]+$/i.test(value)) {
          isValid = false;
          errorMessage = "Nome deve conter apenas letras";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = "E-mail inválido";
        }
        break;

      case "phone":
        const phoneClean = value.replace(/\D/g, "");
        if (value && phoneClean.length < 10) {
          isValid = false;
          errorMessage = "Telefone deve ter 10 ou 11 dígitos";
        }
        break;

      case "subject":
        if (!value) {
          isValid = false;
          errorMessage = "Selecione um assunto";
        }
        break;

      case "message":
        if (value.length < 10) {
          isValid = false;
          errorMessage = "Mensagem deve ter pelo menos 10 caracteres";
        } else if (value.length > 1000) {
          isValid = false;
          errorMessage = "Mensagem muito longa (máximo 1000 caracteres)";
        }
        break;
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.clearError(fieldName);
    }

    return isValid;
  }

  showError(field, message) {
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    // Remove erro existente
    const existingError = formGroup.querySelector(".form-group__error");
    if (existingError) existingError.remove();

    // Adiciona classe de erro
    formGroup.classList.add("form-group--error");
    field.setAttribute("aria-invalid", "true");

    // Cria mensagem de erro
    const errorDiv = document.createElement("div");
    errorDiv.className = "form-group__error";
    errorDiv.textContent = message;
    errorDiv.setAttribute("role", "alert");

    formGroup.appendChild(errorDiv);

    // Feedback visual
    field.focus();
  }

  clearError(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return;

    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    formGroup.classList.remove("form-group--error");
    field.removeAttribute("aria-invalid");

    const errorDiv = formGroup.querySelector(".form-group__error");
    if (errorDiv) errorDiv.remove();
  }

  handleSubmit(e) {
    e.preventDefault();

    // Validar todos os campos obrigatórios
    const requiredFields = ["name", "email", "subject", "message"];
    let isFormValid = true;

    requiredFields.forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isFormValid = false;
      }
    });

    // Validar telefone se preenchido
    if (this.fields.phone.value) {
      if (!this.validateField("phone")) {
        isFormValid = false;
      }
    }

    if (isFormValid) {
      this.submitForm();
    } else {
      // Focar no primeiro campo com erro
      const firstError = this.form.querySelector(
        ".form-group--error input, .form-group--error select, .form-group--error textarea"
      );
      if (firstError) {
        firstError.focus();
      }

      // Mensagem de feedback
      this.showFormMessage(
        "Por favor, corrija os erros antes de enviar.",
        "error"
      );
    }
  }

  async submitForm() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    // Mostrar loading
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    try {
      // Simulação de envio (substituir por endpoint real)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Sucesso
      this.showFormMessage(
        "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        "success"
      );
      this.form.reset();

      // Log para desenvolvimento
      console.log("Dados do formulário:", data);
    } catch (error) {
      // Erro
      this.showFormMessage(
        "Erro ao enviar mensagem. Tente novamente mais tarde.",
        "error"
      );
      console.error("Erro no envio:", error);
    } finally {
      // Restaurar botão
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  showFormMessage(message, type) {
    // Remove mensagem existente
    const existingMessage = this.form.querySelector(".form-message");
    if (existingMessage) existingMessage.remove();

    // Cria nova mensagem
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.textContent = message;
    messageDiv.setAttribute("role", type === "error" ? "alert" : "status");

    // Insere antes do botão de submit
    const submitButton = this.form.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(messageDiv, submitButton);

    // Remove após 5 segundos
    setTimeout(() => {
      messageDiv.style.opacity = "0";
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }
}

// Contador de caracteres para textarea
export function addCharacterCounter(textareaId, maxLength = 1000) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;

  const counter = document.createElement("div");
  counter.className = "character-counter";
  counter.setAttribute("aria-live", "polite");

  const updateCounter = () => {
    const remaining = maxLength - textarea.value.length;
    counter.textContent = `${textarea.value.length}/${maxLength} caracteres`;
    counter.style.color =
      remaining < 100 ? "var(--c-secundaria)" : "var(--text-secondary)";
  };

  textarea.parentNode.appendChild(counter);
  textarea.addEventListener("input", updateCounter);
  updateCounter();
}
