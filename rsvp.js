"use strict";

(() => {
  const dialog = document.querySelector("#rsvp");
  const form = document.querySelector("#rsvp-form");
  const title = document.querySelector("#rsvp-title");
  const closeButton = dialog.querySelector(".rsvp-close");
  const submitButton = form.querySelector(".rsvp-submit");
  const saveError = form.querySelector(".rsvp-save-error");
  const confirmation = dialog.querySelector(".rsvp-confirmation");
  const otherContainer = form.querySelector(".restriction-other");
  const nombre = form.elements.namedItem("nombre");
  const apellido = form.elements.namedItem("apellido");
  const otherInput = form.elements.namedItem("restriccion_otro");
  let isSaving = false;
  let attemptedSubmit = false;

  function restriction() {
    return form.elements.namedItem("restriccion_alimentaria").value;
  }

  function setError(id, control, message) {
    document.getElementById(id).textContent = message;
    control.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function syncOther() {
    const active = restriction() === "otros";
    otherInput.required = active;
    otherInput.disabled = !active;
    otherContainer.classList.toggle("is-open", active);
    otherContainer.setAttribute("aria-hidden", String(!active));
    otherContainer.toggleAttribute("inert", !active);
    if (!active) {
      otherInput.value = "";
      setError("otro-error", otherInput, "");
    }
  }

  function validate(focusFirst = false) {
    const attendance = form.elements.namedItem("asiste").value;
    const dietary = restriction();
    const fields = [
      ["nombre-error", nombre, nombre.value.trim() ? "" : "Completá tu nombre.", nombre],
      ["apellido-error", apellido, apellido.value.trim() ? "" : "Completá tu apellido.", apellido],
      ["asiste-error", document.getElementById("asiste-group"), attendance ? "" : "Elegí una opción.", form.querySelector('[name="asiste"]')],
      ["restriccion-error", document.getElementById("restriccion-group"), dietary ? "" : "Elegí una opción.", form.querySelector('[name="restriccion_alimentaria"]')],
      ["otro-error", otherInput, dietary === "otros" && !otherInput.value.trim() ? "Especificá tu restricción." : "", otherInput],
    ];
    for (const [id, control, message] of fields) setError(id, control, message);
    const firstInvalid = fields.find((field) => field[2]);
    if (focusFirst && firstInvalid) firstInvalid[3].focus();
    return !firstInvalid;
  }

  document.querySelectorAll("[data-open-rsvp]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.showModal();
      document.documentElement.classList.add("rsvp-open");
      (form.hidden ? document.getElementById("rsvp-thanks") : nombre).focus();
    });
  });

  closeButton.addEventListener("click", () => {
    if (!isSaving) dialog.close();
  });

  dialog.addEventListener("cancel", (event) => {
    if (isSaving) event.preventDefault();
  });

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("rsvp-open");
  });

  form.addEventListener("change", (event) => {
    if (event.target.name === "restriccion_alimentaria") syncOther();
    if (attemptedSubmit) validate();
    saveError.textContent = "";
  });

  form.addEventListener("input", () => {
    if (attemptedSubmit) validate();
    saveError.textContent = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSaving || form.hidden) return;
    attemptedSubmit = true;
    if (!validate(true)) return;

    const payload = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      asiste: form.elements.namedItem("asiste").value === "true",
      restriccion_alimentaria: restriction(),
      restriccion_otro: restriction() === "otros" ? otherInput.value.trim() : "",
    };

    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      saveError.textContent = "No pudimos guardar tu respuesta. Por favor, intentá nuevamente más tarde.";
      return;
    }

    isSaving = true;
    form.setAttribute("aria-busy", "true");
    saveError.textContent = "";
    closeButton.disabled = true;
    submitButton.textContent = "Guardando…";
    const controls = Array.from(form.elements, (control) => [control, control.disabled]);
    controls.forEach(([control]) => { control.disabled = true; });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Save failed");
      const result = await response.json();
      if (result.ok !== true) throw new Error("Save not confirmed");
      form.hidden = true;
      title.hidden = true;
      confirmation.hidden = false;
      dialog.setAttribute("aria-labelledby", "rsvp-thanks");
      document.getElementById("rsvp-thanks").focus();
    } catch {
      saveError.textContent = "No pudimos guardar tu respuesta. Por favor, intentá nuevamente.";
    } finally {
      clearTimeout(timeout);
      controls.forEach(([control, disabled]) => { control.disabled = disabled; });
      closeButton.disabled = false;
      submitButton.textContent = "Confirmar";
      form.removeAttribute("aria-busy");
      isSaving = false;
    }
  });
})();
