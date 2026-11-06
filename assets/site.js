// Sett denne til ditt faktiske Formspree-endepunkt når booking skal aktiveres.
// Eksempel: "https://formspree.io/f/xxxxxxxx"
const BOOKING_ENDPOINT = "";

document.querySelectorAll("[data-menu-toggle]").forEach((button) => {
  const nav = document.getElementById(button.getAttribute("aria-controls"));
  if (!nav) return;
  button.addEventListener("click", () => {
    const opened = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(opened));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  }));
});

const form = document.getElementById("booking-form");
if (form) {
  const submit = document.getElementById("booking-submit");
  const note = document.getElementById("booking-setup-note");
  const status = document.getElementById("booking-status");
  const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(BOOKING_ENDPOINT);
  if (configured) {
    note.hidden = true;
    submit.disabled = false;
    submit.textContent = "Send bookingforespørsel";
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!configured || !form.reportValidity()) return;
    status.textContent = "";
    submit.disabled = true;
    submit.textContent = "Sender …";
    try {
      const response = await fetch(BOOKING_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Skjemaet kunne ikke sendes.");
      form.reset();
      status.textContent = "Takk! Forespørselen er mottatt. Dette er ikke en bekreftet booking.";
      status.focus();
    } catch {
      status.textContent = "Beklager, noe gikk galt. Prøv igjen senere eller ta kontakt via e-post.";
      status.focus();
    } finally {
      submit.disabled = false;
      submit.textContent = "Send bookingforespørsel";
    }
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});