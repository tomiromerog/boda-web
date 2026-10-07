"use strict";

(() => {
  // =========================================================
  // SUPABASE
  // =========================================================

  const SUPABASE_URL = "https://nbgsjeehmxfofgmkbhen.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_IK8duoSk_YG2OJeXtafuAw_JBFsDPnM";

  const RSVP_ENDPOINT = `${SUPABASE_URL}/rest/v1/rsvp`;

  // =========================================================
  // ELEMENTOS
  // =========================================================

  const dialog = document.querySelector("#rsvp");
  const form = document.querySelector("#rsvp-form");
  const title = document.querySelector("#rsvp-title");
  const closeButton = dialog.querySelector(".rsvp-close");
  const submitButton = form.querySelector(".rsvp-submit");
  const saveError = form.querySelector(".rsvp-save-error");
  const confirmation = dialog.querySelector(".rsvp-confirmation");

  const nombre = form.elements.namedItem("nombre");
  const apellido = form.elements.namedItem("apellido");

  let isSaving = false;
  let attemptedSubmit = false;

  function setError(id, control, message) {
    document.getElementById(id).textContent = message;
    control.setAttribute("aria-invalid", String(Boolean(message)));
  }

  // =========================================================
  // VALIDACIÓN
  // =========================================================

  function validate(focusFirst = false) {
    const attendance = form.elements.namedItem("asiste").value;

    const fields = [
      [
        "nombre-error",
        nombre,
        nombre.value.trim() ? "" : "Completá tu nombre.",
        nombre,
      ],
      [
        "apellido-error",
        apellido,
        apellido.value.trim() ? "" : "Completá tu apellido.",
        apellido,
      ],
      [
        "asiste-error",
        document.getElementById("asiste-group"),
        attendance ? "" : "Elegí una opción.",
        form.querySelector('[name="asiste"]'),
      ],
    ];

    for (const [id, control, message] of fields) {
      setError(id, control, message);
    }

    const firstInvalid = fields.find((field) => field[2]);

    if (focusFirst && firstInvalid) {
      firstInvalid[3].focus();
    }

    return !firstInvalid;
  }

  // =========================================================
  // ABRIR / CERRAR RSVP
  // =========================================================

  document.querySelectorAll("[data-open-rsvp]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      dialog.showModal();
      document.documentElement.classList.add("rsvp-open");

      (
        form.hidden
          ? document.getElementById("rsvp-thanks")
          : nombre
      ).focus();
    });
  });

  closeButton.addEventListener("click", () => {
    if (!isSaving) {
      dialog.close();
    }
  });

  dialog.addEventListener("cancel", (event) => {
    if (isSaving) {
      event.preventDefault();
    }
  });

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("rsvp-open");
  });

  // =========================================================
  // CAMBIOS EN EL FORMULARIO
  // =========================================================

  form.addEventListener("change", () => {
    if (attemptedSubmit) {
      validate();
    }

    saveError.textContent = "";
  });

  form.addEventListener("input", () => {
    if (attemptedSubmit) {
      validate();
    }

    saveError.textContent = "";
  });

  // =========================================================
  // GUARDAR RSVP EN SUPABASE
  // =========================================================

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSaving || form.hidden) {
      return;
    }

    attemptedSubmit = true;

    if (!validate(true)) {
      return;
    }

    const payload = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      asiste: form.elements.namedItem("asiste").value === "true",
    };

    isSaving = true;

    form.setAttribute("aria-busy", "true");
    saveError.textContent = "";
    closeButton.disabled = true;
    submitButton.textContent = "Guardando…";

    const controls = Array.from(
      form.elements,
      (control) => [control, control.disabled]
    );

    controls.forEach(([control]) => {
      control.disabled = true;
    });

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 20000);

    try {
      const response = await fetch(RSVP_ENDPOINT, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_PUBLISHABLE_KEY,
          "Authorization": `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          "Prefer": "return=minimal",
        },

        body: JSON.stringify(payload),

        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Supabase:", response.status, errorText);
        throw new Error("No se pudo guardar el RSVP");
      }

      // ÉXITO

      form.hidden = true;
      title.hidden = true;
      confirmation.hidden = false;

      dialog.setAttribute(
        "aria-labelledby",
        "rsvp-thanks"
      );

      document
        .getElementById("rsvp-thanks")
        .focus();

    } catch (error) {
      console.error("Error guardando RSVP:", error);

      saveError.textContent =
        "No pudimos guardar tu respuesta. Por favor, intentá nuevamente.";

    } finally {
      clearTimeout(timeout);

      controls.forEach(([control, disabled]) => {
        control.disabled = disabled;
      });

      closeButton.disabled = false;
      submitButton.textContent = "Confirmar";
      form.removeAttribute("aria-busy");

      isSaving = false;
    }
  });
})();