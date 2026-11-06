/* Booking requires a configured Formspree endpoint and a completed privacy notice.
   All submission data goes directly to the chosen form service, never to GitHub. */
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
  const endpoint = (form.dataset.bookingEndpoint || "").trim();
  const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    dateInput.min = `${y}-${m}-${d}`;
  }
  const subject = new URLSearchParams(window.location.search).get("foredrag");
  if (subject) {
    const select = document.getElementById("topic");
    if (select && [...select.options].some((option) => option.value === subject)) select.value = subject;
  }
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
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Kunne ikke sende.");
      form.reset();
      status.textContent = "Takk! Forespørselen er mottatt. Dette er ikke en bekreftet booking.";
    } catch {
      status.textContent = "Beklager, noe gikk galt. Prøv igjen senere, eller ta kontakt via e-post.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Send bookingforespørsel";
      status.focus();
    }
  });
}
document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});